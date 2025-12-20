import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import "./Login.css";
import loginImage from "../../assets/images/login.jpg";

const Login = ({ setUserRole }) => {
  const [email, setEmail] = useState("yousef@ys.com");
  const [password, setPassword] = useState("123");
  const navigate = useNavigate();

  useEffect(() => {
    // GSAP animation
    gsap.fromTo(
      ".auth-card",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    );
    gsap.fromTo(
      ".auth-image",
      { opacity: 0, x: -80 },
      { opacity: 1, x: 0, duration: 1.2, ease: "power3.out" }
    );

    // إضافة admin افتراضي لو مش موجود
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const adminExists = users.some(user => user.email === "yousef@ys.com");

    if (!adminExists) {
      users.push({ email: "yousef@ys.com", password: "123", role: "admin" });
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userEmail", user.email);
      setUserRole(user.role);

      if (user.role === "admin") navigate("/dashboard");
      else navigate("/profile");
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-image">
          <img src={loginImage} alt="Login Illustration" />
        </div>
        <div className="auth-form">
          <h2>
            <FaSignInAlt className="login-icon" /> Welcome Back
          </h2>
          <p className="subtitle">Please login to continue</p>
<p className="admin-note">Note: Default admin email: <strong>yousef@ys.com</strong> - Password: <strong>123</strong></p>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-login">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
