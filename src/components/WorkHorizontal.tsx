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
    if (window.innerWidth <= 768) return;

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

      // Unified Timeline sharing a single ScrollTrigger to prevent double-spacer conflicts
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: workRef.current,
          start: "top top",
          pin: true,
          scrub: 1,
          end: () => `+=${Math.abs(getScrollAmount()) + 200}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // 1. Stage 1: Staggered card fade-up as pinning commences
      tl.fromTo(
        boxes,
        { opacity: 0, y: 80, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
        }
      );

      // 2. Stage 2: Horizontal scroll scrub
      tl.to(workFlex, {
        x: getScrollAmount,
        ease: "none",
        duration: 2, // Smooth scrub scroll duration
      });

      // Apply tilt to each card inner content
      const cards = workFlex.querySelectorAll<HTMLElement>(".work-content-even, .work-content-odd");
      cards.forEach(card => applyCardTilt(card));
    });

    // Force ScrollTrigger to refresh after 500ms to align correctly with Lenis smooth scroll
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      ctx.revert();
      clearTimeout(refreshTimeout);
    };
  }, []);

  const displayProjects = config.projects;

  return (
    <div className="work-section-horizontal" id="work" ref={workRef} style={{ position: "relative", height: "100vh", overflow: "hidden", backgroundColor: "#09060d" }}>
      {/* Pinned Masking Sidebar so cards slide elegantly *behind* the text */}
      <div 
        style={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          height: "100vh", 
          width: "25vw", 
          zIndex: 20, 
          display: "flex",
          alignItems: "center",
          paddingLeft: "5vw",
          background: "linear-gradient(90deg, #09060d 80%, rgba(9,6,13,0) 100%)",
          pointerEvents: "none"
        }}
      >
        <h2 style={{ fontSize: "5rem", fontWeight: 700, lineHeight: 1.1, margin: 0, letterSpacing: "0.05em", fontFamily: "var(--font-anton)" }}>
          MY
          <br />
          <span style={{ color: "#c697ff" }}>WORK</span>
        </h2>
      </div>
      
      <div style={{ marginLeft: "25vw", width: "75vw", height: "100%", overflow: "hidden", position: "relative", zIndex: 10 }}>
        <div className="work-flex-alt" style={{ paddingLeft: "2rem", paddingRight: "5vw" }}>
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
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      loading="lazy" 
                      onLoad={() => ScrollTrigger.refresh()}
                    />
                  </div>
                </div>
              ) : (
                <div className="work-content-odd glass-card" style={{ padding: "20px" }}>
                  <div className="work-img-wrapper" style={{ borderRadius: "12px", overflow: "hidden" }}>
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      loading="lazy" 
                      onLoad={() => ScrollTrigger.refresh()}
                    />
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
