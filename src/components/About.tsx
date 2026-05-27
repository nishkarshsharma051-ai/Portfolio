import React from "react";
import { motion } from "framer-motion";
import { config } from "./config";

const stats = [
  { value: "04+", label: "Years Exploring Code", color: "#c697ff" },
  { value: "10+", label: "Advanced Toolsets", color: "#c084fc" },
  { value: "07+", label: "AI & Full-Stack Apps", color: "#a78bfa" },
  { value: "100%", label: "Passion for Tech", color: "#ddd6fe" }
];

export const About: React.FC = () => {
  return (
    <div className="about-section relative py-20 md:py-28 overflow-hidden bg-[#09060d]" id="about">
      {/* Cinematic Blur Backdrop Blobs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none select-none" />

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

          {/* Right Column: Premium Biography Glass Card & Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-[60%] flex flex-col gap-8"
          >
            {/* The Main Biography Card */}
            <div className="glass-card p-8 md:p-10 border border-white/5 bg-white/[0.01] backdrop-blur-xl rounded-2xl flex flex-col gap-6" data-cursor="disable">
              <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                Hi! I'm {config.developer.fullName}
              </h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed font-roboto">
                {config.about.description}
              </p>
            </div>

            {/* Stats Grid using individual micro glass-cards */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="glass-card p-6 border border-white/5 bg-white/[0.02] backdrop-blur-xl rounded-xl flex flex-col gap-2 cursor-pointer"
                  data-cursor="disable"
                >
                  <span 
                    className="text-3xl md:text-4xl font-bold font-anton leading-none"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-xs md:text-sm font-semibold text-gray-400 tracking-wide font-roboto">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>

          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default About;
