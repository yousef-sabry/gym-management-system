import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, allowedRole, children }) => {
  // لو مفيش مستخدم مسجل دخول
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // لو المستخدم مسجل بس مش من النوع المسموح ليه يدخل الصفحة
  if (user.role !== allowedRole) {
    // مثلًا عضو بيحاول يدخل لوحة الأدمن
    return <Navigate to="/" replace />;
  }

  // لو كل حاجة تمام 👇
  return children;
};

export default ProtectedRoute;
