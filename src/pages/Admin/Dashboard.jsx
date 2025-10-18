// src/pages/Admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  payments,
  subscriptions,
  trainers,
  activities,
} from "../../utils/fakeData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAdmin } from "../../context/AdminContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { members  , trainers  } = useAdmin(); // 🔄 جلب الأعضاء من الـ Context
  const [totalMembers, setTotalMembers] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [newSubscriptions, setNewSubscriptions] = useState(0);
  const [renewals, setRenewals] = useState(0);
  const [activeTrainers, setActiveTrainers] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [renewalRatio, setRenewalRatio] = useState([]);
  const [membersWithStatus, setMembersWithStatus] = useState([]);

  const COLORS = [
    "var(--secondary)",
    "var(--primary)",
    "var(--success)",
    "var(--danger)",
  ];

  useEffect(() => {
    // 👥 إجمالي الأعضاء
    setTotalMembers(members.length);

    const now = new Date();
    const currentMonth = now.getMonth();

    // 💰 الإيرادات الشهرية
    const monthlyPayments = payments.filter(
      (p) => new Date(p.date).getMonth() === currentMonth
    );
    const total = monthlyPayments.reduce((acc, p) => acc + p.amount, 0);
    setMonthlyRevenue(total);

    // 🆕 اشتراكات جديدة
    const newSubs = subscriptions.filter(
      (s) => new Date(s.startDate).getMonth() === currentMonth
    ).length;
    setNewSubscriptions(newSubs);

    // 🔄 التجديدات
    const renew = subscriptions.filter((s) => s.isRenewal).length;
    setRenewals(renew);

    // 🏋️ المدربين النشطين
    const active = trainers.filter((t) => t.status === "active").length;
    setActiveTrainers(active);

    // 📊 بيانات الرسم البياني للإيرادات
    const grouped = {};
    payments.forEach((p) => {
      const month = new Date(p.date).toLocaleString("default", {
        month: "short",
      });
      grouped[month] = (grouped[month] || 0) + p.amount;
    });
    const data = Object.keys(grouped).map((m) => ({
      name: m,
      revenue: grouped[m],
    }));
    setChartData(data);

    // 🥧 نسبة الاشتراكات والتجديدات
    setRenewalRatio([
      { name: "New Subscriptions", value: newSubs },
      { name: "Renewals", value: renew },
    ]);

    // ⏳ حالة الأعضاء (نشط / سينتهي قريبا)
    const updatedMembers = members.map((m) => {
      const daysLeft = Math.ceil(
        (new Date(m.endDate) - now) / (1000 * 60 * 60 * 24)
      );
      return { ...m, daysLeft };
    });
    setMembersWithStatus(updatedMembers);
  }, [members]);

  const getTraineesForTrainer = (trainerName) => {
    return membersWithStatus
      .filter((m) => m.trainer === trainerName)
      .slice(0, 3);
  };

  // 🔝 عرض أول 5 أعضاء فقط
  const topMembers = membersWithStatus.slice(0, 5);
const handleReset = () => {
    if (window.confirm("هل أنت متأكد من إعادة ضبط جميع البيانات؟")) {
      localStorage.removeItem("members");
      localStorage.removeItem("trainers");
      setMembers(initialMembers);
      setTrainers(initialTrainers);
      window.location.reload(); // لتحديث الصفحة بعد الريست
    }
  };
  return (
    <div className="dashboard-container">
      {/* 🔹 العنوان والإحصائيات */}
      <div className="header-row">
        <h2 className="dashboard-title">Dashboard Overview</h2>
        <div className="stats-row">
          <StatBox title="Total Members" value={totalMembers} icon="👥" />
          <StatBox
            title="Monthly Revenue"
            value={`${monthlyRevenue} EGP`}
            icon="💰"
          />
          <StatBox
            title="New Subscriptions"
            value={newSubscriptions}
            icon="➕"
          />
          <StatBox title="Renewals" value={renewals} icon="🔄" />
          <StatBox title="Active Trainers" value={activeTrainers} icon="🏋️" />
        </div>
        
      </div>

      {/* 📈 الرسوم البيانية */}
      <div className="charts-row">
        <RevenueChart data={chartData} />
        <SubscriptionPie data={renewalRatio} colors={COLORS} />
      </div>

      {/* 👥 الأعضاء والمدربين والنشاطات */}
      <div className="bottom-row">
        <div className="members-section-compact">
          <h3 className="section-title-compact">Members Overview (Top 5)</h3>
          <MemberTableCompact members={topMembers} />
        </div>
        <div className="right-panel">
          <div className="trainers-section-compact">
            <h3 className="section-title-compact">Trainers Overview</h3>
            <TrainersListCompact
              trainers={trainers}
              getTraineesForTrainer={getTraineesForTrainer}
            />
          </div>
          <div className="activities-section-compact">
            <h3 className="section-title-compact">Recent Activities</h3>
            <ActivityLogCompact activities={activities} />
          </div>
        </div>
      </div>
    </div>
  );
};

// 📊 مكونات الداشبورد
const StatBox = ({ title, value, icon }) => (
  <div className="stat-box-compact">
    <div className="stat-icon">{icon}</div>
    <h3 className="stat-title-compact">{title}</h3>
    <p className="stat-value-compact">{value}</p>
  </div>
);

const RevenueChart = ({ data }) => (
  <div className="chart-wrapper-compact">
    <h3 className="chart-title-compact">Monthly Revenue</h3>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="var(--light)" fontSize={12} />
        <YAxis stroke="var(--light)" fontSize={12} />
        <Tooltip />
        <Bar dataKey="revenue" fill="var(--secondary)" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const SubscriptionPie = ({ data, colors }) => (
  <div className="chart-wrapper-compact">
    <h3 className="chart-title-compact">Subscriptions Ratio</h3>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={70}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

const MemberTableCompact = ({ members }) => (
  <table className="members-table-compact">
    <thead>
      <tr>
        <th>Name</th>
        <th>Plan</th>
        <th>Trainer</th>
        <th>Days Left</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {members.map((m) => (
        <tr key={m.id}>
          <td>{m.name}</td>
          <td>{m.plan}</td>
          <td>{m.trainer}</td>
          <td>{m.daysLeft > 0 ? m.daysLeft : 0}</td>
          <td
            className={`status-cell-compact ${
              m.daysLeft <= 5 ? "danger" : "success"
            }`}
          >
            {m.daysLeft <= 5 ? "Expiring" : "Active"}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const TrainersListCompact = ({ trainers, getTraineesForTrainer }) => (
  <div className="trainers-list-compact">
    {trainers.map((trainer) => {
      const trainees = getTraineesForTrainer(trainer.name);
      return (
        <div key={trainer.id} className="trainer-item-compact">
          <div className="trainer-header-compact">
            <strong>{trainer.name}</strong> ({trainer.status},{" "}
            {trainer.activeClients} clients)
          </div>
          <ul className="trainees-compact">
            {trainees.length > 0 ? (
              trainees.map((trainee) => (
                <li key={trainee.id}>
                  {trainee.name} ({trainee.plan})
                </li>
              ))
            ) : (
              <li>No trainees</li>
            )}
          </ul>
        </div>
      );
    })}
  </div>
);

const ActivityLogCompact = ({ activities }) => (
  <ul className="activities-compact">
    {activities.slice(0, 4).map((activity) => (
      <li key={activity.id}>{activity.message}</li>
    ))}
  </ul>
);

export default Dashboard;
