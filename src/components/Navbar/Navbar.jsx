import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import linkedin from "../../assets/images/linkedin-logo.png"
import githup from "../../assets/images/github.png"
import portfolio from "../../assets/images/curriculum-vitae.png"
import "./Navbar.css";

const Navbar = ({ userRole, setUserRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

    const toggleNavbar = () => setIsOpen(!isOpen);
  const closeNavbar = () => setIsOpen(false);

  // Change navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    setUserRole(null);
    navigate("/login");
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src="/logo.png" alt="Logo" className="logo" />
          <span className="span-logo">GYM Management</span>
        </Link>

        <button className="navbar-toggler" onClick={toggleMenu}>
          ☰
        </button>

        <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
          {/* Guest */}
          {!userRole && (
            <>
              <li>
                <Link  onClick={closeNavbar} to="/">Home</Link>
              </li>
              <li>
                <HashLink  onClick={closeNavbar} smooth to="/#about">
                  About
                </HashLink>
              </li>
              <li>
                <HashLink onClick={closeNavbar}  smooth to="/#cta">
                  CTA
                </HashLink>
              </li>
             <li>
  <a
    href="www.linkedin.com/in/yousef-sabry-b34a51245"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src={linkedin} alt="LinkedIn" className="icon" />
  </a>
</li>

<li>
  <a
    href="https://github.com/yousef-sabry"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src={githup} alt="GitHub" className="icon" />
  </a>
</li>

<li>
  <a
    href="https://portfolio-yousef-sabry.netlify.app/"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src={portfolio} alt="Portfolio" className="icon" />
  </a>
</li>

              <li>
                <Link onClick={closeNavbar} to="/login" className="btn btn-secondary">
                  Login
                </Link>
              </li>
              <li>
                <Link onClick={closeNavbar} to="/register" className="btn btn-secondary">
                  Register
                </Link>
              </li>
            </>
          )}

          {/* Admin */}
          {userRole === "admin" && (
            <>
              <li>
                <Link onClick={closeNavbar} to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link onClick={closeNavbar} to="/members">Members</Link>
              </li>
              <li>
                <Link onClick={closeNavbar} to="/trainers">Trainers</Link>
              </li>
              
               <li>
  <a
    href="www.linkedin.com/in/yousef-sabry-b34a51245"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src={linkedin} alt="LinkedIn" className="icon" />
  </a>
</li>

<li>
  <a
    href="https://github.com/yousef-sabry"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src={githup} alt="GitHub" className="icon" />
  </a>
</li>

<li>
  <a
    href="https://portfolio-yousef-sabry.netlify.app/"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src={portfolio} alt="Portfolio" className="icon" />
  </a>
</li>
             
              <li>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </li>
            </>
          )}

          {/* Member */}
          {userRole === "member" && (
            <>
              <li>
                <Link onClick={closeNavbar} to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link onClick={closeNavbar} to="/profile">Profile</Link>
              </li>
              <li>
                <Link onClick={closeNavbar} to="/subscription">Subscription</Link>
              </li>
              <li>
                <Link onClick={closeNavbar} to="/workout">Workout</Link>
              </li>
                    <li>
  <a
    href="www.linkedin.com/in/yousef-sabry-b34a51245"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src={linkedin} alt="LinkedIn" className="icon" />
  </a>
</li>

<li>
  <a
    href="https://github.com/yousef-sabry"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src={githup} alt="GitHub" className="icon" />
  </a>
</li>

<li>
  <a
    href="https://portfolio-yousef-sabry.netlify.app/"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src={portfolio} alt="Portfolio" className="icon" />
  </a>
</li>
              <li onClick={closeNavbar}>
                <button  onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
