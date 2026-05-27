import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { config } from "./config";
import "../myworks.css";

export const WorkHorizontal: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev

  const projects = config.projects;

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const currentProject = projects[currentIndex];
  const num = (currentIndex + 1).toString().padStart(2, "0");

  const slideVariants: any = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      filter: "blur(5px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0,
      filter: "blur(5px)",
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div className="work-section-alt career-section relative min-h-screen bg-[#09060d] py-16 md:py-24 flex items-center" id="work">
      <div className="section-container w-full max-w-[1300px] mx-auto px-6 flex flex-col lg:flex-row gap-12 items-center justify-between">
        
        {/* Left Side: Header & Controls */}
        <div className="w-full lg:w-[35%] flex flex-col items-start gap-8">
          <div className="header-group">
            <h2 className="font-anton text-6xl md:text-8xl font-normal leading-none tracking-wider text-white uppercase m-0">
              MY
              <br />
              <span className="text-[#c697ff]">WORK</span>
            </h2>
            <p className="font-roboto text-sm md:text-base text-gray-400 mt-4 leading-relaxed max-w-[320px]">
              Exploring creative designs, complex full-stack apps, and intelligent AI models.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-6 mt-2">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white bg-white/5 hover:bg-white/10 hover:border-[#c697ff]/40 transition duration-300 cursor-pointer"
              aria-label="Previous Project"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white bg-white/5 hover:bg-white/10 hover:border-[#c697ff]/40 transition duration-300 cursor-pointer"
              aria-label="Next Project"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>

            {/* Pagination Numbers */}
            <span className="font-roboto text-sm text-gray-500 tracking-wider">
              <span className="text-white font-bold">{num}</span> / {projects.length.toString().padStart(2, "0")}
            </span>
          </div>

          {/* Pagination Indicators (Dots) */}
          <div className="flex items-center gap-2">
            {projects.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex ? "w-6 bg-[#c697ff]" : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Side: Active Project Card Slider */}
        <div className="w-full lg:w-[60%] flex items-center justify-center relative min-h-[550px] lg:min-h-[600px] overflow-hidden rounded-2xl">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="glass-card flex flex-col justify-between w-full max-w-[720px] p-10 md:p-16 gap-8 border border-white/5 bg-white/[0.02] backdrop-blur-xl rounded-2xl"
            >
              <div className="flex flex-col gap-6">
                {/* Header Row */}
                <div className="flex justify-between items-start w-full">
                  <span className="text-6xl md:text-8xl font-bold font-anton leading-none text-white/10 select-none">{num}</span>
                  <div className="text-right flex flex-col items-end">
                    <h4 className="text-2xl md:text-3.5xl font-bold text-white tracking-wide">{currentProject.title}</h4>
                    <span className="text-xs md:text-sm uppercase tracking-widest text-[#c697ff] mt-1 font-semibold">{currentProject.category}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-300 leading-relaxed font-roboto">
                  {currentProject.description}
                </p>

                {/* Tools */}
                <div className="flex flex-col gap-2 border-t border-white/5 pt-6">
                  <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Tools and features</span>
                  <p className="text-sm md:text-base text-gray-400 font-semibold leading-relaxed">{currentProject.technologies}</p>
                </div>
              </div>

              {/* Image Preview */}
              <div className="w-full h-[220px] md:h-[280px] flex items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-black/40">
                <img
                  src={currentProject.image}
                  alt={currentProject.title}
                  className="max-w-full max-h-full object-contain rounded-xl select-none"
                  loading="eager"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default WorkHorizontal;
