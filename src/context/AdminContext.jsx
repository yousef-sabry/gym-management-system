import React, { createContext, useContext, useState, useEffect } from "react";
import {
  members as initialMembers,
  trainers as initialTrainers,
  payments,
  subscriptions,
} from "../utils/fakeData";

const AdminContext = createContext();
export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [paymentsData, setPaymentsData] = useState(payments);
  const [subscriptionsData, setSubscriptionsData] = useState(subscriptions);
  const [initialized, setInitialized] = useState(false);

  // ✅ تحميل البيانات (مرة واحدة فقط)
  useEffect(() => {
    const savedMembers = JSON.parse(localStorage.getItem("members"));
    const savedTrainers = JSON.parse(localStorage.getItem("trainers"));

    // لو مفيش داتا متخزنة → نستخدم الداتا المبدئية
    setMembers(savedMembers && savedMembers.length ? savedMembers : initialMembers);
    setTrainers(savedTrainers && savedTrainers.length ? savedTrainers : initialTrainers);

    setInitialized(true);
  }, []);

  // ✅ حفظ التغييرات تلقائيًا بعد أول تحميل
  useEffect(() => {
    if (initialized) {
      localStorage.setItem("members", JSON.stringify(members));
    }
  }, [members, initialized]);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem("trainers", JSON.stringify(trainers));
    }
  }, [trainers, initialized]);

  // 🧩 Members CRUD
  const addMember = (newMember) => {
    const id = Date.now();
    setMembers((prev) => [...prev, { id, ...newMember }]);
  };

  const updateMember = (updatedMember) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
    );
  };

  const deleteMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // 🧩 Trainers CRUD
  const addTrainer = (newTrainer) => {
    const id = Date.now();
    setTrainers((prev) => [...prev, { id, ...newTrainer }]);
  };

  const updateTrainer = (updatedTrainer) => {
    setTrainers((prev) =>
      prev.map((t) => (t.id === updatedTrainer.id ? updatedTrainer : t))
    );
  };

  const deleteTrainer = (id) => {
    setTrainers((prev) => prev.filter((t) => t.id !== id));
  };

  // 🧩 Payments / Subscriptions
  const addPayment = (payment) => setPaymentsData((prev) => [...prev, payment]);
  const addSubscription = (sub) =>
    setSubscriptionsData((prev) => [...prev, sub]);

  // 🌀 انتظار تحميل الداتا
  if (!initialized) {
    return (
      <div style={{ textAlign: "center", color: "#0F172A", marginTop: "50px" }}>
        Loading admin data...
      </div>
    );
  }

  return (
    <AdminContext.Provider
      value={{
        members,
        setMembers,
        trainers,
        paymentsData,
        subscriptionsData,
        addMember,
        updateMember,
        deleteMember,
        addTrainer,
        updateTrainer,
        deleteTrainer,
        addPayment,
        addSubscription,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
