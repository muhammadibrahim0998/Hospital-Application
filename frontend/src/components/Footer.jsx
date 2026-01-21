import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaLinkedin,
  FaFacebookF,
  FaTwitter,
} from "react-icons/fa";

const Footer = ({ isSidebarOpen = false, sidebarWidth = 230 }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const marginLeft = isMobile ? 0 : isSidebarOpen ? sidebarWidth : 0;

  return (
    <footer
      className="bg-dark text-light mt-5"
      style={{
        marginLeft: `${marginLeft}0`,
        transition: "margin-left 0.3s ease",
        width: isMobile ? "100%" : `calc(100% - ${marginLeft}px)`,
      }}
    >
      <div className="container py-5">
        <div className="row gy-4 text-center text-md-start">
          {/* CONTACT */}
          <div className="col-12 col-md-4">
            <h6 className="fw-semibold mb-3">Contact</h6>
            <p className="small mb-2">
              <FaEnvelope className="me-2 text-info" />
              ibrahim1530388@gmail.com
            </p>
            <p className="small mb-2">
              <FaPhone className="me-2 text-success" />
              0306 9578493
            </p>
            <p className="small mb-0">
              <FaWhatsapp className="me-2 text-success" />
              WhatsApp Chat
            </p>
          </div>

          {/* SOCIAL */}
          <div className="col-12 col-md-4">
            <h6 className="fw-semibold mb-3">Follow Us</h6>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <a href="#" className="text-light fs-6">
                <FaLinkedin />
              </a>
              <a href="#" className="text-light fs-6">
                <FaFacebookF />
              </a>
              <a href="#" className="text-light fs-6">
                <FaTwitter />
              </a>
            </div>
          </div>

          {/* ABOUT */}
          <div className="col-12 col-md-4">
            <h6 className="fw-semibold mb-3">About</h6>
            <p className="small text-muted mb-0">
              Providing modern and responsive web solutions with best
              development practices.
            </p>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="text-center small text-muted">
          © {new Date().getFullYear()} Your Name. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
