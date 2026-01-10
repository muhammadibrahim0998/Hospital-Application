import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Home.css";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // JWT token delete
    navigate("/login"); // redirect to Login page
  };

  const slides = [
    {
      img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3",
      title: "CityCare Hospital",
      desc: "Trusted healthcare with modern technology",
    },
    {
      img: "https://images.unsplash.com/photo-1550831107-1553da8c8464",
      title: "Expert Doctors",
      desc: "Professional & experienced specialists",
    },
    {
      img: "https://images.unsplash.com/photo-1600959907703-125ba1374a12",
      title: "24/7 Medical Care",
      desc: "Emergency & patient care anytime",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div>
      {/* ===== HERO SLIDER ===== */}
      <div
        className="position-relative slider-container"
        style={{ height: "380px", overflow: "hidden" }}
      >
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide.img}
            className={`slider-img ${index === currentIndex ? "active" : ""}`}
            alt={slide.title}
          />
        ))}

        <div className="carousel-caption show">
          <h2 className="fw-bold">{slides[currentIndex].title}</h2>
          <p className="fs-6">{slides[currentIndex].desc}</p>

          {/* Logout Button */}
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* ===== SERVICES ===== */}
      <div className="container my-5">
        <div className="row text-center g-4">
          <div className="col-md-4">
            <div className="p-4 shadow rounded">
              <h5 className="fw-bold">Emergency Care</h5>
              <p className="text-muted small">24/7 emergency services</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 shadow rounded">
              <h5 className="fw-bold">Qualified Doctors</h5>
              <p className="text-muted small">Certified specialists</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 shadow rounded">
              <h5 className="fw-bold">Modern Equipment</h5>
              <p className="text-muted small">Latest medical technology</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
