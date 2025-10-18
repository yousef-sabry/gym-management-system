import React, { useState, useMemo, useRef, useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";
import { gsap } from "gsap";
import "./Members.css";

const PLAN_OPTIONS = ["Monthly", "3 Months", "Yearly"];
const FALLBACK_TRAINERS = ["Omar Khaled", "Laila Hassan", "Ahmed Reda"];

const Members = () => {
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
const [selectedEmail, setSelectedEmail] = useState("");
const [workoutName, setWorkoutName] = useState("");
const [workoutDay, setWorkoutDay] = useState("");
const [workoutDuration, setWorkoutDuration] = useState("");

  const { members, addMember, updateMember, deleteMember } = useAdmin();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    age: "",
    plan: "Monthly",
    trainer: "",
    startDate: "",
    endDate: "",
    image: "",
  });
  const [editingMember, setEditingMember] = useState(null);

  const formRef = useRef(null);
  const tableRef = useRef(null);

  // GSAP entry animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".members-page .page-title", { y: -10, opacity: 0, duration: 0.5 });
      gsap.from(".members-controls", { x: -10, opacity: 0, duration: 0.5, delay: 0.1 });
      gsap.from(".add-form", { y: 10, opacity: 0, duration: 0.5, delay: 0.2 });
      gsap.from(".members-table tbody tr", {
        y: 8,
        opacity: 0,
        stagger: 0.05,
        duration: 0.4,
        delay: 0.3,
      });
    }, formRef);

    return () => ctx.revert();
  }, [members]);

  // derive trainer options from existing members + fallback
  const trainerOptions = useMemo(() => {
    const uniq = Array.from(new Set(members.map((m) => m.trainer).filter(Boolean)));
    const combined = [...uniq, ...FALLBACK_TRAINERS].filter((v, i, a) => a.indexOf(v) === i);
    return combined;
  }, [members]);

  // filtered & sorted members (preserve original logic)
  const filteredMembers = useMemo(() => {
    return members.filter((m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.email && m.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, members]);

  const sortedMembers = useMemo(() => {
    if (!sortField) return filteredMembers;
    return [...filteredMembers].sort((a, b) => {
      const A = (a[sortField] || "").toString().toLowerCase();
      const B = (b[sortField] || "").toString().toLowerCase();
      return A.localeCompare(B);
    });
  }, [sortField, filteredMembers]);

  // helpers: compute endDate from start & plan
  const calculateEndDateFrom = (startIso, plan) => {
    const start = startIso ? new Date(startIso) : new Date();
    const end = new Date(start);
    switch (plan) {
      case "Monthly":
        end.setMonth(end.getMonth() + 1);
        break;
      case "3 Months":
        end.setMonth(end.getMonth() + 3);
        break;
      case "Yearly":
        end.setFullYear(end.getFullYear() + 1);
        break;
      default:
        end.setMonth(end.getMonth() + 1);
    }
    return end.toISOString().split("T")[0];
  };

  // when plan or startDate changes on form, auto-update endDate
  useEffect(() => {
    const { plan, startDate } = newMember;
    if (plan) {
      const calculated = calculateEndDateFrom(startDate || null, plan);
      setNewMember((prev) => ({ ...prev, endDate: calculated }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMember.plan, newMember.startDate]);

  // ➕ إضافة عضو جديد (يحافظ على اللوجيك: يستدعي addMember من الـ context)
  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.plan) {
      return alert("Please fill required fields (name & plan).");
    }

    // ensure startDate/endDate set: if empty, set start = today
    const start = newMember.startDate || new Date().toISOString().split("T")[0];
    const end = newMember.endDate || calculateEndDateFrom(start, newMember.plan);

  const memberToAdd = {
  id: Date.now(),
  ...newMember,
  startDate: start,
  endDate: end,
  image: newMember.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(newMember.name || "User")}&background=ff6b35&color=fff`,
  workouts: [], // ✅ خاصية جديدة علشان نربط بيها التمارين
};

    addMember(memberToAdd);

    // small add animation
    gsap.fromTo(
      ".members-table tbody tr:first-child",
      { scale: 0.98, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.35 }
    );

    // reset form
    setNewMember({
      name: "",
      email: "",
      age: "",
      plan: "Monthly",
      trainer: "",
      startDate: "",
      endDate: "",
      image: "",
    });
  };

  // ✏️ تعديل عضو
  const handleEditMember = (id) => {
    const member = members.find((m) => m.id === id);
    setEditingMember(member ? { ...member } : null);
    // open scroll to edit form
    setTimeout(() => {
      const el = document.querySelector(".edit-form");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingMember) return;
    // ensure endDate consistent if plan/startDate changed
    const end = editingMember.endDate || calculateEndDateFrom(editingMember.startDate, editingMember.plan);
    updateMember({ ...editingMember, endDate: end });
    setEditingMember(null);
  };

  // 🗑️ حذف عضو
  const handleDeleteMember = (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      deleteMember(id);
    }
  };

  // 🏋️‍♀️ إضافة تمرين لعضو
// 🏋️‍♀️ فتح نموذج إضافة تمرين
const handleAddWorkout = (email) => {
  setSelectedEmail(email);
  setShowWorkoutForm(true);
};
const handleSaveWorkout = (e) => {
  e.preventDefault();
  if (!workoutName || !workoutDay) {
    alert("Please fill in all fields!");
    return;
  }

  const existingWorkouts = JSON.parse(localStorage.getItem(`workouts_${selectedEmail}`)) || [];
  const newWorkout = {
    id: Date.now(),
    name: workoutName,
    day: workoutDay,
    duration: workoutDuration || "30 mins",
  };

  const updated = [...existingWorkouts, newWorkout];
  localStorage.setItem(`workouts_${selectedEmail}`, JSON.stringify(updated));

  setShowWorkoutForm(false);
  setWorkoutName("");
  setWorkoutDay("");
  setWorkoutDuration("");
  alert("✅ Workout added successfully!");
};



  return (
    <div className="members-page" ref={formRef}>
      <div className="page-header">
        <h1 className="page-title">Members Management</h1>
        <div className="header-actions">
          <input
            className="search-input"
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="sort-select"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="plan">Plan</option>
            <option value="startDate">Start Date</option>
          </select>
        </div>
      </div>

      <div className="members-grid">
        {/* Add Form */}
        <form className="card add-form" onSubmit={handleAddMember}>
          <h3 className="card-title">Add New Member</h3>

          <div className="row">
            <label>
              Name
              <input
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              />
            </label>
          </div>

          <div className="row">
            <label>
              Age
              <input
                type="number"
                min="10"
                value={newMember.age}
                onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
              />
            </label>

            <label>
              Plan
              <select
                value={newMember.plan}
                onChange={(e) => setNewMember({ ...newMember, plan: e.target.value })}
              >
                {PLAN_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="row">
            <label>
              Trainer
              <select
                value={newMember.trainer}
                onChange={(e) => setNewMember({ ...newMember, trainer: e.target.value })}
              >
                <option value="">Select trainer</option>
                {trainerOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Image URL
              <input
                placeholder="Optional image URL"
                value={newMember.image}
                onChange={(e) => setNewMember({ ...newMember, image: e.target.value })}
              />
            </label>
          </div>

          <div className="row">
            <label>
              Start Date
              <input
                type="date"
                value={newMember.startDate}
                onChange={(e) => setNewMember({ ...newMember, startDate: e.target.value })}
              />
            </label>

            <label>
              End Date
              <input
                type="date"
                value={newMember.endDate}
                onChange={(e) => setNewMember({ ...newMember, endDate: e.target.value })}
              />
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn primary">
              Add Member
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={() =>
                setNewMember({
                  name: "",
                  email: "",
                  age: "",
                  plan: "Monthly",
                  trainer: "",
                  startDate: "",
                  endDate: "",
                  image: "",
                })
              }
            >
              Reset
            </button>
          </div>
        </form>

        {/* Members Table */}
        <div className="card table-card" ref={tableRef}>
          <h3 className="card-title">Members</h3>
          <div className="table-wrap">
            <table className="members-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Plan</th>
                  <th>Trainer</th>
                  <th>Period</th>
                  <th>Days Left</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedMembers.map((m) => {
                  const daysLeft = Math.max(
                    0,
                    Math.ceil((new Date(m.endDate) - new Date()) / (1000 * 60 * 60 * 24))
                  );
                  return (
                    <tr key={m.id}>
                      <td className="member-cell">
                        <img className="avatar" src={m.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=ff6b35&color=fff`} alt={m.name} />
                        <div>
                          <div className="member-name">{m.name}</div>
                          <div className="member-email">{m.email}</div>
                        </div>
                      </td>
                      <td>{m.plan}</td>
                      <td>{m.trainer}</td>
                      <td>
                        <div className="period">
                          <span>{m.startDate}</span>
                          <span>→</span>
                          <span>{m.endDate}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`pill ${daysLeft <= 5 ? "danger" : "success"}`}>
                          {daysLeft}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button className="icon-btn" onClick={() => handleEditMember(m.id)} title="Edit">
                          ✏️
                        </button>
                        <button className="icon-btn" onClick={() => handleDeleteMember(m.id)} title="Delete">
                          🗑️
                        </button>
                         <button
    className="icon-btn"
    onClick={() => handleAddWorkout(m.email)}
    title="Add Workout"
  >
    🏋️
  </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Edit form */}
          {editingMember && (
            <form className="card edit-form" onSubmit={handleSaveEdit}>
              <h4>Edit Member</h4>
              <div className="row">
                <label>
                  Name
                  <input
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={editingMember.email}
                    onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                  />
                </label>
              </div>

              <div className="row">
                <label>
                  Plan
                  <select
                    value={editingMember.plan}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, plan: e.target.value, endDate: calculateEndDateFrom(editingMember.startDate || null, e.target.value) })
                    }
                  >
                    {PLAN_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Trainer
                  <select
                    value={editingMember.trainer}
                    onChange={(e) => setEditingMember({ ...editingMember, trainer: e.target.value })}
                  >
                    <option value="">Select trainer</option>
                    {trainerOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="row">
                <label>
                  Start Date
                  <input
                    type="date"
                    value={editingMember.startDate}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        startDate: e.target.value,
                        endDate: calculateEndDateFrom(e.target.value, editingMember.plan),
                      })
                    }
                  />
                </label>

                <label>
                  End Date
                  <input
                    type="date"
                    value={editingMember.endDate}
                    onChange={(e) => setEditingMember({ ...editingMember, endDate: e.target.value })}
                  />
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn primary">Save</button>
                <button type="button" className="btn ghost" onClick={() => setEditingMember(null)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
      {showWorkoutForm && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Add Workout</h3>
      <form onSubmit={handleSaveWorkout}>
        <label>Workout Name:</label>
        <input
          type="text"
          placeholder="e.g., Chest Day"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
        />

        <label>Day:</label>
        <input
          type="text"
          placeholder="e.g., Monday"
          value={workoutDay}
          onChange={(e) => setWorkoutDay(e.target.value)}
        />

        <label>Duration:</label>
        <input
          type="text"
          placeholder="e.g., 45 mins"
          value={workoutDuration}
          onChange={(e) => setWorkoutDuration(e.target.value)}
        />

        <div className="modal-buttons">
          <button type="submit" className="btn-success">Save</button>
          <button type="button" className="btn-danger" onClick={() => setShowWorkoutForm(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

// helper used inside edit handler (copied here to be available)
function calculateEndDateFrom(startIso, plan) {
  const start = startIso ? new Date(startIso) : new Date();
  const end = new Date(start);
  switch (plan) {
    case "Monthly":
      end.setMonth(end.getMonth() + 1);
      break;
    case "3 Months":
      end.setMonth(end.getMonth() + 3);
      break;
    case "Yearly":
      end.setFullYear(end.getFullYear() + 1);
      break;
    default:
      end.setMonth(end.getMonth() + 1);
  }
  return end.toISOString().split("T")[0];
}

export default Members;
