import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useDoctors } from "../context/DoctorContext";
import { useDepartments } from "../context/DepartmentContext";
import { Link } from "react-router-dom";
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

export default function About() {
  const { doctors } = useDoctors();
  const { departments } = useDepartments();

  // Limiting to show top 3 doctors for the About page feature
  const topDoctors = doctors.slice(0, 3);

  // Stats - using exact requested values for professional display
  const stats = [
    { label: "Annual Patients", value: "120,000+", icon: <Users2 className="text-primary mb-2" />, color: "primary" },
    { label: "Modern Beds", value: "150+", icon: <Building2 className="text-success mb-2" />, color: "success" },
    { label: "Expert Doctors", value: "37+", icon: <Award className="text-warning mb-2" />, color: "warning" },
    { label: "Emergency Units", value: "24/7", icon: <Clock className="text-danger mb-2" />, color: "danger" },
  ];

  return (
    <div className="bg-white">
      {/* Dynamic Hero Section */}
      <section
        className="position-relative overflow-hidden text-white d-flex align-items-center"
        style={{
          minHeight: "450px",
          background: "linear-gradient(rgba(10, 20, 50, 0.7), rgba(10, 20, 50, 0.7)), url('https://images.unsplash.com/photo-1519494026892-80bbd2d670cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          marginTop: "-24px", // Compensating for the layout padding
          marginRight: "-24px",
          marginLeft: "-24px",
        }}
      >
        <Container className="py-5">
          <Row className="z-index-2">
            <Col lg={7} className="text-center text-lg-start">
              <span className="badge bg-primary px-3 py-2 rounded-pill mb-3 text-uppercase fw-bold letter-spacing-1">Founded in 2014</span>
              <h1 className="display-3 fw-bold mb-4">Dedicated to Your <span className="text-primary">Well-being</span></h1>
              <p className="lead mb-5 opacity-90 text-light fs-4 border-start border-4 border-primary ps-4">
                City Care Hospital provides compassionate, high-quality healthcare using state-of-the-art technology and a patient-centric approach.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <Button as={Link} to="/appointments" size="lg" className="px-5 py-3 rounded-pill fw-bold shadow-lg">
                  Book Appointment <ArrowRight className="ms-2" size={20} />
                </Button>
                <Button as={Link} to="/contact" variant="outline-light" size="lg" className="px-5 py-3 rounded-pill fw-bold backdrop-blur">
                  Contact Us
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Modern Stats Section */}
      <section className="py-5" style={{ marginTop: "-60px" }}>
        <Container>
          <Row className="justify-content-center">
            {stats.map((s, i) => (
              <Col key={i} xs={12} sm={6} lg={3} className="mb-4">
                <Card className="border-0 shadow-lg text-center h-100 py-4 transform-hover transition-all bg-white overflow-hidden rounded-4">
                  <span className={`position-absolute top-0 start-0 w-100 h-2 bg-${s.color}`}></span>
                  <Card.Body>
                    <div className="mb-3">{s.icon}</div>
                    <h2 className={`fw-bold mb-1 text-${s.color}`}>{s.value}</h2>
                    <div className="text-muted text-uppercase small fw-bold tracking-wider">{s.label}</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <div className="pe-lg-5">
                <h2 className="display-5 fw-bold text-dark mb-4">Our Mission & <span className="text-primary">Vision</span></h2>
                <p className="text-muted mb-4 fs-5">
                  At City Care Hospital, our mission is to deliver comprehensive healthcare services that exceed expectations through innovation, integrity, and clinical excellence.
                </p>
                <div className="space-y-4 mb-5">
                  <div className="d-flex align-items-center mb-3">
                    <CheckCircle2 className="text-success me-3" size={24} />
                    <span className="fw-semibold text-dark">Patient-Centered Care Model</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <CheckCircle2 className="text-success me-3" size={24} />
                    <span className="fw-semibold text-dark">Ethical Medical Practices</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <CheckCircle2 className="text-success me-3" size={24} />
                    <span className="fw-semibold text-dark">Advanced Diagnostic Facilities</span>
                  </div>
                </div>
                <div className="p-4 bg-light rounded-4 border-start border-primary border-4 shadow-sm">
                  <blockquote className="mb-0 italic fs-5 text-dark font-italic">
                    "Health is a state of complete physical, mental and social well-being and not merely the absence of disease."
                  </blockquote>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="position-relative">
                <img
                  src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Modern Hospital Setting"
                  className="rounded-4 shadow-2xl img-fluid"
                />
                <div className="position-absolute bottom-0 end-0 bg-primary p-4 rounded-4 shadow-lg d-none d-md-block transform-translate-x-1/4 translate-y-1/4">
                  <div className="text-white">
                    <h4 className="fw-bold mb-0">10+</h4>
                    <p className="small mb-0 opacity-80">Years Excellence</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Expertise / Departments Section */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold display-6 mb-3">Our Medical <span className="text-primary">Expertise</span></h2>
            <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
              We provide specialized care across multiple disciplines, ensuring you receive the best treatment for your specific needs.
            </p>
          </div>
          <Row className="g-4">
            {departments.slice(0, 4).map((dept, i) => (
              <Col key={i} md={6} lg={3}>
                <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden transform-hover-up transition-all">
                  <div className="bg-primary p-4 text-center text-white">
                    <Building2 size={40} />
                  </div>
                  <Card.Body className="text-center p-4">
                    <h5 className="fw-bold mb-3">{dept.name}</h5>
                    <ul className="list-unstyled mb-0 px-2 text-start">
                      {dept.fields.map((field, idx) => (
                        <li key={idx} className="small text-muted mb-2 d-flex align-items-center">
                          <CheckCircle2 size={14} className="text-primary me-2 flex-shrink-0" />
                          {field.name}
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-5">
            <Button variant="outline-primary" as={Link} to="/doctors" className="px-4 py-2 rounded-pill fw-bold">
              View All Specialties
            </Button>
          </div>
        </Container>
      </section>

      {/* Experts Section */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center mb-5">
            <Col md={7}>
              <h2 className="fw-bold display-6 mb-3">Meet Our <span className="text-primary">Top Experts</span></h2>
              <p className="text-muted">Our team consists of highly qualified and experienced healthcare professionals.</p>
            </Col>
            <Col md={5} className="text-md-end">
              <Link to="/doctors" className="text-primary fw-bold text-decoration-none d-flex align-items-center justify-content-md-end mb-3">
                See all doctors <ArrowRight size={18} className="ms-2" />
              </Link>
            </Col>
          </Row>
          <Row className="g-4">
            {topDoctors.map((doc, i) => (
              <Col key={i} sm={6} lg={4}>
                <Card className="border-0 shadow-lg rounded-4 overflow-hidden h-100 transform-hover transition-all">
                  <div className="overflow-hidden" style={{ height: "300px" }}>
                    <Card.Img
                      variant="top"
                      src={doc.image}
                      className="img-fluid w-100 h-100 object-fit-cover transition-all"
                      style={{ transition: "transform 0.5s" }}
                    />
                  </div>
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h5 className="fw-bold text-dark mb-0">{doc.name}</h5>
                        <p className="text-primary fw-semibold small mb-0">{doc.specialty}</p>
                      </div>
                      <div className="bg-primary-subtle rounded-3 p-2">
                        <HeartPulse className="text-primary" size={20} />
                      </div>
                    </div>
                    <hr className="my-3 opacity-10" />
                    <div className="d-grid">
                      <Button as={Link} to={`/doctor/${doc.id}`} variant="outline-primary" className="rounded-pill fw-bold btn-sm">
                        View Profile
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <Container>
          <div
            className="rounded-4 p-5 text-center text-white shadow-2xl overflow-hidden position-relative"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)",
            }}
          >
            <div className="position-absolute top-0 end-0 p-5 opacity-10 rotate-12 d-none d-lg-block">
              <HeartPulse size={120} />
            </div>
            <div className="position-absolute bottom-0 start-0 p-5 opacity-10 rotate-n12 d-none d-lg-block">
              <Building2 size={120} />
            </div>

            <div className="z-index-2 position-relative py-4">
              <h2 className="display-5 fw-bold mb-4">Your Health is Our Priority</h2>
              <p className="lead mb-5 opacity-90 mx-auto" style={{ maxWidth: "700px" }}>
                Ready to experience the best healthcare? Join thousands of satisfied patients who trust City Care Hospital for their medical needs.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <Button as={Link} to="/appointments" variant="light" size="lg" className="px-5 py-3 rounded-pill fw-bold text-primary shadow-lg border-0">
                  Book Appointment Now
                </Button>
                <a href="tel:+1234567890" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center backdrop-blur">
                  <Phone size={18} className="me-2" /> Call Helpdesk
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer Info / Accreditation */}
      <section className="py-5 bg-white border-top">
        <Container>
          <Row className="justify-content-center align-items-center text-center g-4 opacity-50">
            <Col xs={6} md={3} className="px-4">
              <Award size={40} className="mb-2" />
              <p className="small fw-bold text-uppercase mb-0">ISO Accredited</p>
            </Col>
            <Col xs={6} md={3} className="px-4">
              <Shield size={40} className="mb-2" />
              <p className="small fw-bold text-uppercase mb-0">Health Certified</p>
            </Col>
            <Col xs={6} md={3} className="px-4">
              <HeartPulse size={40} className="mb-2" />
              <p className="small fw-bold text-uppercase mb-0">Patient First</p>
            </Col>
            <Col xs={6} md={3} className="px-4">
              <Users2 size={40} className="mb-2" />
              <p className="small fw-bold text-uppercase mb-0">Community Rated</p>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

