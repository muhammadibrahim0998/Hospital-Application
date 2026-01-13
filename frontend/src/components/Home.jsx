import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleLearnMore = () => {
    navigate("/about"); // Learn More تڼۍ About page ته لیږي
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
    }, 3000);
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
          <button className="btn btn-danger btn-sm me-2" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* ===== HOSPITAL INFO BOX ===== */}
      <div className="container my-5">
        <div className="row align-items-center shadow rounded p-4">
          <div className="col-md-6">
            <h3 className="fw-bold text-danger">
              City Care Hospital, Peshawar
            </h3>
            <h6 className="text-muted mb-3">
              10 years of care, compassion & hope
            </h6>
            <p className="text-muted small">
              City Care Hospital provides quality healthcare services to
              everyone.
            </p>
            <button className="btn btn-danger btn-sm" onClick={handleLearnMore}>
              Learn More
            </button>
          </div>

          <div className="col-md-6 text-center">
            <img
              src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
              alt="City Care Hospital"
              className="img-fluid rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
