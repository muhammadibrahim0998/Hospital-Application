
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  Shield,
  Clock,
  Award,
  HeartPulse,
  Users2,
  Building2,
} from "lucide-react";

export default function About() {
  const stats = [
    { label: "OPD Visits / Year", value: "120k" },
    { label: "Bed Capacity", value: 150 },
    { label: "Doctors", value: 40 },
    { label: "Years of Service", value: 10 },
  ];
  const services = [
    { icon: "❤️", title: "Cardiology", desc: "Complete heart care & ICU" },
    { icon: "🦴", title: "Orthopaedics", desc: "Joint & bone surgeries" },
    {
      icon: "🩺",
      title: "General Medicine",
      desc: "Adult health & chronic care",
    },
    { icon: "👶", title: "Paediatrics", desc: "Child health & vaccination" },
  ];
  const depts = [
    {
      img: "https://images.unsplash.com/photo-1551076805-e1869033e561",
      name: "Emergency",
      detail: "Round-the-clock trauma & critical care",
    },
    {
      img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d",
      name: "Radiology",
      detail: "MRI, CT, X-ray & ultrasound",
    },
    {
      img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f",
      name: "Lab Services",
      detail: "WHO-grade diagnostics",
    },
  ];
  const doctors = [
    {
      pic: "https://images.unsplash.com/photo-1582750433449-648ed127bb54",
      name: "Dr Hasnain",
      post: "Chief Cardiologist",
    },
    {
      pic: "https://images.unsplash.com/photo-1594824476967-48c8b964273f",
      name: "Dr Ayesha",
      post: "Head of Paediatrics",
    },
    {
      pic: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d",
      name: "Dr Tariq",
      post: "Consultant Orthopaedic",
    },
  ];
  const features = [
    {
      icon: Shield,
      title: "Patient Safety First",
      description:
        "Rigorous protocols and advanced sterilization ensure your safety at every step.",
    },
    {
      icon: Clock,
      title: "24/7 Emergency Care",
      description:
        "Round-the-clock emergency services with rapid response teams always ready.",
    },
    {
      icon: Award,
      title: "Accredited Excellence",
      description:
        "Nationally recognized for quality standards and patient care excellence.",
    },
    {
      icon: HeartPulse,
      title: "Advanced Technology",
      description:
        "State-of-the-art medical equipment for accurate diagnosis and treatment.",
    },
    {
      icon: Users2,
      title: "Expert Medical Team",
      description:
        "Highly qualified specialists with decades of combined experience.",
    },
    {
      icon: Building2,
      title: "Modern Facilities",
      description:
        "Comfortable, clean, and well-equipped spaces designed for healing.",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section
        className="text-white d-flex align-items-center mt-5"
        style={{
          minHeight: "400px",
          background:
            "linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6)), url(https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container>
          <h1 className="display-4 fw-bold">About City Care Hospital</h1>
          <p className="lead">
            Compassionate, quality healthcare for everyone.
          </p>
        </Container>
      </section>

      {/* Mission / Vision */}
      <section className="py-5">
        <Container>
          <Row className="g-4 text-center">
            <Col md={6} lg={4}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <h5 className="fw-bold text-danger">Mission</h5>
                  <p className="text-muted small">
                    Provide accessible, affordable & excellent medical care with
                    dignity.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <h5 className="fw-bold text-danger">Vision</h5>
                  <p className="text-muted small">
                    Become the most trusted hospital in KPK through innovation &
                    empathy.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <h5 className="fw-bold text-danger">Values</h5>
                  <p className="text-muted small">
                    Compassion ‧ Respect ‧ Quality ‧ Transparency ‧ Commitment
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Story */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="mb-4 mb-md-0">
              <h3 className="fw-bold text-danger">Our Story</h3>
              <p className="text-muted">
                Founded in 2014, City Care Hospital started with a simple
                promise: no patient will ever be denied treatment because they
                cannot pay. From a 20-bed facility we have grown into a 150-bed
                regional leader, delivering more than 1 million OPD
                consultations to date.
              </p>
            </Col>
            <Col md={6}>
              <img
                src="https://images.unsplash.com/photo-1550831107-1553da8c8464"
                className="img-fluid rounded shadow"
                alt="Story"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-5">
        <Container>
          <h3 className="text-center fw-bold mb-4">By the Numbers</h3>
          <Row className="g-3">
            {stats.map((s, i) => (
              <Col md={3} sm={6} key={i}>
                <Card className="text-center shadow-sm border-0">
                  <Card.Body>
                    <div className="fs-2 fw-bold text-danger">{s.value}</div>
                    <div className="text-muted">{s.label}</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Services */}
      <section className="py-5 bg-light">
        <Container>
          <h3 className="text-center fw-bold mb-4">Our Services</h3>
          <Row className="g-4">
            {services.map((sv, i) => (
              <Col md={6} lg={3} key={i}>
                <Card className="h-100 text-center shadow-sm border-0">
                  <Card.Body>
                    <div className="fs-1">{sv.icon}</div>
                    <h6 className="fw-bold mt-2">{sv.title}</h6>
                    <p className="small text-muted">{sv.desc}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Departments */}
      <section className="py-5">
        <Container>
          <h3 className="text-center fw-bold mb-4">Departments</h3>
          <Row className="g-4">
            {depts.map((d, i) => (
              <Col md={4} key={i}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Img
                    variant="top"
                    src={d.img}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <h6 className="fw-bold text-danger">{d.name}</h6>
                    <p className="small text-muted">{d.detail}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Doctors */}
      <section className="py-5 bg-light">
        <Container>
          <h3 className="text-center fw-bold mb-4">Meet Our Doctors</h3>
          <Row className="g-4">
            {doctors.map((doc, i) => (
              <Col md={4} key={i}>
                <Card className="text-center shadow-sm border-0">
                  <Card.Img
                    variant="top"
                    src={doc.pic}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <h6 className="fw-bold">{doc.name}</h6>
                    <p className="small text-muted">{doc.post}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-5 bg-danger text-white">
        <Container className="text-center">
          <h4>Your Health, Our Priority</h4>
          <a href="/contact" className="btn btn-outline-light btn-lg mt-3">
           Contact Us 
          </a>
        </Container>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center g-5">
            {/* LEFT CONTENT */}
            <div className="col-lg-6">
              <span className="text-danger fw-semibold text-uppercase small d-block mb-2">
                Why Choose Us
              </span>

              <h2 className="fw-bold mb-3">
                Excellence in Every{" "}
                <span className="text-danger">Aspect of Care</span>
              </h2>

              <p className="text-muted mb-4">
                At City Care Hospital, we believe that exceptional healthcare
                goes beyond just treating symptoms. It's about creating an
                environment where patients feel valued, understood, and cared
                for.
              </p>

              {/* FEATURES */}
              <div className="row g-3">
                {features.map((feature, index) => (
                  <div className="col-md-6" key={index}>
                    <div className="d-flex p-3 border rounded h-100 bg-white shadow-sm">
                      <div className="me-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded"
                          style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "rgba(220,53,69,0.1)",
                          }}
                        >
                          <feature.icon size={20} className="text-danger" />
                        </div>
                      </div>

                      <div>
                        <h6 className="fw-bold mb-1">{feature.title}</h6>
                        <p className="text-muted small mb-0">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT IMAGES */}
            <div className="col-lg-6 position-relative">
              <div className="row g-3">
                <div className="col-6">
                  <img
                    src="https://images.unsplash.com/photo-1551190822-a9333d879b1f"
                    alt="Doctor with patient"
                    className="img-fluid rounded shadow mb-3"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118"
                    alt="Medical equipment"
                    className="img-fluid rounded shadow"
                  />
                </div>

                <div className="col-6 pt-4">
                  <img
                    src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133"
                    alt="Hospital room"
                    className="img-fluid rounded shadow mb-3"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634"
                    alt="Medical team"
                    className="img-fluid rounded shadow"
                  />
                </div>
              </div>

              {/* FLOATING BADGE */}
              <div
                className="position-absolute bg-white shadow rounded p-3 text-center"
                style={{ bottom: "-20px", left: "-20px" }}
              >
                <h3 className="fw-bold text-danger mb-0">10+</h3>
                <small className="text-muted">Years of Trust</small>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
