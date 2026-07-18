import React, { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { config } from "../components/config";
import "../myworks.css";
import { useNavigate } from "react-router-dom";
import Cursor from "../components/Cursor";

gsap.registerPlugin(ScrollTrigger);

export const MyWorks: React.FC = () => {
  const navigate = useNavigate();
  const workRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (window.innerWidth <= 768) return;

    const workFlex = workRef.current?.querySelector(".work-flex-alt");
    if (!workFlex) return;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => {
        const parentWidth = workFlex.parentElement?.offsetWidth || window.innerWidth;
        return -(workFlex.scrollWidth - parentWidth);
      };

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
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="reference-page">
      <Cursor />
      <div className="work-section-horizontal career-section myworks-main-container" id="work" ref={workRef}>
        <div className="myworks-title-sidebar">
          <h2 className="myworks-title-text" onClick={() => navigate("/")}>
            MY
            <br />
            <span style={{ color: "#e0e0e0" }}>WORK</span>
          </h2>
        </div>
        
        <div className="myworks-slider-wrapper">
          <div className="work-flex-alt">
            {config.projects.map((project, index) => {
              const num = (index + 1).toString().padStart(2, "0");
              const isEven = index % 2 === 0;

              return (
                <div key={project.id} className="work-column-alt">
                  {isEven ? (
                    <div className="work-content-even">
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
                      <div className="work-img-wrapper">
                        <img src={project.image} alt={project.title} loading="lazy" />
                      </div>
                    </div>
                  ) : (
                    <div className="work-content-odd">
                      <div className="work-img-wrapper">
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
                  {index < config.projects.length - 1 && (
                    <div className="work-vert-divider"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyWorks;
