import React from "react";
import { motion } from "framer-motion";
import { config } from "./config";
import { useNavigate } from "react-router-dom";

export const Contact: React.FC = () => {
  const navigate = useNavigate();

  const handleTalkClick = () => {
    navigate("/play");
  };

  const socials = [
    { name: "GITHUB", url: config.social.github ? `https://github.com/${config.social.github}` : config.contact.github, desc: "Explore Open Source Code", color: "#c697ff" },
    { name: "LINKEDIN", url: config.contact.linkedin, desc: "Connect Professionally", color: "#c084fc" },
    { name: "TWITTER", url: config.contact.twitter, desc: "See Tech Thoughts", color: "#a78bfa" },
    { name: "INSTAGRAM", url: config.contact.instagram, desc: "Behind the Scenes", color: "#ddd6fe" }
  ];

  return (
    <div className="contact-section relative py-20 md:py-28 overflow-hidden bg-[#09060d]" id="contact">
      {/* Cinematic backdrop glow */}
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none select-none" />

      <div className="contact-container w-full max-w-[1300px] mx-auto px-6 flex flex-col gap-16">
        
        {/* Large Cinematic Header - Borderless but beautifully aligned */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 w-full border-b border-white/5 pb-12"
        >
          <div className="flex flex-col items-start gap-4">
            <p className="font-roboto text-xs md:text-sm text-[#c697ff] uppercase tracking-[0.2em] font-semibold">Have a concept?</p>
            <h3 className="font-anton text-5xl md:text-7xl font-normal leading-none tracking-wider text-white uppercase m-0">
              WANT TO BUILD
              <br />
              <span className="text-[#c697ff]">SOMETHING COOL?</span>
            </h3>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <button 
              className="contact-cta-btn px-12 py-5 rounded-full border border-[#c697ff]/40 bg-[#c697ff]/10 hover:bg-[#c697ff]/20 text-white font-bold text-sm tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(198,151,255,0.15)] hover:shadow-[0_0_25px_rgba(198,151,255,0.3)] hover:scale-105 cursor-pointer flex items-center justify-center gap-3"
              onClick={handleTalkClick} 
              data-cursor="disable"
            >
              <span className="text-base">💬</span> <span className="leading-none">TALK WITH ME</span>
            </button>
            <a 
              className="contact-cta-btn px-12 py-5 rounded-full bg-white hover:bg-[#c697ff] text-black hover:text-white font-bold text-sm tracking-wider transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
              href={`mailto:${config.contact.email}`} 
              data-cursor="disable"
            >
              <span className="text-base">✉️</span> <span className="leading-none">HIRE ME</span>
            </a>
          </div>
        </motion.div>

        {/* Lower Links Row - Borderless */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 w-full">
          
          {/* Connection Channels column */}
          <div className="flex flex-col w-full lg:w-[50%] gap-8">
            <div className="flex flex-col gap-2">
              <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Email Address</h4>
              <p>
                <a 
                  href={`mailto:${config.contact.email}`} 
                  data-cursor="disable" 
                  className="text-xl md:text-2xl font-semibold text-white hover:text-[#c697ff] transition duration-300"
                >
                  {config.contact.email}
                </a>
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Social Channels</h4>
              <div className="grid grid-cols-2 gap-6">
                {socials.map((social, idx) => (
                  <a 
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="disable"
                    className="flex flex-col gap-1 hover:translate-x-1 transition duration-300"
                  >
                    <span className="text-sm font-bold text-white tracking-wide" style={{ color: social.color }}>
                      {social.name}
                    </span>
                    <span className="text-xs text-gray-400 font-roboto">
                      {social.desc}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright column */}
          <div className="flex flex-col justify-end items-start lg:items-end text-left lg:text-right w-full lg:w-[40%] gap-4">
            <h2 className="font-anton text-4xl md:text-6xl font-normal leading-none tracking-wider text-white uppercase m-0 select-none">
              NISHKARSH
              <br />
              <span className="text-[#c697ff]">SHARMA</span>
            </h2>
            <p className="text-xs md:text-sm text-gray-500 font-semibold tracking-wide font-roboto">
              Designed & Coded with passion © {new Date().getFullYear()}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
