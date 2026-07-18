import React, { useEffect, useRef } from "react";
import { config } from "./config";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { applyCardTilt } from "../utils/animations";

gsap.registerPlugin(ScrollTrigger);

export const Experience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the timeline connecting bar to draw downward
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".career-info",
            start: "top 70%",
            end: "bottom 80%",
            scrub: true,
          },
        }
      );

      // Fade-up trigger for individual cards
      const cards = gsap.utils.toArray<HTMLElement>(".career-info-box");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              once: true,
            },
          }
        );
        // Apply tilt effect
        applyCardTilt(card);
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="career-section" id="career" ref={containerRef}>
      <div className="section-container">
        <div className="career-container">
          <h2>
            Career
            <br />
            <span>Timeline</span>
          </h2>

          <div className="career-info">
            <div className="career-timeline" ref={lineRef} />
            <div className="career-dot" />

            {config.experiences.map((exp, idx) => (
              <div className="career-info-box glass-card" data-cursor="disable" key={idx}>
                <div className="career-info-in">
                  <div className="career-role">
                    <h4>{exp.position}</h4>
                    <h5>{exp.company}</h5>
                  </div>
                  <h3>{exp.period}</h3>
                </div>
                <p>{exp.description}</p>
                {exp.responsibilities && (
                  <ul className="career-responsibilities" style={{ marginTop: "15px", listStyleType: "none", paddingLeft: "0" }}>
                    {exp.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} style={{ fontSize: "14px", color: "#b3aab9", marginBottom: "8px", display: "flex", alignItems: "flex-start" }}>
                        <span style={{ color: "#ffffff", marginRight: "10px" }}>•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="what-content-flex" style={{ marginTop: "20px" }}>
                  {exp.technologies.map((tech, idx2) => (
                    <span className="what-tags" key={idx2}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Experience;
