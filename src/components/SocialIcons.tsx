import React, { useEffect, useRef } from "react";
import { config } from "./config";

export const SocialIcons: React.FC = () => {
  const socialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spans = socialRef.current?.querySelectorAll("span");
    if (!spans) return;

    spans.forEach((span) => {
      const link = span.querySelector("a");
      if (!link) return;

      const rect = span.getBoundingClientRect();
      const mid = { x: rect.width / 2, y: rect.height / 2 };
      let cur = { x: mid.x, y: mid.y };

      const onMouseMove = (e: MouseEvent) => {
        const spanRect = span.getBoundingClientRect();
        const mouseX = e.clientX - spanRect.left;
        const mouseY = e.clientY - spanRect.top;

        if (mouseX >= 0 && mouseX <= spanRect.width && mouseY >= 0 && mouseY <= spanRect.height) {
          cur.x += (mouseX - cur.x) * 0.15;
          cur.y += (mouseY - cur.y) * 0.15;
        } else {
          cur.x += (mid.x - cur.x) * 0.15;
          cur.y += (mid.y - cur.y) * 0.15;
        }

        link.style.transform = `translate3d(${cur.x - mid.x}px, ${cur.y - mid.y}px, 0)`;
      };

      document.addEventListener("mousemove", onMouseMove);

      return () => {
        document.removeEventListener("mousemove", onMouseMove);
      };
    });
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social" ref={socialRef}>
        <span>
          <a href={config.contact.github} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
        </span>
        <span>
          <a href={config.contact.linkedin} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
        </span>
        <span>
          <a href={config.contact.twitter} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
            </svg>
          </a>
        </span>
        <span>
          <a href={config.contact.instagram} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </span>
      </div>
      <a className="resume-button" href="#resume" data-cursor="disable">
        <span>RESUME</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </a>
    </div>
  );
};
export default SocialIcons;
