import React, { useEffect, useRef } from "react";
import { config } from "./config";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-me",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-section",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="about-section" id="about" ref={sectionRef}>
      <div className="section-container">
        <div className="about-me" data-cursor="disable">
          <h2 className="title">{config.about.title}</h2>
          <p className="para">{config.about.description}</p>
        </div>
      </div>
    </div>
  );
};
export default About;
