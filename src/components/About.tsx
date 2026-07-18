import React from "react";
import { motion } from "framer-motion";
import { config } from "./config";

const stats = [
  { value: "04+", label: "Years Exploring Code", color: "#c697ff" },
  { value: "10+", label: "Advanced Toolsets", color: "#e0e0e0" },
  { value: "07+", label: "AI & Full-Stack Apps", color: "#a78bfa" },
  { value: "100%", label: "Passion for Tech", color: "#ddd6fe" }
];

export const About: React.FC = () => {
  return (
    <div className="about-section relative py-20 md:py-28 overflow-hidden bg-[#09060d]" id="about">
      {/* Cinematic Blur Backdrop Blobs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-white/10 blur-[120px] pointer-events-none select-none" />

      <div className="section-container w-full max-w-[1300px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-between">
          
          {/* Left Column: Heading & Graphic Accent */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-[35%] flex flex-col items-start gap-4"
          >
            <p className="font-roboto text-sm md:text-base text-[#c697ff] uppercase tracking-[0.2em] font-semibold">Get to know me</p>
            <h2 className="font-anton text-6xl md:text-8xl font-normal leading-none tracking-wider text-white uppercase m-0">
              ABOUT
              <br />
              <span className="text-[#c697ff]">ME</span>
            </h2>
            <div className="w-16 h-1 bg-[#c697ff] rounded-full mt-2" />
          </motion.div>

          {/* Right Column: Premium Biography (Borderless) & Stats Grid (Borderless) */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-[60%] flex flex-col gap-10"
          >
            {/* The Main Biography Description - Clean typography without the box outline */}
            <div className="flex flex-col gap-6" data-cursor="disable">
              <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wide font-sans">
                Hi! I'm {config.developer.fullName}
              </h3>
              <p className="text-base md:text-lg text-gray-300 leading-relaxed font-roboto">
                {config.about.description}
              </p>
            </div>

            {/* Stats Grid - Clean floating stats without borders/backgrounds */}
            <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
              {stats.map((stat, idx) => (
                <div 
                  key={idx}
                  className="flex flex-col gap-2"
                  data-cursor="disable"
                >
                  <span 
                    className="text-4xl md:text-5xl font-bold font-anton leading-none select-none"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-sm font-semibold text-gray-400 tracking-wide font-roboto">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default About;
