import React, { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { config } from "./config";
import { applyCardTilt } from "../utils/animations";
import "../myworks.css";

gsap.registerPlugin(ScrollTrigger);

export const WorkHorizontal: React.FC = () => {
  const workRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth <= 1024) return;

    const workFlex = workRef.current?.querySelector(".work-flex-alt");
    if (!workFlex) return;

    const boxes = workFlex.querySelectorAll(".work-column-alt");
    if (boxes.length === 0) return;

    const ctx = gsap.context(() => {
      // Calculate how far to scroll based on the width of all cards minus wrapper width
      const getScrollAmount = () => {
        const parentWidth = workFlex.parentElement?.offsetWidth || window.innerWidth;
        return -(workFlex.scrollWidth - parentWidth);
      };

      // Smooth stagger entry animation as the section enters the screen
      gsap.fromTo(
        boxes,
        { opacity: 0, y: 100, filter: "blur(5px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.15,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".work-section-horizontal",
            start: "top 85%",
            once: true,
          },
        }
      );

      // Horizontal pinning animation
      gsap.to(workFlex, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: ".work-section-horizontal",
          start: "top top",
          pin: true,
          scrub: 1,
          end: () => `+=${Math.abs(getScrollAmount())}`,
          invalidateOnRefresh: true,
          anticipatePin: 1, // Reduces any pinning lag or jumping behavior
        },
      });

      // Apply tilt to each card inner content
      const cards = workFlex.querySelectorAll<HTMLElement>(".work-content-even, .work-content-odd");
      cards.forEach(card => applyCardTilt(card));
    });

    return () => ctx.revert();
  }, []);

  const displayProjects = config.projects;

  return (
    <div className="work-section-horizontal career-section relative min-h-screen md:h-screen md:overflow-hidden bg-[#09060d] py-12 md:py-0" id="work" ref={workRef}>
      <div className="relative md:absolute top-0 md:top-[15vh] left-0 md:left-[5vw] z-10 w-full md:w-[20vw] px-6 md:px-0 mb-8 md:mb-0">
        <h2 className="font-anton text-5xl md:text-8xl font-normal leading-none tracking-wider text-white uppercase m-0">
          MY
          <br />
          <span className="text-[#c697ff]">WORK</span>
        </h2>
      </div>
      
      <div className="w-full md:ml-[25vw] md:w-[75vw] h-auto md:h-full md:overflow-hidden">
        <div className="work-flex-alt">
        {displayProjects.map((project, index) => {
          const num = (index + 1).toString().padStart(2, "0");
          const isEven = index % 2 === 0;

          return (
            <div key={project.id} className="work-column-alt">
              {isEven ? (
                <div className="work-content-even glass-card" style={{ padding: "20px" }}>
                  <div className="work-text-block">
                    <div className="work-header-row">
                      <span className="work-num">{num}</span>
                      <div className="work-title-group">
                        <h4 className="work-title">{project.title}</h4>
                        <span className="work-cat">{project.category}</span>
                      </div>
                    </div>
                    <div className="work-tools">
                      <span className="tools-label">Tools and features</span>
                      <p className="tools-list">{project.technologies}</p>
                    </div>
                  </div>
                  <div className="work-img-wrapper" style={{ borderRadius: "12px", overflow: "hidden" }}>
                    <img src={project.image} alt={project.title} loading="lazy" />
                  </div>
                </div>
              ) : (
                <div className="work-content-odd glass-card" style={{ padding: "20px" }}>
                  <div className="work-img-wrapper" style={{ borderRadius: "12px", overflow: "hidden" }}>
                    <img src={project.image} alt={project.title} loading="lazy" />
                  </div>
                  <div className="work-text-block">
                    <div className="work-header-row">
                      <span className="work-num">{num}</span>
                      <div className="work-title-group">
                        <h4 className="work-title">{project.title}</h4>
                        <span className="work-cat">{project.category}</span>
                      </div>
                    </div>
                    <div className="work-tools">
                      <span className="tools-label">Tools and features</span>
                      <p className="tools-list">{project.technologies}</p>
                    </div>
                  </div>
                </div>
              )}
              {index < displayProjects.length - 1 && (
                <div className="work-vert-divider"></div>
              )}
            </div>
          );
        })}
        
        </div>
      </div>
    </div>
  );
};

export default WorkHorizontal;
