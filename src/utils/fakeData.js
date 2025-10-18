// src/utils/fakeData.js

// ==================== MEMBERS ====================
// ==================== MEMBERS ====================
export const members = [
  {
    id: 1,
    email: "ahmed.ali@example.com",
    name: "Ahmed Ali",
    plan: "Monthly",
    trainer: "Omar Khaled",
    startDate: "2025-09-10",
    endDate: "2025-10-10",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    status: "active",
    workouts: [
      {
        day: "Monday",
        name: "Bench Press",
        duration: "50 min"
      },
      
    ],
  },
  {
    id: 2,
    name: "Sara Mohamed",
    email: "sara.mohamed@example.com",
    plan: "3 Months",
    trainer: "Laila Hassan",
    startDate: "2025-08-01",
    endDate: "2025-11-01",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    status: "active",
    workouts: [
       {
        day: "Monday",
        name: "Bench Press",
        duration: "50 min"
      },
    ],
  },
  {
    id: 3,
    name: "Yousef Sabry",
    email: "yousef.sabry@example.com",
    plan: "Yearly",
    trainer: "Omar Khaled",
    startDate: "2025-01-01",
    endDate: "2026-01-01",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    status: "active",
    workouts: [],
  },
  {
    id: 4,
    name: "Mona Adel",
    email: "mona.adel@example.com",
    plan: "Monthly",
    trainer: "Ahmed Reda",
    startDate: "2025-09-25",
    endDate: "2025-10-25",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    status: "active",
    workouts: [],
  },
  {
    id: 5,
    name: "Khaled Hussein",
    email: "khaled.hussein@example.com",
    plan: "Monthly",
    trainer: "Omar Khaled",
    startDate: "2025-08-01",
    endDate: "2025-09-01",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    status: "expired",
    workouts: [],
  },
];


// ==================== TRAINERS ====================
export const trainers = [
  { id: 1, name: "Omar Khaled", activeClients: 8, status: "active" },
  { id: 2, name: "Laila Hassan", activeClients: 5, status: "active" },
  { id: 3, name: "Ahmed Reda", activeClients: 3, status: "inactive" },
];

// ==================== PAYMENTS ====================
export const payments = [
  { id: 1, memberId: 1, amount: 500, date: "2025-10-01", status: "paid" },
  { id: 2, memberId: 2, amount: 1200, date: "2025-09-15", status: "paid" },
  { id: 3, memberId: 3, amount: 4000, date: "2025-02-01", status: "paid" },
  { id: 4, memberId: 4, amount: 500, date: "2025-10-05", status: "pending" },
  { id: 5, memberId: 5, amount: 500, date: "2025-09-01", status: "overdue" },
];

// ==================== SUBSCRIPTIONS ====================
export const subscriptions = [
  { id: 1, memberId: 1, plan: "Monthly", startDate: "2025-09-10", isRenewal: true },
  { id: 2, memberId: 2, plan: "3 Months", startDate: "2025-08-01", isRenewal: false },
  { id: 3, memberId: 3, plan: "Yearly", startDate: "2025-01-01", isRenewal: true },
  { id: 4, memberId: 4, plan: "Monthly", startDate: "2025-09-25", isRenewal: false },
  { id: 5, memberId: 5, plan: "Monthly", startDate: "2025-08-01", isRenewal: false },
];

// ==================== ACTIVITY LOG (آخر التحديثات) ====================
export const activities = [
  { id: 1, message: "Ahmed Ali renewed his monthly plan", date: "2025-10-01" },
  { id: 2, message: "Sara Mohamed completed payment of 1200 EGP", date: "2025-09-15" },
  { id: 3, message: "New member added: Mona Adel", date: "2025-09-25" },
  { id: 4, message: "Payment pending from member: Mona Adel", date: "2025-10-05" },
];
