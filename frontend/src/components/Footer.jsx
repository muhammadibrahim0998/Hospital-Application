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
    <footer className="bg-dark text-white w-100">
      <div className="container py-5">
        <div className="row">

          {/* Contact */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">Contact</h5>

            <p>
              <FaEnvelope className="me-2 text-info" />
              ibrahim1530388@gmail.com
            </p>

            <p>
              <FaPhone className="me-2 text-success" />
              0306 9578493
            </p>

            <p>
              <FaWhatsapp className="me-2 text-success" />
              WhatsApp Chat
            </p>
          </div>

          {/* Social */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">Follow Us</h5>
            <div className="d-flex gap-3">
              <FaLinkedin />
              <FaFacebookF />
              <FaTwitter />
            </div>
          </div>

          {/* About */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">About</h5>
            <p>
              Providing modern and responsive web solutions with best
              practices.
            </p>
          </div>

        </div>

        <hr />
        <div className="text-center small">
          © {new Date().getFullYear()} Your Name. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
