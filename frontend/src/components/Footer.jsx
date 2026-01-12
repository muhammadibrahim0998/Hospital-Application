import React from "react";
import {
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaLinkedin,
  FaFacebookF,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-auto w-100">
      {/* Outer full width container */}
      <div className="container py-5">
        <div className="row text-center text-md-start">
          {/* Contact Info */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-3">Contact</h5>
            <p className="mb-2 d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-start">
              <FaEnvelope className="me-2 text-info fs-5 mb-1 mb-md-0" />
              <a
                href="mailto:ibrahim1530388@gmail.com"
                className="text-white text-decoration-none hover-effect"
              >
                ibrahim1530388@gmail.com
              </a>
            </p>
            <p className="mb-2 d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-start">
              <FaPhone className="me-2 text-success fs-5 mb-1 mb-md-0" /> 0306
              9578493
            </p>
            <p className="mb-2 d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-start">
              <FaWhatsapp className="me-2 text-success fs-5 mb-1 mb-md-0" />
              <a
                href="https://wa.me/923069578493"
                target="_blank"
                rel="noreferrer"
                className="text-white text-decoration-none hover-effect"
              >
                WhatsApp Chat
              </a>
            </p>
          </div>

          {/* Social Links */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-3">Follow Us</h5>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <a
                href="https://www.linkedin.com/feed/"
                target="_blank"
                rel="noreferrer"
                className="text-white fs-5 hover-icon"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://www.facebook.com/share/1BwKJcVvHo/"
                target="_blank"
                rel="noreferrer"
                className="text-white fs-5 hover-icon"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noreferrer"
                className="text-white fs-5 hover-icon"
              >
                <FaTwitter />
              </a>
            </div>
          </div>

          {/* About / Branding */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-3">About</h5>
            <p className="text-center text-md-start">
              Providing quality healthcare with modern, responsive, and
              user-friendly web solutions. Committed to delivering seamless
              patient experiences using advanced technology and best practices.
            </p>
          </div>
        </div>

        <hr className="border-light" />

        <div className="text-center small">
          &copy; {new Date().getFullYear()} Your Name. All rights reserved.
        </div>
      </div>

      {/* Hover effects */}
      <style>
        {`
          .hover-icon:hover {
            color: #0d6efd !important;
            transform: scale(1.3);
            transition: all 0.3s ease-in-out;
          }
          .hover-effect:hover {
            text-decoration: underline;
            color: #0d6efd !important;
            transition: all 0.3s ease-in-out;
          }
          @media (max-width: 767px) {
            .hover-icon {
              font-size: 1.5rem;
            }
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;
