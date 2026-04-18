import React from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { useDoctors } from "../context/DoctorContext";
import { useDepartments } from "../context/DepartmentContext";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";
import {
  Shield,
  Clock,
  Award,
  HeartPulse,
  Users2,
  Building2,
  CheckCircle2,
  Phone,
  ArrowRight,
} from "lucide-react";
import { FaFlask } from "react-icons/fa";

export default function About() {
  const { doctors } = useDoctors();
  const { departments } = useDepartments();


  // Stats - dynamically calculating doctor count
  const stats = [
    { label: "Annual Patients", value: "10,000+", icon: <Users2 className="text-primary mb-2" />, color: "primary" },
    { label: "Modern Beds", value: "100+", icon: <Building2 className="text-success mb-2" />, color: "success" },
    { label: "Expert Doctors", value: `${doctors.length}+`, icon: <Award className="text-warning mb-2" />, color: "warning" },
    { label: "Emergency Units", value: "24/7", icon: <Clock className="text-danger mb-2" />, color: "danger" },
  ];

  return (
    <div className="bg-white overflow-hidden">
      {/* Dynamic Hero Section */}
      <section
        className="position-relative overflow-hidden text-white d-flex align-items-center"
        style={{
          minHeight: "550px",
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%), url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          marginTop: "-24px",
          marginRight: "-24px",
          marginLeft: "-24px",
        }}
      >
        <div className="position-absolute w-100 h-100 top-0 start-0" style={{ background: "radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)" }}></div>
        <Container className="py-5 position-relative z-index-2">
          <Row className="justify-content-center justify-content-lg-start">
            <Col xs={11} md={10} lg={8} xl={7} className="text-start px-4 px-md-5">
              <div className="py-md-4">
                <span className="badge bg-primary px-3 py-2 rounded-pill mb-4 text-uppercase fw-bold ls-2 animate-fade-in shadow-sm" style={{ fontSize: '0.65rem', letterSpacing: '2px' }}>
                  Next-Gen Healthcare Management
                </span>
                <h1 className="display-5 fw-black mb-3 ls-n1 text-white text-shadow-sm" style={{ lineHeight: '1.2' }}>
                  Hospital <span className="text-primary fst-italic">Management</span> System
                </h1>
                <p className="mb-5 opacity-90 text-light fs-6 fs-md-5 border-start border-4 border-primary ps-4 py-1" style={{ maxWidth: "700px", lineHeight: "1.7", backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "0 8px 8px 0" }}>
                  Empowering healthcare providers with a unified digital ecosystem. From the <strong>Smart Pathology Lab</strong> to advanced practitioner dashboards, we redefine clinical efficiency.
                </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <Button as={Link} to="/find-doctor" className="px-4 py-2 rounded-pill fw-bold shadow-lg border-0" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", fontSize: '0.95rem' }}>
                  Book Appointment <ArrowRight className="ms-2" size={18} />
                </Button>
                <Button as={Link} to="/contact" variant="outline-light" className="px-4 py-2 rounded-pill fw-bold border-2 backdrop-blur hover-bg-light text-white" style={{ fontSize: '0.95rem' }}>
                  Learn More
                </Button>
              </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Modern Stats Section */}
      <section className="py-5" style={{ marginTop: "-80px" }}>
        <Container>
          <Row className="justify-content-center">
            {[
              { label: "Lab Investigations", value: "50,000+", icon: <FaFlask className="text-primary mb-2 fs-3" />, color: "primary" },
              { label: "Active Clinicians", value: `${doctors.length}+`, icon: <Award className="text-info mb-2 fs-3" />, color: "info" },
              { label: "Registered Patients", value: "25,000+", icon: <Users2 className="text-success mb-2 fs-3" />, color: "success" },
              { label: "System Uptime", value: "99.9%", icon: <Shield className="text-warning mb-2 fs-3" />, color: "warning" },
            ].map((s, i) => (
              <Col key={i} xs={12} sm={6} lg={3} className="mb-4">
                <Card className="border-0 shadow-lg text-center h-100 py-4 glass-card transform-hover transition-all rounded-4 overflow-hidden border-top border-4 border-primary">
                  <Card.Body>
                    <div className="mb-3">{s.icon}</div>
                    <h2 className="fw-bold mb-1 text-dark tracking-tighter">{s.value}</h2>
                    <div className="text-muted text-uppercase small fw-extrabold tracking-widest" style={{ fontSize: '0.7rem' }}>{s.label}</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Core Ecosystem Section */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <div className="pe-lg-5">
                <h2 className="fs-2 fw-bold text-dark mb-4 ls-n1">The Digital <span className="text-primary">Ecosystem</span></h2>
                <p className="text-muted mb-4 leading-relaxed">
                  Our Hospital Management System is built to streamline every aspect of patient care, from first registration to final laboratory reporting.
                </p>
                <div className="space-y-4 mb-5">
                  {[
                    { title: "Smart Pathology Lab", desc: "Automated test ordering and precise clinical reporting." },
                    { title: "Role-Based Security", desc: "Specific dashboards for Doctors, Patients, and Admin staff." },
                    { title: "Centralized Diagnostics", desc: "One-click access to finalized laboratory investigations." },
                  ].map((item, idx) => (
                    <div key={idx} className="d-flex align-items-start mb-4 p-3 rounded-4 hover-bg-light transition-all">
                      <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3">
                        <CheckCircle2 className="text-primary" size={24} />
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1">{item.title}</h6>
                        <p className="small text-muted mb-0">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-light rounded-4 border-start border-primary border-4 shadow-sm glass-card">
                  <blockquote className="mb-0 italic fs-5 text-dark font-italic">
                    "Transforming healthcare by merging clinical precision with seamless digital workflows."
                  </blockquote>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="position-relative">
                <div className="rounded-4 shadow-2xl overflow-hidden" style={{ transform: "perspective(1000px) rotateY(-5deg)" }}>
                  <img
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Digital Healthcare"
                    className="img-fluid"
                  />
                </div>
                <div className="position-absolute top-50 start-0 translate-middle-x bg-white p-4 rounded-4 shadow-lg d-none d-md-block border-start border-4 border-info">
                  <div className="text-center">
                    <h4 className="fw-bold mb-0 text-info">LIVE</h4>
                    <p className="small mb-0 text-muted fw-bold">Cloud Reporting</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Laboratory Deep-Dive */}
      <section className="py-5 bg-dark text-white position-relative overflow-hidden">
        <div className="position-absolute top-0 end-0" style={{ opacity: 0.05, transform: "rotate(15deg)", zIndex: 0, padding: "20px" }}>
            <FaFlask size={180} />
        </div>
        <Container className="py-5">
          <Row className="align-items-center g-5">
            <Col lg={5} className="order-lg-2">
              <h2 className="fs-2 fw-bold mb-4">Smart <span className="text-primary">Pathology</span> Lab</h2>
              <p className="opacity-75 mb-5 fs-6">
                Our cutting-edge laboratory module integrates seamless billing, patient investigation queues, and professional clinical reporting.
              </p>
              <ul className="list-unstyled space-y-3">
                <li className="d-flex align-items-center mb-3">
                  <Badge bg="primary" className="me-3 p-2 rounded-circle"><Clock size={16} /></Badge>
                  <span>Rapid Automated Report Generation</span>
                </li>
                <li className="d-flex align-items-center mb-3">
                  <Badge bg="primary" className="me-3 p-2 rounded-circle"><Shield size={16} /></Badge>
                  <span>Secure Patient Record Vault</span>
                </li>
                <li className="d-flex align-items-center mb-3">
                  <Badge bg="primary" className="me-3 p-2 rounded-circle"><CheckCircle2 size={16} /></Badge>
                  <span>ISO Certified Diagnostic Standards</span>
                </li>
              </ul>
            </Col>
            <Col lg={7} className="order-lg-1">
              <Card className="border-0 shadow-2xl bg-white overflow-hidden rounded-4 text-dark">
                <Card.Header className="bg-light border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-primary">Sample Clinical Report Preview</span>
                    <Badge bg="success" className="px-3 rounded-pill">Validated</Badge>
                </Card.Header>
                <Card.Body className="p-0">
                    <div style={{ height: "300px", background: "#f8f9fa", border: "20px solid #fff" }} className="d-flex align-items-center justify-content-center text-center">
                        <div>
                            <p className="fs-3 text-muted opacity-20 fw-bold">SMART LAB<br/>HM SYSTEM</p>
                            <div className="mt-2" style={{ height: "4px", width: "100px", background: "#3b82f6", margin: "0 auto" }}></div>
                        </div>
                    </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Teams / Doctors Summary */}
      <section className="py-5 mt-5">
        <Container>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-end mb-5">
            <div>
              <h2 className="fw-bold fs-2 mb-2 tracking-tight">Our Elite <span className="text-primary">Panel</span></h2>
              <p className="text-muted mb-0">Professional practitioners at the core of our management system.</p>
            </div>
            <Link to="/doctors" className="btn btn-link text-primary fw-bold text-decoration-none p-0 mt-3 mt-md-0">
              Explore Medical Staff <ArrowRight size={18} className="ms-1" />
            </Link>
          </div>
          <Row className="g-4">
            {doctors.map((doc, i) => (
              <Col key={i} sm={6} lg={4}>
                <Card className="border-0 shadow-lg rounded-4 overflow-hidden h-100 transform-hover transition-all glass-card border-bottom border-3 border-light">
                  <div className="overflow-hidden position-relative" style={{ height: "320px" }}>
                    <Card.Img
                      variant="top"
                      src={
                        doc.image
                          ? doc.image.startsWith("http") || doc.image.startsWith("data:")
                            ? doc.image
                            : `${API_BASE_URL}${doc.image.startsWith("/") ? "" : "/"}${doc.image}`
                          : "https://img.icons8.com/color/96/doctor-male.png"
                      }
                      className="img-fluid w-100 h-100 object-fit-cover transition-all"
                      style={{ transition: "transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)" }}
                    />
                    <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.8))", color: "#fff" }}>
                        <h5 className="fw-bold mb-0">{doc.name}</h5>
                        <p className="small mb-0 opacity-75">{doc.specialty}</p>
                    </div>
                  </div>
                  <Card.Body className="p-4 bg-white">
                    <div className="d-flex justify-content-between align-items-center mb-0">
                         <Badge bg="primary-subtle" className="text-primary rounded-pill px-3 py-2 border-0 fw-bold" style={{ fontSize: '0.65rem' }}>STAFF PRACTITIONER</Badge>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Global CTA Section */}
      <section className="py-5 mb-5">
        <Container>
          <div
            className="rounded-5 overflow-hidden shadow-2xl position-relative"
            style={{ minHeight: "350px" }}
          >
            <div className="position-absolute w-100 h-100 top-0 start-0" style={{ background: "linear-gradient(225deg, #1e293b 0%, #0f172a 100%)" }}></div>
            <div className="position-absolute top-0 end-0 p-5" style={{ opacity: 0.05, transform: "rotate(12deg)", zIndex: 0 }}>
              <HeartPulse size={180} />
            </div>
            
            <Row className="g-0 position-relative h-100">
                <Col lg={7} className="p-4 p-md-5 d-flex flex-column justify-content-center text-white">
                    <h2 className="fs-2 fw-bold mb-3 tracking-tight">Experience Digital <span className="text-primary">Excellence</span></h2>
                    <p className="opacity-75 mb-4 fs-6"> Empowering patients and practitioners with a system built for the future of healthcare.</p>
                    <div className="d-flex flex-column flex-sm-row gap-3">
                        <Button as={Link} to="/find-doctor" variant="primary" className="px-4 py-2 rounded-pill fw-bold shadow-lg border-0" style={{ fontSize: '0.95rem' }}>
                            Book Now
                        </Button>
                        <a href="tel:+1234567890" className="btn btn-outline-light px-4 py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center backdrop-blur" style={{ fontSize: '0.95rem' }}>
                            <Phone size={16} className="me-2" /> Support Desk
                        </a>
                    </div>
                </Col>
                <Col lg={5} className="d-none d-lg-block">
                    <div className="h-100" style={{ background: "url('https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')", backgroundSize: "cover", backgroundPosition: "center" }}></div>
                </Col>
            </Row>
          </div>
        </Container>
      </section>

      <style>{`
        .glass-card {
            background: rgba(255, 255, 255, 0.8) !important;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
        }
        .transform-hover:hover {
            transform: translateY(-10px) scale(1.02);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
        }
        .ls-2 { letter-spacing: 2px; }
        .ls-n1 { letter-spacing: -1px; }
        .backdrop-blur { backdrop-filter: blur(8px); }
        .hover-bg-light:hover { background: #f8f9fa; }
        .hover-bg-primary:hover { background: #3b82f6 !important; border-color: #3b82f6 !important; }
        .hover-text-white:hover { color: #fff !important; }
        .animate-fade-in { animation: fadeIn 1s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

