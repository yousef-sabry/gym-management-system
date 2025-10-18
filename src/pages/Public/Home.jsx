import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
// import imagehero from "../../assets/images/herp-home.jpg"
import image1 from "../../assets/images/1.jpg"
import image2 from "../../assets/images/2.jpg"
import image3 from "../../assets/images/3.jpg"
import image4 from "../../assets/images/4.jpg"
import './Home.css'; // Import custom CSS

const Home = () => {
  // Existing refs...
  const heroTitleRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const heroButtonRef = useRef(null);
  const featuresRef = useRef(null);
  const navigate = useNavigate();


  const handlestartClick = () => {
    navigate("/login");
  };

  // New refs for feature icons and images
  const [iconRefs, setIconRefs] = useState([]);
  const [imageRefs, setImageRefs] = useState([]);

  // Callback to set refs for icons/images (for staggering)
  const addIconRef = useCallback((el) => {
    if (el && !iconRefs.includes(el)) {
      setIconRefs((prev) => [...prev, el]);
    }
  }, [iconRefs]);

  const addImageRef = useCallback((el) => {
    if (el && !imageRefs.includes(el)) {
      setImageRefs((prev) => [...prev, el]);
    }
  }, [imageRefs]);

  // Hover handlers for icons (GSAP animations)
  const handleIconHover = (el, isEnter) => {
    gsap.to(el, {
      scale: isEnter ? 1.1 : 1,
      rotation: isEnter ? 360 : 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  useEffect(() => {
    // Existing hero animations...
    gsap.fromTo(heroTitleRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });
    gsap.fromTo(heroSubtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' });
    gsap.fromTo(heroButtonRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, delay: 0.6, ease: 'back.out(1.7)' });

    // Animate features entrance (stagger icons and images)
    if (featuresRef.current) {
      gsap.fromTo(featuresRef.current.children, { opacity: 0, y: 40 }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        delay: 1,
        ease: 'power2.out'
      });
    }

    // Stagger icon animations
    iconRefs.forEach((icon, index) => {
      gsap.fromTo(icon, { scale: 0, rotation: -180 }, {
        scale: 1,
        rotation: 0,
        duration: 0.6,
        delay: 1.2 + index * 0.1,
        ease: 'back.out(1.7)'
      });
    });

    // Stagger image fade-ins
    imageRefs.forEach((img, index) => {
      gsap.fromTo(img, { opacity: 0, x: -50 }, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 1.5 + index * 0.1,
        ease: 'power2.out'
      });
    });
  }, [iconRefs, imageRefs]); // Re-run when refs update

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section" role="banner" aria-label="Welcome to GymPro">
        <div className="hero-overlay">
          <div className="container">
            <div className="row align-items-center min-vh-100">
              <div className="col-lg-6">
                <h1 ref={heroTitleRef} className="hero-title">
                  Welcome to <span className="accent">GymPro</span> Management System
                </h1>
                <p ref={heroSubtitleRef} className="hero-subtitle">
                  Streamline your gym operations with our all-in-one solution. Track memberships, schedule classes, and manage equipment effortlessly.
                </p>
                <button onClick={handlestartClick} ref={heroButtonRef} className="btn btn-lg hero-btn" aria-label="Get Started with GymPro">
                  <i className="bi bi-play-circle me-2"></i>Get Started
                </button>
              </div>
              <div className="col-lg-6">
                {/* <img
                  src={imagehero}
                  alt="Gym Fitness Center"
                  className="img-fluid hero-image"
                /> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (About) */}
      <section id='about' className="features-section py-5" aria-label="Discover GymPro Features">
        <div className="container">
          <div className="intro-text text-center mb-5">
            <h2 className="section-title">Discover GymPro: Empowering Gym Owners and Members</h2>
            <p className="section-subtitle">
              GymPro is more than a management system—it's a game-changer that streamlines operations for gym owners while delivering personalized fitness journeys for members. 
              Save time and boost revenue, or track your progress and achieve peak performance in sports and exercises. Join the revolution in gym efficiency and member success.
            </p>
          </div>
          <div ref={featuresRef} className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="feature-card">
                <i 
                  ref={addIconRef} 
                  className="bi bi-people feature-icon" 
                  onMouseEnter={(e) => handleIconHover(e.currentTarget, true)}
                  onMouseLeave={(e) => handleIconHover(e.currentTarget, false)}
                  aria-hidden="true"
                ></i>
                <img ref={addImageRef} src={image1} alt="Member Management Dashboard" className="feature-image" />
                <h3>Member Management</h3>
                <p className="feature-desc">Revolutionize how you handle memberships with secure, intuitive tools.</p>
                <ul className="feature-benefits">
                  <li><strong>For Owners:</strong> Automate billing, track attendance, and reduce admin by 50%—grow your business effortlessly.</li>
                  <li><strong>For Members:</strong> Access personalized profiles, progress reports, and tailored exercise plans to excel in sports and fitness goals.</li>
                  <li>Seamless integration ensures higher retention and motivated users.</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="feature-card">
                <i 
                  ref={addIconRef} 
                  className="bi bi-calendar-check feature-icon" 
                  onMouseEnter={(e) => handleIconHover(e.currentTarget, true)}
                  onMouseLeave={(e) => handleIconHover(e.currentTarget, false)}
                  aria-hidden="true"
                ></i>
                <img ref={addImageRef} src={image2} alt="Class Scheduling Calendar" className="feature-image" />
                <h3>Class Scheduling</h3>
                <p className="feature-desc">Effortlessly organize and book sessions for optimal gym flow.</p>
                <ul className="feature-benefits">
                  <li><strong>For Owners:</strong> Maximize space utilization and revenue with automated reminders and real-time availability.</li>
                  <li><strong>For Members:</strong> Book yoga, weights, or cardio easily—never miss a workout and improve exercise consistency for better results.</li>
                  <li>Reduce no-shows by 40% and enhance member satisfaction.</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 col-md-12 mb-4">
              <div className="feature-card">
                <i 
                  ref={addIconRef} 
                  className="bi bi-gear feature-icon" 
                  onMouseEnter={(e) => handleIconHover(e.currentTarget, true)}
                  onMouseLeave={(e) => handleIconHover(e.currentTarget, false)}
                  aria-hidden="true"
                ></i>
                <img ref={addImageRef} src={image3} alt="Equipment Tracking Interface" className="feature-image" />
                <h3>Equipment Tracking</h3>
                <p className="feature-desc">Keep your gym running at peak efficiency with smart monitoring.</p>
                <ul className="feature-benefits">
                  <li><strong>For Owners:</strong> Schedule maintenance proactively to minimize downtime and cut costs—ensure smooth operations.</li>
                  <li><strong>For Members:</strong> View real-time availability for safe, effective workouts, preventing injuries and optimizing sports training.</li>
                  <li>Integrated alerts keep everything in top condition.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id='cta' className="cta-section py-5" aria-label="Call to Action">
        <div className="cta-overlay">
          <div className="container text-center">
            <i className="bi bi-trophy cta-main-icon mb-3" aria-hidden="true"></i>
            <h2 className="cta-title">Ready to Transform Your Gym and Elevate Member Fitness?</h2>
            <img 
              src={image4} 
              alt="Gym Success Dashboard - Revenue and Member Growth" 
              className="cta-image mb-4" 
            />
            <div className="cta-benefits mb-4">
              <ul className="list-unstyled">
                <li><i className="bi bi-check-circle text-success me-2" aria-hidden="true"></i>Save hours on admin for owners</li>
                <li><i className="bi bi-check-circle text-success me-2" aria-hidden="true"></i>Personalized tracking for better exercise outcomes</li>
                <li><i className="bi bi-check-circle text-success me-2" aria-hidden="true"></i>Seamless integration for peak gym performance</li>
              </ul>
            </div>
            <button onClick={handlestartClick} className="btn btn-outline-light btn-lg cta-btn" aria-label="Start Your Free Trial Today">
              <i className="bi bi-arrow-right-circle me-2" aria-hidden="true"></i>Start Your Free Trial Today
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
