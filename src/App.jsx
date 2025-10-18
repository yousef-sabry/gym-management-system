import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Public/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import Dashboard from "./pages/Admin/Dashboard";
import Members from "./pages/Admin/Members";
import Trainers from "./pages/Admin/Trainers";

import DashboardMember from "./pages/Member/DashboardMember";
import Profile from "./pages/Member/Profile";
import Subscription from "./pages/Member/Subscription";
import Workout from "./pages/Member/Workout";

import { AdminProvider } from "./context/AdminContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [userRole, setUserRole] = useState(null);
  const [loggedInEmail, setLoggedInEmail] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");

    if (role) setUserRole(role);
    if (email) setLoggedInEmail(email);
  }, []);

  return (
    <Router>
      <Navbar userRole={userRole} setUserRole={setUserRole} />

      <Routes>
        {/* 🌍 Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />
        <Route path="/register" element={<Register />} />

        {/* 🛠️ Admin Protected Pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={{ role: userRole }} allowedRole="admin">
              <AdminProvider>
                <Dashboard />
              </AdminProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/members"
          element={
            <ProtectedRoute user={{ role: userRole }} allowedRole="admin">
              <AdminProvider>
                <Members />
              </AdminProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/trainers"
          element={
            <ProtectedRoute user={{ role: userRole }} allowedRole="admin">
              <AdminProvider>
                <Trainers />
              </AdminProvider>
            </ProtectedRoute>
          }
        />

        {/* 👤 Member Protected Pages */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={{ role: userRole }} allowedRole="member">
              <AdminProvider>
                <Profile loggedInEmail={loggedInEmail} />
              </AdminProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <ProtectedRoute user={{ role: userRole }} allowedRole="member">
              <AdminProvider>
                <Subscription loggedInEmail={loggedInEmail} />
              </AdminProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/workout"
          element={
            <ProtectedRoute user={{ role: userRole }} allowedRole="member">
              <AdminProvider>
                <Workout loggedInEmail={loggedInEmail} />
              </AdminProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/member-dashboard"
          element={
            <ProtectedRoute user={{ role: userRole }} allowedRole="member">
              <AdminProvider>
                <DashboardMember loggedInEmail={loggedInEmail} />
              </AdminProvider>
            </ProtectedRoute>
          }
        />

        {/* 🚧 Redirect Rules */}
        {userRole === "admin" && (
          <Route path="*" element={<Navigate to="/dashboard" />} />
        )}
        {userRole === "member" && (
          <Route path="*" element={<Navigate to="/profile" />} />
        )}
        {!userRole && <Route path="*" element={<Navigate to="/" />} />}
      </Routes>
    </Router>
  );
}

export default App;
