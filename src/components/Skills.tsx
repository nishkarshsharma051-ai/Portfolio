import React, { useEffect, useRef } from "react";
import { config } from "./config";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { applyCardTilt } from "../utils/animations";

gsap.registerPlugin(ScrollTrigger);

export const Skills: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const skillCards = gsap.utils.toArray<HTMLElement>(".what-content");
      
      // Sequential reveal
      gsap.fromTo(
        skillCards,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".whatIDO",
            start: "top 75%",
            once: true,
          },
        }
      );

      // Apply tilt effect
      skillCards.forEach(card => applyCardTilt(card));
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="whatIDO" ref={containerRef}>
      <div className="what-box">
        <div className="what-box-in">
          <div className="what-content glass-card" data-cursor="disable">
            <div className="what-content-in">
              <h3>{config.skills.develop.title}</h3>
              <h4>{config.skills.develop.description}</h4>
              <p>{config.skills.develop.details}</p>
              <h5>Core Toolsets</h5>
              <div className="what-content-flex">
                {config.skills.develop.tools.map((tool, idx) => (
                  <span className="what-tags" key={idx}>
                    {tool}
                  </span>
                ))}
              </div>
              <div className="card-arrow">↗</div>
            </div>
          </div>
        </div>
      </div>

      <div className="what-box">
        <div className="what-box-in">
          <div className="what-content glass-card" data-cursor="disable">
            <div className="what-content-in">
              <h3>{config.skills.design.title}</h3>
              <h4>{config.skills.design.description}</h4>
              <p>{config.skills.design.details}</p>
              <h5>Core Toolsets</h5>
              <div className="what-content-flex">
                {config.skills.design.tools.map((tool, idx) => (
                  <span className="what-tags" key={idx}>
                    {tool}
                  </span>
                ))}
              </div>
              <div className="card-arrow">↗</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Skills;
