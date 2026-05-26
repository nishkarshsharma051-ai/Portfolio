import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TechItem {
  name: string;
  icon: string;
}

export const TechPyramid: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".techstack-row",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".techstack-pyramid",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Set up rows for the tech pyramid
  const row1: TechItem[] = [
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  ];

  const row2: TechItem[] = [
    { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  ];

  const row3: TechItem[] = [
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "PyTorch", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
    { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { name: "TensorFlow", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
  ];

  const row4: TechItem[] = [
    { name: "FastAPI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
    { name: "Ethereum", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ethereum/ethereum-original.svg" },
    { name: "Arduino", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg" },
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  ];

  return (
    <div className="techstack-new" ref={containerRef}>
      <div className="techstack-video-container">
        {/* Subtle grid background mesh */}
        <div className="techstack-overlay" />
      </div>

      <div className="techstack-content">
        <h2>
          Core Stack &<br />
          <span>Technologies</span>
        </h2>

        <div className="techstack-pyramid">
          {/* Row 1 */}
          <div className="techstack-row">
            {row1.map((tech) => (
              <div className="techstack-item" data-cursor="disable" key={tech.name}>
                <img src={tech.icon} alt={tech.name} />
                <span>{tech.name}</span>
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="techstack-row">
            {row2.map((tech) => (
              <div className="techstack-item" data-cursor="disable" key={tech.name}>
                <img src={tech.icon} alt={tech.name} />
                <span>{tech.name}</span>
              </div>
            ))}
          </div>

          {/* Row 3 */}
          <div className="techstack-row">
            {row3.map((tech) => (
              <div className="techstack-item" data-cursor="disable" key={tech.name}>
                <img src={tech.icon} alt={tech.name} />
                <span>{tech.name}</span>
              </div>
            ))}
          </div>

          {/* Row 4 */}
          <div className="techstack-row">
            {row4.map((tech) => (
              <div className="techstack-item" data-cursor="disable" key={tech.name}>
                <img src={tech.icon} alt={tech.name} />
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default TechPyramid;
