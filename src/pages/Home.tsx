import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Cursor from "../components/Cursor";
import About from "../components/About";
import Skills from "../components/Skills";
import Experience from "../components/Experience";
import WorkHorizontal from "../components/WorkHorizontal";
import Contact from "../components/Contact";
import TechStack from "../components/TechStack";
import { config } from "../components/config";

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  {
    label: "GitHub",
    href: config.contact.github,
    icon: (
      <svg viewBox="0 0 496 512" aria-hidden="true">
        <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zM134.8 392.9c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2 .7-2-1.3-4.3-4.3-5.2-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: config.contact.linkedin,
    icon: (
      <svg viewBox="0 0 448 512" aria-hidden="true">
        <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: config.contact.twitter,
    icon: (
      <svg viewBox="0 0 512 512" aria-hidden="true">
        <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: config.contact.instagram,
    icon: (
      <svg viewBox="0 0 448 512" aria-hidden="true">
        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
      </svg>
    ),
  },
];

export const Home: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Cinematic loading sequence
      const entryTl = gsap.timeline();

      // 1. Background blobs flare up
      entryTl.fromTo(
        ".reference-backdrop",
        { scale: 0.6, opacity: 0, filter: "blur(200px)" },
        { scale: 1, opacity: 1, filter: "blur(140px)", duration: 2, ease: "power3.out" },
        0
      );

      // 2. Main title elements rise up with scale and blur fade
      entryTl.fromTo(
        ".reference-hero-left > *",
        { y: 80, opacity: 0, filter: "blur(15px)", scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: 1.8,
          stagger: 0.18,
          ease: "power4.out",
        },
        0.2
      );

      // 3. UI rails and navigation slide in gracefully
      entryTl.fromTo(
        ".reference-topbar, .reference-social-rail, .reference-resume-rail",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.08, ease: "power3.out" },
        0.8
      );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".reference-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        })
        .to(".reference-hero-left", { y: "20%", opacity: 0.18 }, 0)
        .to(".reference-hero-right", { y: "20%", opacity: 0.18 }, 0)
        .to(".reference-backdrop", { opacity: 0.45 }, 0);

      gsap.to(".reference-social-rail, .reference-resume-rail", {
        scrollTrigger: {
          trigger: ".contact-section",
          start: "top 85%",
          end: "top 40%",
          scrub: true,
        },
        opacity: 0,
        pointerEvents: "none",
      });

      ScrollTrigger.refresh();
    }, page);

    return () => ctx.revert();
  }, []);

  return (
    <div className="reference-page" ref={pageRef}>
      <Cursor />
      <div className="reference-backdrop reference-backdrop-left" />
      <div className="reference-backdrop reference-backdrop-right" />
      <div className="reference-noise" />

      <header className="reference-topbar">
        <a href="/#" className="reference-logo" data-cursor="disable">
          Logo
        </a>

        <a href={`mailto:${config.contact.email}`} className="reference-email" data-cursor="disable">
          {config.contact.email}
        </a>

        <nav className="reference-nav" aria-label="Primary">
          <a href="#about" data-cursor="disable">
            About
          </a>
          <a href="#work" data-cursor="disable">
            Work
          </a>
          <a href="#contact" data-cursor="disable">
            Contact
          </a>
        </nav>
      </header>

      <aside className="reference-social-rail">
        {socialLinks.map((item) => (
          <a key={item.label} href={item.href} target="_blank" rel="noreferrer" data-cursor="disable" aria-label={item.label}>
            {item.icon}
          </a>
        ))}
      </aside>

      <a className="reference-resume-rail" href="#contact" data-cursor="disable">
        Resume
      </a>

      <main className="reference-main">
        <section className="reference-hero">
          <div className="reference-hero-left" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <p>Hello! I&apos;m</p>
            <h1>
              {config.developer.fullName.split(" ")[0].toUpperCase()}
              <br />
              {config.developer.fullName
                .split(" ")
                .slice(1)
                .join(" ")
                .toUpperCase()}
            </h1>

            <div style={{ marginTop: "40px" }}>
              <p>An</p>
              <h2>AI ENGINEER</h2>
              <h3>FULL-STACK DEVELOPER</h3>
            </div>
          </div>

          <div className="reference-hero-right">
            {/* Right side empty as requested for future additions */}
          </div>
        </section>

        <About />
        <Skills />
        <Experience />
        <WorkHorizontal />
        <TechStack />
        <Contact />
      </main>
    </div>
  );
};

export default Home;