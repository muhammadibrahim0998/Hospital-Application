import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    title: "WhatsApp",
    details: ["0306-9578493"],
    action: "https://wa.me/923069578493",
  },
  {
    icon: Mail,
    title: "Email",
    details: ["ibrahim1530388@gmail.com"],
    action: "mailto:ibrahim1530388@gmail.com",
  },
  {
    icon: MapPin,
    title: "Location",
    details: ["City Care Hospital", "Peshawar, Pakistan"],
    action: "#",
  },
  {
    icon: Clock,
    title: "Hours",
    details: ["Mon–Fri: 8AM – 8PM", "Sat–Sun: 9AM – 5PM"],
    action: "#",
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 👉 FORM → EMAIL (DYNAMIC)
  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, phone, subject, message } = formData;

    const mailtoLink = `mailto:ibrahim1530388@gmail.com
      ?subject=${encodeURIComponent(subject)}
      &body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
      )}`;

    window.location.href = mailtoLink;

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div>
      {/* HERO */}
      <section className="py-5 bg-danger text-white text-center mt-5">
        <div className="container">
          <h1 className="fw-bold">Contact Us</h1>
          <p className="opacity-75">We're here to help. Reach out anytime.</p>
        </div>
      </section>

      {/* CONTACT INFO */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            {contactInfo.map((info, index) => (
              <div className="col-md-3" key={index}>
                <a
                  href={info.action}
                  target="_blank"
                  rel="noreferrer"
                  className="text-decoration-none text-dark"
                >
                  <div className="card h-100 shadow-sm text-center p-3">
                    <div className="mb-3 text-danger">
                      <info.icon size={32} />
                    </div>
                    <h6 className="fw-bold">{info.title}</h6>
                    {info.details.map((d, i) => (
                      <p key={i} className="small text-muted mb-0">
                        {d}
                      </p>
                    ))}
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM & MAP */}
      <section className="py-5">
        <div className="container">
          <div className="row g-5">
            {/* FORM */}
            <div className="col-lg-6">
              <div className="card shadow p-4">
                <h4 className="fw-bold mb-2">Send us a Message</h4>
                <p className="text-muted mb-4">
                  Fill the form and send us an email directly.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <input
                        type="text"
                        name="phone"
                        className="form-control"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <input
                        type="text"
                        name="subject"
                        className="form-control"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <textarea
                        name="message"
                        rows="5"
                        className="form-control"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <button className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2">
                        Send Message <Send size={18} />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* MAP */}
            <div className="col-lg-6">
              <div className="shadow rounded overflow-hidden h-100">
                <iframe
                  src="https://www.google.com/maps?q=Peshawar%20Pakistan&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "400px" }}
                  allowFullScreen
                  loading="lazy"
                  title="Peshawar Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EMERGENCY / WHATSAPP */}
      <section className="py-4 bg-dark text-white">
        <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between">
          <div>
            <h5 className="fw-bold mb-1">Emergency? WhatsApp Now!</h5>
            <p className="mb-0 text-muted">Available 24/7 for urgent help.</p>
          </div>
          <a
            href="https://wa.me/923069578493"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-light mt-3 mt-md-0 d-flex align-items-center gap-2"
          >
            <Phone /> 0306-9578493
          </a>
        </div>
      </section>
    </div>
  );
}

