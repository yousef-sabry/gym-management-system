import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";
import "./Register.css";
import registerImage from "../../assets/images/reg.jpg";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some(user => user.email === email)) {
      alert("This email is already registered!");
      return;
    }

    users.push({ email, password, role: "member" });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful! You are now a member.");
    navigate("/login");
  };

  return (
    <div className="auth-container">
      
      <div className="auth-card">
        
        <div className="auth-image">
          <img src={registerImage} alt="Register Illustration" />
        </div>
        <div className="auth-form">
          
          <h2>
            <FaUserPlus className="register-icon" /> Create Account
            
          </h2>
          <span className="page-title">Register Page</span>
          <p className="subtitle">Join us and start your fitness journey</p>
<p className="admin-note">
  Note: There is a default admin account — Email: <strong>yousef@ys.com</strong> | Password: <strong>123</strong>. 
  <button type="button" className="go-login" onClick={() => navigate('/login')}>Go to Login Page</button>
</p>
          <form onSubmit={handleRegister}>
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
            <button type="submit" className="btn-register">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
