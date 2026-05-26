import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./TechStack.css";

gsap.registerPlugin(ScrollTrigger);
import { 
  SiPython, SiJavascript, SiTypescript, SiPostgresql, 
  SiFirebase, SiNumpy, SiReact, SiScikitlearn, SiMongodb, 
  SiSupabase, SiFigma, SiHuggingface, SiCss, SiTailwindcss, 
  SiFastapi, SiFlask, SiNodedotjs, SiDocker, 
  SiGithub, SiGit, SiNextdotjs, SiExpress 
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { TbApi, TbBrandVscode } from "react-icons/tb";

const techData = [
  // Row 1 (7 items)
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "Java", icon: FaJava, color: "#f89820" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
  { name: "Express", icon: SiExpress, color: "#ffffff" },
  
  // Row 2 (6 items)
  { name: "NumPy", icon: SiNumpy, color: "#4dabcf" },
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "Scikit-learn", icon: SiScikitlearn, color: "#F7931E" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
  { name: "Figma", icon: SiFigma, color: "#F24E1E" },
  
  // Row 3 (5 items)
  { name: "Hugging Face", icon: SiHuggingface, color: "#FFD21E" },
  { name: "CSS", icon: SiCss, color: "#1572B6" },
  { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "FastAPI", icon: SiFastapi, color: "#009688" },
  { name: "Flask", icon: SiFlask, color: "#ffffff" },
  
  // Row 4 (4 items)
  { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
  { name: "Docker", icon: SiDocker, color: "#2496ED" },
  { name: "VS Code", icon: TbBrandVscode, color: "#007ACC" },
  { name: "GitHub", icon: SiGithub, color: "#ffffff" },
  
  // Row 5 (3 items)
  { name: "Git", icon: SiGit, color: "#F05032" },
  { name: "Next.js", icon: SiNextdotjs, color: "#ffffff" },
  { name: "REST API", icon: TbApi, color: "#c697ff" },
];

export default function TechStack() {
  const rows = [
    techData.slice(0, 7),
    techData.slice(7, 13),
    techData.slice(13, 18),
    techData.slice(18, 22),
    techData.slice(22, 25),
  ];

  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".tech-card",
        { scale: 0.8, opacity: 0, y: 20 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            once: true,
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="tech-stack-section" ref={containerRef}>
      <div className="tech-stack-bg" />
      
      <h2 className="tech-stack-title" data-cursor="hover">TECH STACK</h2>
      
      <div className="tech-stack-container">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="tech-row">
            {row.map((tech, i) => {
              const Icon = tech.icon;
              return (
                <div 
                  key={i} 
                  className="tech-card"
                  style={{ "--hover-color": tech.color } as React.CSSProperties}
                  data-cursor="hover"
                >
                  <Icon className="tech-icon" />
                  <span className="tech-name">{tech.name}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
