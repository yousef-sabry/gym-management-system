import React, { useEffect, useState } from "react";
import { useAdmin } from "../../context/AdminContext"; // لو عايز تجيب بيانات fakeData من هنا
import { FaUser, FaDumbbell, FaCalendarAlt, FaWallet } from "react-icons/fa";
import "./DashboardMember.css";

const Dashboard = ({ loggedInEmail }) => {
  const { members: adminMembers } = useAdmin(); // من context لو عايز الداتا الافتراضية
  const [member, setMember] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    if (!loggedInEmail) return;

    // ====== Get Member Data ======
    const storedMembers = JSON.parse(localStorage.getItem("members")) || [];
    const foundMember = storedMembers.find(
      (m) => m.email === loggedInEmail
    ) || adminMembers.find((m) => m.email === loggedInEmail); // لو مش موجود في localStorage ناخد من fakeData

    setMember(foundMember);

    // ====== Get Subscription Data ======
    const storedSubscriptions =
      JSON.parse(localStorage.getItem("subscriptions")) || [];
    const foundSub = storedSubscriptions.find(
      (s) => s.memberId === foundMember?.id
    );
    setSubscription(foundSub);

    // ====== Get Workouts Data ======
    const localWorkouts =
      JSON.parse(localStorage.getItem(`workouts_${loggedInEmail}`)) || [];

    let finalWorkouts = [];

    if (foundMember) {
      // لو العضو موجود في fakeData → ندمج التمارين الافتراضية + أي تمارين في localStorage
      finalWorkouts = [...(foundMember.workouts || []), ...localWorkouts];
    } else {
      // لو العضو جديد → نستخدم التمارين المخزنة في localStorage فقط
      finalWorkouts = localWorkouts;
    }

    setWorkouts(finalWorkouts);
  }, [loggedInEmail, adminMembers]);

  return (
    <div className="dashboard-container">
      <h1 className="title-page">Member Dashboard</h1>

      {member ? (
        <>
          {/* ===== Top Summary Cards ===== */}
          <div className="dashboard-cards">
            <div className="card">
              <FaUser className="icon" />
              <img className="card-image " src={member.image} alt={member.name} />
              <h3>{member.name}</h3>
              <p>Trainer: {member.trainer}</p>
            </div>

            <div className="card">
              <FaCalendarAlt className="icon" />
              <h3>{member.plan || "No Plan"}</h3>
              <p>
                {member.startDate} → {member.endDate}
              </p>
            </div>

            <div className="card">
              <FaWallet className="icon" />
              <h3>Status</h3>
              <p>{member.status}</p>
            </div>

            <div className="card">
              <FaDumbbell className="icon" />
              <h3>Workouts</h3>
              <p>{workouts.length} total</p>
            </div>
          </div>

          {/* ===== Workouts Table ===== */}
          <div className="dashboard-table">
            <h2>Workout Schedule</h2>
            {workouts.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Workout Name</th>
                    <th>Day</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.map((w, index) => (
                    <tr key={w.id || index}>
                      <td>{w.name}</td>
                      <td>{w.day}</td>
                      <td>{w.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No workouts added yet.</p>
            )}
          </div>
        </>
      ) : (
        <p className="no-data">No member data found.</p>
      )}
    </div>
  );
};

export default Dashboard;
