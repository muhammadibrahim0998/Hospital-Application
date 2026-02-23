import React from "react";
import { useNavigate } from "react-router-dom";
import { useDoctors } from "../context/DoctorContext";
import { useDepartments } from "../context/DepartmentContext";
import "../css/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const { doctors } = useDoctors();
  const { departments } = useDepartments();

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

  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % slides.length),
      3000,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* ================= HERO SLIDER ================= */}
      <div className="position-relative slider-container">
        {slides.map((slide, i) => (
          <img
            key={i}
            src={slide.img}
            alt={slide.title}
            className={`slider-img ${i === currentIndex ? "active" : ""}`}
          />
        ))}

        <div className="carousel-caption center-caption">
          <h2 className="fw-bold">{slides[currentIndex].title}</h2>
          <p>{slides[currentIndex].desc}</p>
        </div>
      </div>

      {/* ================= DEPARTMENTS ================= */}
      <section className="py-5 bg-light dept-section">
        <div className="container">
          <div className="text-center mb-4">
            <h3 className="fw-bold text-danger">Our Departments</h3>
            <p className="text-muted small">
              Specialized departments with expert doctors
            </p>
          </div>

          <div className="row g-4">
            {departments.map((dept) => {
              const count = doctors.filter(
                (d) => d.departmentId === dept.id,
              ).length;
              return (
                <div
                  key={dept.id}
                  className="col-6 col-md-4"
                  onClick={() => navigate(`/department/${dept.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card h-100 shadow-sm border-0 text-center p-4 dept-card">
                    <div
                      className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "80px",
                        height: "80px",
                        fontSize: "24px",
                        fontWeight: "600",
                        color: "#fff",
                        background:
                          count > 0
                            ? "linear-gradient(135deg,#6a11cb,#2575fc)"
                            : "#6c757d",
                      }}
                    >
                      {count}
                    </div>
                    <h5 className="fw-bold mb-0">{dept.name}</h5>
                    <small className="text-muted">{count} doctors</small>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= DOCTORS PREVIEW ================= */}
      <div className="container my-5">
        <h3 className="fw-bold text-center mb-4 text-danger">Our Doctors</h3>
        <div className="row g-4">
          {doctors.slice(0, 8).map((doc) => (
            <div className="col-6 col-md-3" key={doc.id}>
              <div className="card h-100 shadow-sm text-center">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="card-img-top"
                  style={{ height: "220px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h6 className="fw-bold">{doc.name}</h6>
                  <p className="text-muted small">{doc.specialty}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= ABOUT HOSPITAL ================= */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <img
                src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
                alt="Hospital"
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-md-6">
              <h3 className="fw-bold text-danger mb-3">About Our Hospital</h3>
              <p className="text-muted mb-4">
                Our hospital provides world-class healthcare with expert
                doctors.
              </p>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => navigate("/about")}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
