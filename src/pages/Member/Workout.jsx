import React, { useEffect, useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { FaUser, FaDumbbell, FaClock, FaCalendarAlt, FaUserTie } from "react-icons/fa";
import "./Workout.css";

const Workout = ({ loggedInEmail }) => {
  const { members } = useAdmin();
  const [workouts, setWorkouts] = useState([]);
  const [member, setMember] = useState(null);

  useEffect(() => {
    if (!loggedInEmail) return;

    // جلب العضو من context
    const currentMember = members.find((m) => m.email === loggedInEmail);

    setMember(currentMember);

    const localKey = `workouts_${loggedInEmail}`;
    const storedWorkouts = JSON.parse(localStorage.getItem(localKey)) || [];

    let finalWorkouts = [];

    if (currentMember) {
      // لو العضو موجود في fakeData → ندمج تمارينه الافتراضية + أي تمارين موجودة في localStorage
      finalWorkouts = [...currentMember.workouts, ...storedWorkouts];
    } else {
      // لو العضو جديد → نستخدم التمارين المخزنة في localStorage فقط
      finalWorkouts = storedWorkouts;
    }

    setWorkouts(finalWorkouts);

  }, [loggedInEmail, members]);

  return (
    <div className="workout-container">
      {member ? (
        <div className="member-header">
          <img
            src={member.image || "https://via.placeholder.com/100"}
            alt={member.name}
            className="member-img"
          />
          <div className="member-info">
            <h2><FaUser /> {member.name}</h2>
            <p><FaUserTie /> Trainer: <strong>{member.trainer}</strong></p>
            <p>Plan: {member.plan}</p>
          </div>
        </div>
      ) : (
        <p className="no-member">No member data found.</p>
      )}

      <h3 className="workout-title"><FaDumbbell /> Your Workout Schedule</h3>

      {workouts.length > 0 ? (
        <div className="workout-table-wrapper">
          <table className="workout-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Workout Name</th>
                <th>Day</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout, index) => (
                <tr key={workout.id || index}>
                  <td>{index + 1}</td>
                  <td>{workout.name}</td>
                  <td><FaCalendarAlt className="icon-inline" /> {workout.day}</td>
                  <td><FaClock className="icon-inline" /> {workout.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-data">No workouts found for your account.</p>
      )}
    </div>
  );
};

export default Workout;
