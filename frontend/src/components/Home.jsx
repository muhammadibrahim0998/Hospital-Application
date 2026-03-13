import React from "react";
import { useNavigate } from "react-router-dom";
import { useDoctors } from "../context/DoctorContext";
import { useDepartments } from "../context/DepartmentContext";
import { API_BASE_URL } from "../config";
import { HeartPulse, Award, ShieldCheck, Users } from "lucide-react";
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
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* HERO SLIDER */}

      <div className="slider-container">
        {slides.map((slide, i) => (
          <img
            key={i}
            src={slide.img}
            alt={slide.title}
            className={`slider-img ${i === currentIndex ? "active" : ""}`}
          />
        ))}

        <div className="carousel-caption center-caption animate__animated animate__fadeIn">
          <h2 className="fw-extrabold display-4">{slides[currentIndex].title}</h2>
          <p className="lead">{slides[currentIndex].desc}</p>
          <button className="btn btn-danger btn-lg rounded-pill px-4 mt-3" onClick={() => navigate('/about')}>Discover More</button>
        </div>
      </div>

      {/* DEPARTMENTS SECTION REMOVED AS REQUESTED */}
      {/* 
      <section className="py-5 bg-light dept-section">
        <div className="container">
          <div className="text-center mb-4">
            <h3 className="fw-bold text-danger">Our Departments</h3>
            <p className="text-muted small">
              Specialized departments with expert doctors
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {departments.map((dept) => {
              const count = doctors.filter(
                (d) => Number(d.department_id) === Number(dept.id),
              ).length;

              return (
                <div
                  key={dept.id}
                  className="col-12 col-sm-6 col-md-4 col-lg-3"
                  onClick={() => navigate(`/department/${dept.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card h-100 text-center p-4 dept-card border-0 shadow-sm">
                    <div
                      className="dept-count mb-3"
                      style={{
                        background:
                          count > 0
                            ? "linear-gradient(135deg,#6a11cb,#2575fc)"
                            : "#6c757d",
                      }}
                    >
                      {count}
                    </div>

                    <h5 className="fw-bold mb-1">{dept.name}</h5>
                    <p className="text-muted small mb-0">{count} Specialist{count !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      */}

      {/* DOCTORS */}

      <div className="container my-5">
        <h3 className="fw-bold text-center mb-4 text-danger">Our Doctors</h3>

        <div className="row g-4 justify-content-center">
          {doctors.length === 0 ? (
            <div className="col-12 py-5 text-center">
              <div className="placeholder-container p-5 bg-light rounded-3">
                <p className="text-muted mb-0">No doctors added yet. Please check back later.</p>
              </div>
            </div>
          ) : (
            doctors.map((doc) => {
              const dept = departments.find(d => Number(d.id) === Number(doc.department_id));
              return (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={doc.id}>
                  <div className="card doctor-card h-100 border-0 shadow-sm">
                    <div className="doctor-img-container">
                      <img
                        src={
                          doc.image
                            ? doc.image.startsWith("http")
                              ? doc.image
                              : `${API_BASE_URL}${doc.image}`
                            : "https://img.icons8.com/color/96/doctor-male.png"
                        }
                        alt={doc.name}
                        className="doctor-img"
                      />
                      <div className="doctor-overlay">
                        <button className="btn btn-light btn-sm rounded-pill px-3" onClick={() => navigate('/doctors')}>View Profile</button>
                      </div>
                    </div>

                    <div className="card-body text-center p-3">
                      <h6 className="fw-bold mb-1">{doc.name}</h6>
                      <p className="text-primary small fw-semibold mb-1">{dept ? dept.name : doc.specialty}</p>
                      <p className="text-muted small mb-0">{doc.specialty || "Expert Physician"}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ABOUT */}

      <section className="py-5 overflow-hidden">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 mb-4 mb-lg-0 order-2 order-lg-1">
              <div className="about-img-wrapper position-relative">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d670cb?auto=format&fit=crop&w=800&q=80"
                  alt="Modern Hospital"
                  className="img-fluid rounded-4 shadow-lg main-about-img"
                />
                <div className="experience-badge bg-danger p-3 rounded-4 shadow text-white text-center position-absolute">
                  <h4 className="fw-bold mb-0">10+</h4>
                  <small>Years Excellence</small>
                </div>
              </div>
            </div>

            <div className="col-lg-6 order-1 order-lg-2">
              <span className="text-danger fw-bold text-uppercase letter-spacing-2 mb-2 d-block">About Our Hospital</span>
              <h2 className="fw-bold display-5 mb-4 text-dark">We Provide High Quality <span className="text-danger">Medical Services</span></h2>

              <p className="text-muted lead mb-4">
                CityCare Hospital is committed to providing compassionate healthcare with cutting-edge technology and a team of world-class specialists.
              </p>

              <div className="row g-4 mb-5">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-white shadow-sm border-start border-danger border-4">
                    <Award className="text-danger" size={32} />
                    <span className="fw-semibold">Award Winning Care</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-white shadow-sm border-start border-danger border-4">
                    <ShieldCheck className="text-danger" size={32} />
                    <span className="fw-semibold">Certified Specialists</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-white shadow-sm border-start border-danger border-4">
                    <HeartPulse className="text-danger" size={32} />
                    <span className="fw-semibold">Patient-First Approach</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-white shadow-sm border-start border-danger border-4">
                    <Users className="text-danger" size={32} />
                    <span className="fw-semibold">Dedicated Team</span>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-3 mt-4">
                <button
                  className="btn btn-danger btn-lg rounded-pill px-5 shadow"
                  onClick={() => navigate("/about")}
                >
                  Read More
                </button>
                <button
                  className="btn btn-outline-dark btn-lg rounded-pill px-5"
                  onClick={() => navigate("/contact")}
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}