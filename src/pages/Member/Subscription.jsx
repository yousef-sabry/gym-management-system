import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import Notification from "../../components/Notification/Notification";
import "./Subscription.css";

const Subscription = ({ loggedInEmail }) => {
  const { members, setMembers, trainers } = useAdmin();
  const [showRenewForm, setShowRenewForm] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("1 Month");
  const [selectedPeriod, setSelectedPeriod] = useState("Morning");
  const [notification, setNotification] = useState(null);

  // ✅ جلب بيانات العضو
  const member = members.find((m) => m.email === loggedInEmail);
  if (!member) return <p>Loading member data...</p>;

  // ✅ حساب الأيام المتبقية
  const today = new Date();
  const endDate = new Date(member.endDate);
  const diffDays = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));

  // ✅ دالة لتجديد الاشتراك
  const handleRenew = (e) => {
    e.preventDefault();

    const newEndDate = new Date();
    if (selectedDuration === "1 Month") newEndDate.setMonth(newEndDate.getMonth() + 1);
    if (selectedDuration === "3 Months") newEndDate.setMonth(newEndDate.getMonth() + 3);
    if (selectedDuration === "6 Months") newEndDate.setMonth(newEndDate.getMonth() + 6);

    const updatedMembers = members.map((m) =>
      m.email === loggedInEmail
        ? {
            ...m,
            trainer: selectedTrainer || m.trainer,
            startDate: today.toISOString().split("T")[0],
            endDate: newEndDate.toISOString().split("T")[0],
            period: selectedPeriod,
            status: "Active",
          }
        : m
    );

    setMembers(updatedMembers);
    localStorage.setItem("members", JSON.stringify(updatedMembers));
    setShowRenewForm(false);

    // ✅ عرض إشعار جميل بدل alert
    setNotification({
      message: "✅ Subscription renewed successfully!",
      type: "success",
    });
  };

  return (
    <div className="subscription-container">
      {/* ✅ إشعار جميل */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <h2>Subscription Details</h2>
      <h3 className="name-member">{member.name}</h3>

      <div className={`subscription-content ${showRenewForm ? "split-view" : ""}`}>
        {/* ✅ معلومات الاشتراك */}
        <div className="subscription-info">
          <p><strong>Plan:</strong> {member.plan}</p>
          <p><strong>Trainer:</strong> {member.trainer}</p>
          <p><strong>Start Date:</strong> {member.startDate}</p>
          <p><strong>End Date:</strong> {member.endDate}</p>
          <p><strong>Period:</strong> {member.period || "Not set"}</p>
          <p><strong>Days Left:</strong> {diffDays} days</p>

          {/* ✅ Progress Bar */}
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${Math.min((diffDays / 30) * 100, 100)}%` }}
            ></div>
          </div>

          <button
            className="btn-primary"
            onClick={() => setShowRenewForm(!showRenewForm)}
          >
            {showRenewForm ? "Cancel" : "Renew Subscription"}
          </button>
        </div>

        {/* ✅ نموذج التجديد (يظهر على اليمين بجانب التفاصيل) */}
        {showRenewForm && (
          <div className="renew-form">
            <h3>Renew Subscription</h3>

            <label>Trainer:</label>
            <select
              value={selectedTrainer}
              onChange={(e) => setSelectedTrainer(e.target.value)}
              required
            >
              <option value="">Select Trainer</option>
              {trainers.map((t, idx) => (
                <option key={idx} value={t.name}>{t.name}</option>
              ))}
            </select>

            <label>Duration:</label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
            >
              <option>1 Month</option>
              <option>3 Months</option>
              <option>6 Months</option>
            </select>

            <label>Period:</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option>Morning</option>
              <option>Evening</option>
            </select>

            <button type="submit" className="btn-success" onClick={handleRenew}>
              Confirm Renewal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscription;
