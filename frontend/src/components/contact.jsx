import React from "react";
import { FaEnvelope, FaPhone, FaWhatsapp } from "react-icons/fa";

const Contact = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://s3storage.nayatel.com/customer-shifa/uploads/contact_us_d29bd2aae5.webp')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="d-flex align-items-center"
    >
      {/* Overlay */}
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.6)",
          width: "100%",
          minHeight: "100vh",
        }}
        className="d-flex align-items-center"
      >
        <div className="container py-5">
          <div className="row justify-content-center text-white">
            {/* Left Content */}
            <div className="col-lg-6 mb-5">
              <h1 className="mb-4 fw-bold text-center">Contact Us</h1>
              <p className="mb-5 text-center">
                If you want to contact us, please use the following options:
              </p>

              {/* Contact Boxes */}
              <div className="d-flex flex-column gap-4">
                {/* Email Box */}
                <div className="contact-box p-3 rounded shadow d-flex align-items-center gap-3">
                  <FaEnvelope className="fs-3 text-info" />
                  <div>
                    <p className="mb-1 fw-bold">Email</p>
                    <a
                      href="mailto:ibrahim1530388@gmail.com"
                      className="text-white text-decoration-none"
                    >
                      ibrahim1530388@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone Box */}
                <div className="contact-box p-3 rounded shadow d-flex align-items-center gap-3">
                  <FaPhone className="fs-3 text-success" />
                  <div>
                    <p className="mb-1 fw-bold">Phone</p>
                    <span>0306 9578493</span>
                  </div>
                </div>

                {/* WhatsApp Box */}
                <div className="contact-box p-3 rounded shadow d-flex align-items-center gap-3">
                  <FaWhatsapp className="fs-3 text-success" />
                  <div>
                    <p className="mb-1 fw-bold">WhatsApp</p>
                    <a
                      href="https://wa.me/923069578493"
                      target="_blank"
                      rel="noreferrer"
                      className="text-white text-decoration-none"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Map */}
            <div className="col-lg-6 mb-5">
              <h5 className="mb-3 text-center">Our Location</h5>
              <div
                style={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  height: "450px",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
                }}
              >
                <iframe
                  title="Peshawar Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3317.636925625669!2d71.47180027627367!3d34.01513648059854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df965fa1a80ab9%3A0x15b8c4c1b22c2c!2sPeshawar%2C%20Khyber%20Pakhtunkhwa%2C%20Pakistan!5e0!3m2!1sen!2s!4v1704975612345!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline CSS for hover & 3D effect */}
      <style>
        {`
          .contact-box {
            background-color: rgba(255, 255, 255, 0.05);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .contact-box:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.6);
          }
          a:hover {
            color: #0d6efd !important;
            text-decoration: underline;
          }
          @media (max-width: 768px) {
            .contact-box {
              flex-direction: row;
              justify-content: flex-start;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Contact;
