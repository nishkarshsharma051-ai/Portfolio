import React, { useEffect, useRef } from "react";
import { config } from "./config";
import gsap from "gsap";

export const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entrance animations for texts
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-reveal",
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", stagger: 0.15 }
      );
      gsap.fromTo(
        ".hero-tag",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, delay: 0.6, ease: "back.out(1.7)", stagger: 0.1 }
      );
    }, containerRef);

    // Interactive constellation particles on canvas
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("2d");
    if (!gl) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000, active: false };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wall collisions
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Magnet attraction to cursor
        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 1500;
            this.x += (dx / dist) * force * 3;
            this.y += (dy / dist) * force * 3;
          }
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = "rgba(194, 164, 255, 0.6)";
        c.shadowBlur = 8;
        c.shadowColor = "#c2a4ff";
        c.fill();
        c.shadowBlur = 0; // reset shadow
      }
    }

    const initParticles = () => {
      const count = Math.min(Math.floor((width * height) / 12000), 100);
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    initParticles();

    const drawConstellations = () => {
      gl.clearRect(0, 0, width, height);

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(gl);

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const alpha = (100 - dist) / 100 * 0.15;
            gl.beginPath();
            gl.moveTo(particles[i].x, particles[i].y);
            gl.lineTo(particles[j].x, particles[j].y);
            gl.strokeStyle = `rgba(194, 164, 255, ${alpha})`;
            gl.lineWidth = 1;
            gl.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(drawConstellations);
    };

    drawConstellations();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, []);

  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <div className="landing-section" id="landingDiv" ref={containerRef}>
      <canvas className="landing-canvas" ref={canvasRef} />
      <div className="landing-container">
        <div className="landing-intro">
          <h2 className="hero-reveal">Hello! I'm</h2>
          <h1 className="hero-reveal">
            {firstName.toUpperCase()}{" "}
            {lastName && (
              <>
                <br />
                <span>{lastName.toUpperCase()}</span>
              </>
            )}
          </h1>
        </div>
        <div className="landing-info">
          <h3 className="hero-reveal">An</h3>
          <h2 className="hero-tag">AI Engineer</h2>
          <h2 className="hero-tag">Full-Stack Developer</h2>
        </div>
      </div>
    </div>
  );
};
export default Hero;
