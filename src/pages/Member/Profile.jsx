import React, { useEffect, useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = ({ loggedInEmail }) => {
  const { members } = useAdmin();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [memberData, setMemberData] = useState(null);

  useEffect(() => {
    if (!loggedInEmail) return;

    // ===== نحاول نجيب العضو من context أولًا =====
    let foundMember = members.find(
      (m) => m.email.toLowerCase() === loggedInEmail.toLowerCase()
    );

    // ===== لو العضو مش موجود في context → نبحث في localStorage =====
    if (!foundMember) {
      const storedMembers = JSON.parse(localStorage.getItem("members")) || [];
      foundMember = storedMembers.find(
        (m) => m.email.toLowerCase() === loggedInEmail.toLowerCase()
      );
    }

    setMemberData(foundMember);

    // ===== نحضر التمارين =====
    const localWorkouts =
      JSON.parse(localStorage.getItem(`workouts_${loggedInEmail}`)) || [];
    // لو العضو موجود في context/ fakedata ندمج التمارين الافتراضية + اللي في local
    const finalWorkouts = foundMember
      ? [...(foundMember.workouts || []), ...localWorkouts]
      : localWorkouts;

    setWorkouts(finalWorkouts);
  }, [loggedInEmail, members]);

  if (!memberData) {
    return (
      <div className="profile-container">
        <p>Loading member data...</p>
      </div>
    );
  }

  const calculateProgress = (member) => {
    const start = new Date(member.startDate);
    const end = new Date(member.endDate);
    const today = new Date();
    const total = end - start;
    const elapsed = today - start;
    const progress = (elapsed / total) * 100;
    return progress > 100 ? 100 : progress < 0 ? 0 : progress;
  };

  const handleRenewClick = () => {
    navigate("/subscription");
  };

  return (
    <div className="profile-container">
      <div className="profile-left">
        <img src={memberData.image} alt={memberData.name} />
        <h2>{memberData.name}</h2>
        <p>{memberData.email}</p>
        <p
          className={`status ${
            memberData.status?.toLowerCase() === "active"
              ? "active-status"
              : "inactive-status"
          }`}
        >
          Status: {memberData.status || "N/A"}
        </p>
      </div>

      <div className="profile-right">
        <h3>Subscription Details</h3>
        <p>
          <strong>Plan:</strong> {memberData.plan || "N/A"}
        </p>
        <p>
          <strong>Start Date:</strong> {memberData.startDate || "N/A"}
        </p>
        <p>
          <strong>End Date:</strong> {memberData.endDate || "N/A"}
        </p>
        <p>
          <strong>Trainer:</strong> {memberData.trainer || "N/A"}
        </p>

        <div className="subscription-progress">
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${calculateProgress(memberData)}%` }}
            ></div>
          </div>
          <button onClick={handleRenewClick} className="btn-primary">
            Renew Subscription
          </button>
        </div>

        <div className="workout-schedule">
          <h3>Workout Schedule</h3>
          {workouts.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Workout Name</th>
                  <th>Day</th>
                  <th>Duration</th>
                  <th>Trainer</th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((w, index) => (
                  <tr key={index}>
                    <td>{w.name}</td>
                    <td>{w.day}</td>
                    <td>{w.duration}</td>
                    <td>{memberData.trainer || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No workouts added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
