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
    <div className="work-section-horizontal career-section relative min-h-screen lg:h-screen lg:overflow-hidden bg-[#09060d] py-12 lg:py-0" id="work" ref={workRef}>
      <div className="relative lg:absolute top-0 lg:top-[15vh] left-0 lg:left-[5vw] z-10 w-full lg:w-[20vw] px-6 lg:px-0 mb-8 lg:mb-0">
        <h2 className="font-anton text-5xl lg:text-8xl font-normal leading-none tracking-wider text-white uppercase m-0">
          MY
          <br />
          <span className="text-[#c697ff]">WORK</span>
        </h2>
      </div>
      
      <div className="w-full lg:ml-[25vw] lg:w-[75vw] h-auto lg:h-full lg:overflow-hidden px-6 lg:px-0 overflow-x-auto scrollbar-none" style={{ WebkitOverflowScrolling: "touch" }}>
        <div className="work-flex-alt flex flex-row lg:items-center lg:h-full gap-12 lg:gap-0 py-8 lg:py-0 w-max">
        {displayProjects.map((project, index) => {
          const num = (index + 1).toString().padStart(2, "0");
          const isEven = index % 2 === 0;

          return (
            <div key={project.id} className="work-column-alt flex flex-row lg:items-center lg:h-full w-auto">
              {isEven ? (
                <div className="work-content-even glass-card flex flex-col justify-between w-full lg:w-[45vw] lg:max-w-[500px] h-auto lg:h-[70vh] p-6 lg:p-10 gap-6 lg:gap-0">
                  <div className="work-text-block flex flex-col gap-4 lg:gap-8">
                    <div className="work-header-row flex justify-between items-start w-full">
                      <span className="work-num text-5xl lg:text-8xl font-bold leading-none text-white">{num}</span>
                      <div className="work-title-group text-right flex flex-col items-end">
                        <h4 className="work-title text-2xl lg:text-3xl font-semibold mb-2 text-white">{project.title}</h4>
                        <span className="work-cat text-sm lg:text-base text-gray-400">{project.category}</span>
                      </div>
                    </div>
                    <div className="work-tools flex flex-col gap-2">
                      <span className="tools-label text-lg lg:text-2xl font-semibold text-white">Tools and features</span>
                      <p className="tools-list text-sm lg:text-base text-gray-500 leading-relaxed">{project.technologies}</p>
                    </div>
                  </div>
                  <div className="work-img-wrapper w-full h-[220px] lg:h-[350px] flex items-center justify-center overflow-hidden rounded-xl mt-4 lg:mt-0">
                    <img src={project.image} alt={project.title} className="max-w-full max-h-full object-contain rounded-xl" loading="lazy" />
                  </div>
                </div>
              ) : (
                <div className="work-content-odd glass-card flex flex-col justify-between w-full lg:w-[45vw] lg:max-w-[500px] h-auto lg:h-[70vh] p-6 lg:p-10 gap-6 lg:gap-0">
                  <div className="work-img-wrapper w-full h-[220px] lg:h-[350px] flex items-center justify-center overflow-hidden rounded-xl mb-4 lg:mb-0">
                    <img src={project.image} alt={project.title} className="max-w-full max-h-full object-contain rounded-xl" loading="lazy" />
                  </div>
                  <div className="work-text-block flex flex-col gap-4 lg:gap-8">
                    <div className="work-header-row flex justify-between items-start w-full">
                      <span className="work-num text-5xl lg:text-8xl font-bold leading-none text-white">{num}</span>
                      <div className="work-title-group text-right flex flex-col items-end">
                        <h4 className="work-title text-2xl lg:text-3xl font-semibold mb-2 text-white">{project.title}</h4>
                        <span className="work-cat text-sm lg:text-base text-gray-400">{project.category}</span>
                      </div>
                    </div>
                    <div className="work-tools flex flex-col gap-2">
                      <span className="tools-label text-lg lg:text-2xl font-semibold text-white">Tools and features</span>
                      <p className="tools-list text-sm lg:text-base text-gray-500 leading-relaxed">{project.technologies}</p>
                    </div>
                  </div>
                </div>
              )}
              {index < displayProjects.length - 1 && (
                <div className="work-vert-divider w-full lg:w-[1px] h-[1px] lg:h-[60vh] bg-white/10 my-8 lg:my-0 lg:mx-8"></div>
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
