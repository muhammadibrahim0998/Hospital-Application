import React from "react";
import { useNavigate } from "react-router-dom";
import { useDoctors } from "../context/DoctorContext";
import { useDepartments } from "../context/DepartmentContext";
import { API_BASE_URL } from "../config";
import { HeartPulse, Award, ShieldCheck, Users, FileText } from "lucide-react";
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
    <div className="bg-white">
      {/* ── HERO SLIDER ────────────────────────────────────────── */}
      <div className="slider-container">
        {slides.map((slide, i) => (
          <img
            key={i}
            src={slide.img}
            alt={slide.title}
            className={`slider-img ${i === currentIndex ? "active" : ""}`}
          />
        ))}

        <div className="center-caption animate__animated animate__fadeIn">
          <h1 className="display-3 mb-3">{slides[currentIndex].title}</h1>
          <p className="lead mb-5 opacity-90">{slides[currentIndex].desc}</p>
          
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <button 
              className="btn-premium btn-premium-primary d-flex align-items-center justify-content-center gap-2 animated-book-btn" 
              onClick={() => navigate('/find-doctor')}
            >
              <Users size={16} /> Book Appointment
            </button>
            <button 
              className="btn-premium btn-premium-outline bg-white bg-opacity-10 text-white border-white border-opacity-25" 
              onClick={() => navigate('/about')}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* ── QUICK ACTIONS ──────────────────────────────────────── */}
      <div className="container quick-card-container">
        <div className="row g-4 justify-content-center">
          <div className="col-md-4">
            <div className="quick-card h-100" onClick={() => navigate('/lab-results')} style={{ cursor: 'pointer' }}>
              <div className="icon-box" style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}>
                <FileText size={28} />
              </div>
              <h4 className="fw-bold mb-2">Lab Results</h4>
              <p className="text-muted small mb-0">Access your clinical reports and diagnostic history securely.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="quick-card h-100" onClick={() => navigate('/find-doctor')} style={{ cursor: 'pointer' }}>
              <div className="icon-box" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed' }}>
                <Users size={28} />
              </div>
              <h4 className="fw-bold mb-2">Expert Doctors</h4>
              <p className="text-muted small mb-0">Consult with our network of board-certified clinical specialists.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="quick-card h-100" onClick={() => navigate('/contact')} style={{ cursor: 'pointer' }}>
              <div className="icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                <HeartPulse size={28} />
              </div>
              <h4 className="fw-bold mb-2">Emergency</h4>
              <p className="text-muted small mb-0">Dedicated 24/7 medical assistance for urgent healthcare needs.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── DOCTORS SECTION ───────────────────────────────────── */}
      <div className="container py-5 my-5">
        <div className="text-center mb-5">
          <span className="doctor-tag mb-3">Our Specialists</span>
          <h2 className="section-title display-5">Meet Our Expert team</h2>
        </div>

        <div className="row g-4">
          {doctors.length === 0 ? (
            <div className="col-12 py-5 text-center">
              <p className="text-muted">No specialists available at the moment.</p>
            </div>
          ) : (
            doctors.slice(0, 4).map((doc) => {
              const dept = departments.find(d => Number(d.id) === Number(doc.department_id));
              return (
                <div className="col-lg-3 col-md-6" key={doc.id}>
                  <div className="doctor-card h-100">
                    <div className="doctor-img-wrapper">
                      <img
                        src={
                          doc.image
                            ? doc.image.startsWith("http") || doc.image.startsWith("data:")
                              ? doc.image
                              : `${API_BASE_URL}${doc.image.startsWith("/") ? "" : "/"}${doc.image}`
                            : "https://img.icons8.com/color/96/doctor-male.png"
                        }
                        alt={doc.name}
                        className="rounded-circle border border-primary border-4 p-1 shadow mb-4"
                        style={{ width: "160px", height: "160px", objectFit: "cover" }}
                        onError={(e) => {
                          if (e.target.src.includes('localhost') && !e.target.dataset.fallback) {
                              e.target.dataset.fallback = 'true';
                              e.target.src = `https://hospital-application-1-gff3.onrender.com${doc.image.startsWith('/') ? '' : '/'}${doc.image}`;
                          } else {
                              e.target.src = "https://img.icons8.com/color/96/doctor-male.png";
                          }
                        }}
                      />
                    </div>
                    <div className="doctor-info text-center">
                      <span className="doctor-tag">{dept ? dept.name : "General"}</span>
                      <h5 className="fw-bold mb-1">{doc.name}</h5>
                      <p className="text-muted small mb-0">{doc.specialty || "Senior Physician"}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        <div className="text-center mt-5">
          <button 
            className="btn-premium btn-premium-outline"
            onClick={() => navigate('/find-doctor')}
          >
            View All Doctors
          </button>
        </div>
      </div>

      {/* ── ABOUT SECTION ─────────────────────────────────────── */}
      <section className="py-5 bg-light overflow-hidden">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="about-image-stack">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d670cb?auto=format&fit=crop&w=800&q=80"
                  alt="Modern Hospital"
                  className="img-fluid about-main-img"
                />
                <div className="about-floating-badge">
                  <h3 className="fw-bold mb-0">10+</h3>
                  <p className="mb-0 small fw-semibold">Years of Medical Excellence</p>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <span className="text-primary fw-bold text-uppercase letter-spacing-2 mb-3 d-block">Why Choose Us</span>
              <h2 className="fw-bold display-4 mb-4">We are redefining the standards of <span className="text-primary">Clinical Care</span></h2>
              
              <p className="text-muted lead mb-5">
                Providing exceptional healthcare with a perfect blend of high-end technology and compassionate medical professionals.
              </p>

              <div className="row g-4 mb-5">
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded-circle bg-primary bg-opacity-10 text-primary">
                      <Award size={24} />
                    </div>
                    <span className="fw-bold text-dark">Award Winning Service</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded-circle bg-primary bg-opacity-10 text-primary">
                      <ShieldCheck size={24} />
                    </div>
                    <span className="fw-bold text-dark">Certified Specialists</span>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-3">
                <button className="btn-premium btn-premium-primary" onClick={() => navigate('/about')}>Discover More</button>
                <button className="btn-premium btn-premium-outline" onClick={() => navigate('/contact')}>Contact us</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}