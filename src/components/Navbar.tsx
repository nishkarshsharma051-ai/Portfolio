import React, { useEffect } from "react";
import Lenis from "lenis";
import { config } from "./config";

export const HoverLink: React.FC<{ text: string; cursor?: string }> = ({ text, cursor }) => {
  return (
    <div className="hover-link" data-cursor={cursor || "disable"}>
      <div className="hover-in">
        {text}
        <div>{text}</div>
      </div>
    </div>
  );
};

export const Navbar: React.FC = () => {
  useEffect(() => {
    // Initialize Lenis scroll
    const lenis = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.7,
      touchMultiplier: 2,
    });

    lenis.stop(); // Stop scrolling during loading screen (we'll start it after loading completes)
    (window as any).lenis = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const onAnchorClick = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute("data-href");
      if (href && window.innerWidth > 1024) {
        e.preventDefault();
        const element = document.querySelector(href) as HTMLElement;
        if (element) {
          lenis.scrollTo(element, { offset: 0, duration: 1.5 });
        }
      }
    };

    const links = document.querySelectorAll(".header ul a");
    links.forEach((link) => {
      link.addEventListener("click", onAnchorClick as EventListener);
    });

    const handleResize = () => {
      lenis.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", onAnchorClick as EventListener);
      });
      window.removeEventListener("resize", handleResize);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          Nishkarsh
        </a>
        <a
          href={`mailto:${config.contact.email}`}
          className="navbar-connect"
          data-cursor="disable"
        >
          {config.contact.email}
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLink text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLink text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLink text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>
      <div className="landing-circle1" />
      <div className="landing-circle2" />
      <div className="nav-fade" />
    </>
  );
};
export default Navbar;
