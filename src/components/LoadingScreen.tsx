import React, { useState, useEffect, useRef } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);
  const [complete, setComplete] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [transitionDone, setTransitionDone] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Progressive percent loading simulator
    let count = 0;
    const interval = setInterval(() => {
      if (count < 60) {
        count += Math.floor(Math.random() * 8) + 2;
        setPercent(Math.min(count, 100));
      } else if (count < 92) {
        count += Math.floor(Math.random() * 3) + 1;
        setPercent(Math.min(count, 100));
      } else {
        clearInterval(interval);
        const fineTune = setInterval(() => {
          if (count < 100) {
            count += 1;
            setPercent(count);
          } else {
            clearInterval(fineTune);
            setTimeout(() => {
              setComplete(true);
            }, 500);
          }
        }, 80);
      }
    }, 60);

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const rect = wrap.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    wrap.style.setProperty("--mouse-x", `${x}px`);
    wrap.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleWelcomeClick = () => {
    setClicked(true);
    setTimeout(() => {
      setTransitionDone(true);
      onComplete();
    }, 1200); // Duration matches screen clean transition time
  };

  if (transitionDone) return null;

  return (
    <div className={`loading-screen ${clicked ? "loading-out" : ""}`} style={{ opacity: clicked ? 0 : 1, transition: "opacity 0.9s ease-in-out" }}>
      {/* Header bar during load */}
      <div className="loading-header">
        <span className="loader-title" data-cursor="disable">
          Portfolio
        </span>
        <div className={`loaderGame ${clicked ? "loader-out" : ""}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {Array.from({ length: 27 }).map((_, i) => (
                <div className="loaderGame-line" key={i} />
              ))}
            </div>
            <div className="loaderGame-ball" />
          </div>
        </div>
      </div>

      {/* Marquee Background elements */}
      <div className="loading-marquee">
        <div style={{ display: "flex", whiteSpace: "nowrap", width: "max-content", animation: "loaderGame 20s linear infinite" }}>
          <span> AI Engineer • Full-Stack Developer • Data Scientist </span>
          <span> AI Engineer • Full-Stack Developer • Data Scientist </span>
          <span> AI Engineer • Full-Stack Developer • Data Scientist </span>
        </div>
      </div>

      {/* Interactive Welcoming button and mouse glow tracker */}
      <div
        className={`loading-wrap ${clicked ? "loading-clicked" : ""}`}
        ref={wrapRef}
        onMouseMove={handleMouseMove}
        style={{
          width: clicked ? "calc(100vw + 1000px)" : "auto",
          height: clicked ? "calc(100vh + 1000px)" : "auto",
          borderRadius: clicked ? "0" : "100px",
        }}
      >
        <div className="loading-hover" />
        <button
          className={`loading-button ${complete ? "loading-complete" : ""}`}
          onClick={complete ? handleWelcomeClick : undefined}
          data-cursor="disable"
          style={{ cursor: complete ? "pointer" : "default" }}
        >
          {!complete ? (
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  Loading <span>{percent}%</span>
                </div>
              </div>
              <div className="loading-box" />
            </div>
          ) : (
            <div className="loading-content2" style={{ opacity: clicked ? 0 : 1 }}>
              <span>Welcome</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
export default LoadingScreen;
