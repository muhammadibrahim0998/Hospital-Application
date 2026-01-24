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
      description: "Rigorous protocols ensure safety.",
    },
    {
      icon: Clock,
      title: "24/7 Emergency Care",
      description: "Rapid emergency response teams.",
    },
    {
      icon: Award,
      title: "Accredited Excellence",
      description: "Recognized for quality care.",
    },
    {
      icon: HeartPulse,
      title: "Advanced Technology",
      description: "State-of-the-art equipment.",
    },
    {
      icon: Users2,
      title: "Expert Medical Team",
      description: "Highly qualified specialists.",
    },
    {
      icon: Building2,
      title: "Modern Facilities",
      description: "Comfortable healing spaces.",
    },
  ];

  return (
    <>
      {/* HERO */}
      <section
        className="text-white d-flex align-items-center"
        style={{
          minHeight: "340px",
          background:
            "linear-gradient(rgba(0,0,0,.65), rgba(0,0,0,.65)), url(https://images.unsplash.com/photo-1586773860418-d37222d8fce3)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          marginTop: "47px",
          marginLeft: "5px",
        }}
      >
        <Container>
          <h1 className="fw-bold fs-2 fs-md-1">About City Care Hospital</h1>
          <p className="fs-6 fs-md-5 text-light opacity-75">
            Compassionate, quality healthcare for everyone.
          </p>
        </Container>
      </section>

      {/* STATS */}
      <section className="py-5">
        <Container>
          <Row className="g-3">
            {stats.map((s, i) => (
              <Col key={i} xs={6} md={3}>
                <Card className="text-center border-0 shadow-sm h-100">
                  <Card.Body>
                    <div className="fs-4 fs-md-3 fw-bold text-danger">
                      {s.value}
                    </div>
                    <div className="small text-muted">{s.label}</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* SERVICES */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="g-3">
            {services.map((sv, i) => (
              <Col key={i} xs={12} sm={6} md={3}>
                <Card className="h-100 text-center border-0 shadow-sm">
                  <Card.Body>
                    <div className="fs-2">{sv.icon}</div>
                    <h6 className="fw-semibold mt-2 fs-6">{sv.title}</h6>
                    <p className="small text-muted mb-0">{sv.desc}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* DEPARTMENTS */}
      <section className="py-5">
        <Container>
          <Row className="g-4">
            {depts.map((d, i) => (
              <Col key={i} xs={12} md={4}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Img
                    src={d.img}
                    className="img-fluid"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <h6 className="fw-semibold text-danger fs-6">{d.name}</h6>
                    <p className="small text-muted mb-0">{d.detail}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* DOCTORS */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="g-4">
            {doctors.map((doc, i) => (
              <Col key={i} xs={12} sm={6} md={4}>
                <Card className="text-center border-0 shadow-sm h-100">
                  <Card.Img
                    src={doc.pic}
                    className="img-fluid"
                    style={{ maxHeight: "240px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <h6 className="fw-semibold mb-1">{doc.name}</h6>
                    <small className="text-muted">{doc.post}</small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* FEATURES */}
      <section className="py-5">
        <Container>
          <Row className="g-3">
            {features.map((f, i) => (
              <Col key={i} xs={12} sm={6}>
                <div className="d-flex align-items-start p-3 bg-white border rounded shadow-sm h-100">
                  <f.icon
                    size={22}
                    className="text-danger me-3 flex-shrink-0"
                  />
                  <div>
                    <h6 className="fw-semibold fs-6 mb-1">{f.title}</h6>
                    <p className="small text-muted mb-0">{f.description}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
}
