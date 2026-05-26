import React, { useEffect, useRef } from "react";

export const InteractiveFigure: React.FC = () => {
  const figureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    const onMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      target.x = (event.clientX / innerWidth - 0.5) * 28;
      target.y = (event.clientY / innerHeight - 0.5) * 22;
    };

    const animate = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;

      figure.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) rotateY(${current.x * 0.5}deg) rotateX(${current.y * -0.45}deg)`;
      frame = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="interactive-figure" ref={figureRef} aria-hidden="true">
      <div className="interactive-figure-rim" />
      <div className="interactive-figure-stage">
        <div className="interactive-figure-head" />
        <div className="interactive-figure-torso" />
        <div className="interactive-figure-arm interactive-figure-arm-left" />
        <div className="interactive-figure-arm interactive-figure-arm-right" />
        <div className="interactive-figure-card interactive-figure-card-top" />
        <div className="interactive-figure-card interactive-figure-card-bottom" />
      </div>
    </div>
  );
};

export default InteractiveFigure;
