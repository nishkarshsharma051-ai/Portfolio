import React, { useEffect, useRef } from "react";
import { config } from "./config";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { applyCardTilt } from "../utils/animations";

gsap.registerPlugin(ScrollTrigger);

export const AboutAndSkills: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const aboutCardRef = useRef<HTMLDivElement>(null);
  const skillsContainerRef = useRef<HTMLDivElement>(null);
  const devCardRef = useRef<HTMLDivElement>(null);
  const fullStackCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=180%", // Shorter, tighter scroll distance to keep it punchy
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        }
      });

      // Stage 1: About Me card fades up
      tl.fromTo(aboutCardRef.current,
        { opacity: 0, y: 100, scale: 0.95, filter: "blur(12px)" },
        { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", ease: "power2.out", duration: 1 },
        0
      );

      // Stage 2: About Me card fades out AND Skills cards immediately start fading in (overlapping)
      tl.to(aboutCardRef.current, {
        opacity: 0,
        y: -80,
        scale: 0.92,
        filter: "blur(8px)",
        ease: "power2.inOut",
        duration: 1
      }, 1);

      // Stage 3: Skills cards fade in and slide horizontally concurrently
      tl.fromTo(devCardRef.current,
        { opacity: 0, x: -100, scale: 0.95, filter: "blur(12px)" },
        { opacity: 1, x: 0, scale: 1, filter: "blur(0px)", ease: "power2.out", duration: 1 },
        1.1 // Starts immediately as About Me card begins to exit
      );

      tl.fromTo(fullStackCardRef.current,
        { opacity: 0, x: 100, scale: 0.95, filter: "blur(12px)" },
        { opacity: 1, x: 0, scale: 1, filter: "blur(0px)", ease: "power2.out", duration: 1 },
        1.1 // Starts immediately as About Me card begins to exit
      );

      // Stage 4: Skills cards fade out and exit to allow smooth vertical release
      tl.to([devCardRef.current, fullStackCardRef.current], {
        opacity: 0,
        y: -40,
        filter: "blur(8px)",
        ease: "power1.in",
        duration: 0.8
      }, 2.2);

      // Apply gorgeous mouse tilt to all active cards
      if (aboutCardRef.current) applyCardTilt(aboutCardRef.current);
      if (devCardRef.current) applyCardTilt(devCardRef.current);
      if (fullStackCardRef.current) applyCardTilt(fullStackCardRef.current);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="h-screen w-full bg-[#09060d] relative flex items-center justify-center overflow-hidden"
      id="about"
    >
      {/* Background ambient halos */}
      <div className="absolute w-[800px] h-[800px] rounded-full pointer-events-none opacity-20 blur-[120px] bg-[radial-gradient(circle,_rgba(194,164,255,0.2)_0%,_rgba(0,0,0,0)_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />

      {/* STAGE 1: About Me Glass Card */}
      <div 
        ref={aboutCardRef}
        className="about-me glass-card absolute max-w-4xl px-8 py-10 z-10 w-[90vw] flex flex-col items-center justify-center text-center"
        data-cursor="disable"
      >
        <div className="about-me-border" />
        <h2 className="font-anton text-4xl md:text-6xl font-normal uppercase tracking-wider text-[#c084fc] mb-6">
          {config.about.title}
        </h2>
        {config.about.description.split('\n\n').map((paragraph, index) => (
          <p key={index} className="font-roboto text-gray-300 text-base md:text-xl leading-relaxed mb-6 font-light">
            {paragraph}
          </p>
        ))}
        <div className="card-arrow absolute bottom-4 right-4 text-white/40">↗</div>
      </div>

      {/* STAGE 2: Developer Skills Cards */}
      <div 
        ref={skillsContainerRef}
        className="absolute w-full max-w-6xl px-6 flex flex-col md:flex-row gap-8 items-center justify-center z-10"
        style={{ pointerEvents: "auto" }}
      >
        {/* Card 1: AI Developer */}
        <div 
          ref={devCardRef}
          className="what-content glass-card flex-1 w-full max-w-lg p-8 relative opacity-0"
          data-cursor="disable"
        >
          <div className="what-content-in">
            <h3 className="font-anton text-[#c084fc] text-sm md:text-base tracking-[0.2em] font-normal uppercase mb-2">
              {config.skills.develop.title}
            </h3>
            <h4 className="font-anton text-2xl md:text-3xl font-normal uppercase text-white mb-4">
              {config.skills.develop.description}
            </h4>
            <p className="font-roboto text-gray-400 text-sm leading-relaxed mb-6">
              {config.skills.develop.details}
            </p>
            <h5 className="font-roboto text-[#c084fc] font-bold text-xs uppercase tracking-[0.15em] mb-3">
              Core Toolsets
            </h5>
            <div className="what-content-flex flex wrap gap-2">
              {config.skills.develop.tools.map((tool, idx) => (
                <span className="what-tags" key={idx}>
                  {tool}
                </span>
              ))}
            </div>
            <div className="card-arrow absolute bottom-4 right-4 text-white/40">↗</div>
          </div>
        </div>

        {/* Card 2: Full-Stack Developer */}
        <div 
          ref={fullStackCardRef}
          className="what-content glass-card flex-1 w-full max-w-lg p-8 relative opacity-0"
          data-cursor="disable"
        >
          <div className="what-content-in">
            <h3 className="font-anton text-[#c084fc] text-sm md:text-base tracking-[0.2em] font-normal uppercase mb-2">
              {config.skills.design.title}
            </h3>
            <h4 className="font-anton text-2xl md:text-3xl font-normal uppercase text-white mb-4">
              {config.skills.design.description}
            </h4>
            <p className="font-roboto text-gray-400 text-sm leading-relaxed mb-6">
              {config.skills.design.details}
            </p>
            <h5 className="font-roboto text-[#c084fc] font-bold text-xs uppercase tracking-[0.15em] mb-3">
              Core Toolsets
            </h5>
            <div className="what-content-flex flex wrap gap-2">
              {config.skills.design.tools.map((tool, idx) => (
                <span className="what-tags" key={idx}>
                  {tool}
                </span>
              ))}
            </div>
            <div className="card-arrow absolute bottom-4 right-4 text-white/40">↗</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutAndSkills;
