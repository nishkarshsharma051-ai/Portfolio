import React from "react";
import { config } from "./config";
import { useNavigate } from "react-router-dom";

export const Contact: React.FC = () => {
  const navigate = useNavigate();

  const handleTalkClick = () => {
    navigate("/play");
  };

  return (
    <div className="contact-section" id="contact">
      <div className="contact-container">
        <h3>
          Want to build
          <br />
          <span style={{ color: "var(--accentColor)" }}>something cool?</span>
        </h3>

        {/* Dynamic call to actions */}
        <div className="cta-section" style={{ padding: "0 0 80px 0", justifyContent: "flex-start" }}>
          <div className="cta-buttons">
            <button className="cta-btn cta-btn-play" onClick={handleTalkClick} data-cursor="disable">
              💬 TALK WITH ME
            </button>
            <a className="cta-btn cta-btn-hire" href={`mailto:${config.contact.email}`} data-cursor="disable">
              ✉️ HIRE ME
            </a>
          </div>
        </div>

        <div className="contact-flex">
          {/* Email / Connection details */}
          <div className="contact-box">
            <h4>Get in Touch</h4>
            <p>
              <a href={`mailto:${config.contact.email}`} data-cursor="disable" style={{ color: "var(--textColor)" }}>
                {config.contact.email}
              </a>
            </p>

            <h4>Social Channels</h4>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <a className="contact-social" href={config.contact.github} target="_blank" rel="noopener noreferrer" data-cursor="disable">
                GITHUB
              </a>
              <a className="contact-social" href={config.contact.linkedin} target="_blank" rel="noopener noreferrer" data-cursor="disable">
                LINKEDIN
              </a>
              <a className="contact-social" href={config.contact.twitter} target="_blank" rel="noopener noreferrer" data-cursor="disable">
                TWITTER
              </a>
              <a className="contact-social" href={config.contact.instagram} target="_blank" rel="noopener noreferrer" data-cursor="disable">
                INSTAGRAM
              </a>
            </div>
          </div>

          {/* Copyright and signature details */}
          <div className="contact-box" style={{ alignItems: "flex-end", justifyContent: "flex-end", textAlign: "right" }}>
            <h2>
              Nishkarsh
              <br />
              <span>Sharma</span>
            </h2>
            <h5>
              Designed & Coded with passion © {new Date().getFullYear()}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact;
