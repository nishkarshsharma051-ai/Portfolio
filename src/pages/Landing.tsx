import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Home from "./Home";

// ─── Cloth config ──────────────────────────────────────────────────────────
const CLOTH_COLOR    = "#e8e2d9";   // solid warm linen
let GRAVITY          = 1200.0;       // original heavy fluid gravity
const DAMPING        = 0.99;
const MOUSE_PULL_R   = 20;           // fluid pull radius
const MOUSE_CUT_R    = 55;           // MASSIVE cut radius for right-click tearing
const TEAR_DIST      = 60;           // tears when stretched too far
const SPACING        = 32;           // High-performance smooth fluid mesh spacing
const ACCURACY       = 3;            // bouncy/stretchy pushmatrix feel

const TD2 = TEAR_DIST * TEAR_DIST;

// ─── Physics ───────────────────────────────────────────────────────────────
class Constraint {
  p1: Point; p2: Point; len: number;
  constructor(p1: Point, p2: Point) { this.p1 = p1; this.p2 = p2; this.len = SPACING; }
  resolve() {
    const dx = this.p1.x - this.p2.x, dy = this.p1.y - this.p2.y;
    const d  = Math.sqrt(dx * dx + dy * dy);
    if (d > TEAR_DIST) { this.p1.remove(this); return; }
    const f  = (this.len - d) / d * 0.5;
    if (!this.p1.pinned) { this.p1.x += dx * f; this.p1.y += dy * f; }
    if (!this.p2.pinned) { this.p2.x -= dx * f; this.p2.y -= dy * f; }
  }
}

class Point {
  x: number; y: number; px: number; py: number; vy: number;
  pinned: boolean; pinX: number; pinY: number;
  c: Constraint[];
  constructor(x: number, y: number) {
    this.x = x; this.y = y; this.px = x; this.py = y; this.vy = 0;
    this.pinned = false; this.pinX = 0; this.pinY = 0; this.c = [];
  }
  pin(x: number, y: number) { this.pinned = true; this.pinX = x; this.pinY = y; }
  link(p: Point) { this.c.push(new Constraint(this, p)); }
  remove(c: Constraint) { const i = this.c.indexOf(c); if (i > -1) this.c.splice(i, 1); }
  step(mx: number, my: number, pmx: number, pmy: number, down: boolean, cut: boolean) {
    if (this.pinned) { this.x = this.pinX; this.y = this.pinY; return; }
    if (down) {
      const dx = this.x - mx, dy = this.y - my, d2 = dx * dx + dy * dy;
      if (!cut && d2 < MOUSE_PULL_R * MOUSE_PULL_R) {
        this.px = this.x - (mx - pmx) * 1.8;
        this.py = this.y - (my - pmy) * 1.8;
      } else if (cut && d2 < MOUSE_CUT_R * MOUSE_CUT_R) {
        this.c = [];
      }
    }
    this.vy += GRAVITY;
    const nx = this.x + (this.x - this.px) * DAMPING;
    const ny = this.y + (this.y - this.py) * DAMPING + this.vy * 0.5 * 0.000256;
    this.px = this.x; this.py = this.y; this.x = nx; this.y = ny; this.vy = 0;
  }
  resolve() {
    if (this.pinned) { this.x = this.pinX; this.y = this.pinY; return; }
    for (let i = this.c.length - 1; i >= 0; i--) this.c[i].resolve();
  }
}

class Cloth {
  pts: Point[]; cols: number; rows: number; total: number;
  constructor(W: number, H: number) {
    // Hang like a curtain: exactly screen width, slightly taller than screen so it reaches bottom when sagging
    this.cols = Math.ceil(W / SPACING);
    this.rows = Math.ceil(H / SPACING) + 2;
    this.pts  = [];

    const startX = (W - this.cols * SPACING) / 2; // center horizontally
    const startY = 0;

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const px = startX + x * SPACING;
        const py = startY + y * SPACING;
        const p  = new Point(px, py);

        // ── Pin all 4 edges so it attaches to the bottom fully ──
        if (y === 0 || y === this.rows - 1 || x === 0 || x === this.cols - 1) {
          p.pin(px, py);
        }

        if (x > 0) p.link(this.pts[this.pts.length - 1]);
        if (y > 0) p.link(this.pts[x + (y - 1) * this.cols]);
        this.pts.push(p);
      }
    }
    this.total = this.pts.reduce((s, p) => s + p.c.length, 0);
  }
  fall() {
    for (const p of this.pts) p.pinned = false;
  }
  at(x: number, y: number) { return this.pts[y * this.cols + x]; }
  torn() {
    const rem = this.pts.reduce((s, p) => s + p.c.length, 0);
    return (this.total - rem) / this.total;
  }
  tick(mx: number, my: number, pmx: number, pmy: number, down: boolean, cut: boolean) {
    for (let i = 0; i < ACCURACY; i++)
      for (const p of this.pts) p.resolve();
    for (const p of this.pts) p.step(mx, my, pmx, pmy, down, cut);
  }
}

// ─── Component ─────────────────────────────────────────────────────────────
const Landing: React.FC = () => {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const wrapRef     = useRef<HTMLDivElement>(null);
  const barRef      = useRef<HTMLDivElement>(null);
  const uiRef       = useRef<HTMLDivElement>(null);
  const navigate    = useNavigate();

  useEffect(() => {
    GRAVITY = 1200.0; // Reset gravity to fluid heavy state
    const canvas = canvasRef.current, wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d")!;

    let cloth: Cloth | null = null;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      cloth = new Cloth(canvas.width, canvas.height);
    };
    resize();

    // Input
    let cut = false, down = false;
    let mx = 0, my = 0, pmx = 0, pmy = 0;
    let startX = 0, startY = 0, startTime = 0;
    let exiting = false;

    const xy = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const triggerExit = () => {
      if (exiting || !cloth) return;
      exiting = true;
      GRAVITY = 15000.0; // Overcome the tiny time-step multiplier to make it actually drop in <1s
      cloth.fall(); // Unpin all points so it drops
      // Fade out all UI (text, progress bar) immediately
      if (uiRef.current) {
        uiRef.current.style.transition = "opacity 0.3s ease";
        uiRef.current.style.opacity = "0";
      }
      // Give the cloth 1.5 seconds to physically fall off the bottom of the screen
      setTimeout(() => {
        const root = document.getElementById("landing-root");
        if (root) {
          root.style.position = "static";
          root.style.overflow = "visible";
        }
        const wrapper = document.getElementById("home-wrapper-in-landing");
        if (wrapper) {
          wrapper.style.position = "static";
          wrapper.style.overflow = "visible";
          wrapper.style.pointerEvents = "auto";
        }
        if (wrapRef.current) wrapRef.current.style.display = "none";
      }, 1500);
    };

    const md = (e: MouseEvent) => {
      const p = xy(e); cut = e.button !== 0;
      pmx = p.x; pmy = p.y; mx = p.x; my = p.y; down = true; 
      startX = p.x; startY = p.y; startTime = Date.now();
      e.preventDefault();
    };
    const mm = (e: MouseEvent) => { const p = xy(e); pmx = mx; pmy = my; mx = p.x; my = p.y; };
    const mu = () => { 
      down = false; 
      // Detect tap (distance moved < 10px and duration < 300ms)
      const dx = mx - startX, dy = my - startY;
      if (Math.sqrt(dx*dx + dy*dy) < 10 && Date.now() - startTime < 300) {
        triggerExit();
      }
    };
    const nc = (e: Event) => e.preventDefault();

    canvas.addEventListener("mousedown",   md);
    canvas.addEventListener("mousemove",   mm);
    window.addEventListener("mouseup",     mu);
    canvas.addEventListener("contextmenu", nc);

    const ts = (e: TouchEvent) => {
      const r = canvas.getBoundingClientRect(), t = e.touches[0];
      cut = true; mx = t.clientX - r.left; my = t.clientY - r.top;
      pmx = mx; pmy = my; down = true; 
      startX = mx; startY = my; startTime = Date.now();
      e.preventDefault();
    };
    const tm = (e: TouchEvent) => {
      const r = canvas.getBoundingClientRect(), t = e.touches[0];
      pmx = mx; pmy = my; mx = t.clientX - r.left; my = t.clientY - r.top; e.preventDefault();
    };
    const te = () => { 
      down = false; 
      const dx = mx - startX, dy = my - startY;
      if (Math.sqrt(dx*dx + dy*dy) < 15 && Date.now() - startTime < 300) {
        triggerExit();
      }
    };
    canvas.addEventListener("touchstart", ts, { passive: false });
    canvas.addEventListener("touchmove",  tm, { passive: false });
    window.addEventListener("touchend",   te);
    window.addEventListener("resize",     resize);

    let raf: number;

    const loop = () => {
      if (!cloth) { raf = requestAnimationFrame(loop); return; }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cloth.tick(mx, my, pmx, pmy, down, cut);

      const { cols, rows } = cloth;

      // Filled cloth — no thread lines, no boxes
      ctx.fillStyle = CLOTH_COLOR;

      for (let y = 0; y < rows - 1; y++) {
        for (let x = 0; x < cols - 1; x++) {
          const a = cloth.at(x,   y);
          const b = cloth.at(x+1, y);
          const c = cloth.at(x,   y+1);
          const d = cloth.at(x+1, y+1);

          // Check all 4 edges still intact
          const d1 = (a.x-b.x)**2 + (a.y-b.y)**2;
          const d2 = (a.x-c.x)**2 + (a.y-c.y)**2;
          const d3 = (b.x-d.x)**2 + (b.y-d.y)**2;
          const d4 = (c.x-d.x)**2 + (c.y-d.y)**2;

          if (d1 < TD2 && d2 < TD2 && d3 < TD2 && d4 < TD2) {
            // Expand each vertex slightly. Because it's transparent, 
            // the slight overlap will look like a woven fabric grid.
            const cx = (a.x + b.x + c.x + d.x) * 0.25;
            const cy = (a.y + b.y + c.y + d.y) * 0.25;
            const E = 0.5;
            const nx = (v: Point) => v.x + (v.x < cx ? -E : E);
            const ny = (v: Point) => v.y + (v.y < cy ? -E : E);

            ctx.beginPath();
            ctx.moveTo(nx(a), ny(a));
            ctx.lineTo(nx(b), ny(b));
            ctx.lineTo(nx(d), ny(d));
            ctx.lineTo(nx(c), ny(c));
            ctx.closePath();
            ctx.fillStyle = "#2a1f40"; // Dark elegant purple for the cloth
            ctx.fill();
          }
        }
      }

      // Draw text directly on the cloth!
      // 'source-atop' ensures the text only draws where the cloth quadrilaterals were just drawn.
      // So if there's a torn hole, the text won't render there!
      ctx.globalCompositeOperation = "source-atop";
      
      const W = canvas.width;
      const H = canvas.height;
      
      // Calculate how far the cloth has fallen by averaging the top row's vertical displacement.
      // This physically locks the text to the exact position of the fabric!
      let dropY = 0;
      if (cloth.pts.length > 0) {
        let sumDrop = 0;
        for (let x = 0; x < cloth.cols; x++) {
            sumDrop += (cloth.pts[x].y - cloth.pts[x].pinY);
        }
        dropY = sumDrop / cloth.cols;
      }

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Title
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      const titleSize = Math.max(32, Math.min(W * 0.05, 64)); 
      ctx.font = `800 ${titleSize}px Geist, sans-serif`;
      ctx.fillText("This is a tearable page.", W / 2, H / 2 - 20 + dropY);
      
      // Subtitle
      const subSize = Math.max(16, Math.min(W * 0.02, 19));
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = `500 ${subSize}px Geist, sans-serif`;
      ctx.fillText("To know about Nishkarsh Sharma, tear this.", W / 2, H / 2 + 30 + dropY);

      // Instructions
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.font = `500 11px Geist, sans-serif`;
      ctx.letterSpacing = "2px";
      ctx.fillText("LEFT-DRAG TO PULL  ·  RIGHT-DRAG TO CUT  ·  TAP TO ENTER", W / 2, H - 40 + dropY);
      ctx.letterSpacing = "0px"; // reset

      // Reset composite operation so the next frame's cloth draws normally
      ctx.globalCompositeOperation = "source-over";

      // Progress bar (fills as you tear)
      const ratio = cloth.torn();
      if (barRef.current && !exiting) {
        barRef.current.style.width = `${Math.min(ratio / 0.5, 1) * 100}%`;
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousedown",   md);
      canvas.removeEventListener("mousemove",   mm);
      window.removeEventListener("mouseup",     mu);
      canvas.removeEventListener("contextmenu", nc);
      canvas.removeEventListener("touchstart",  ts);
      canvas.removeEventListener("touchmove",   tm);
      window.removeEventListener("touchend",    te);
      window.removeEventListener("resize",      resize);
    };
  }, [navigate]);

  return (
    <div id="landing-root" style={{ position: "fixed", inset: 0, overflow: "hidden" }}>
      {/* Portfolio always rendered behind */}
      <div id="home-wrapper-in-landing" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <Home />
      </div>

      {/* Cloth overlay */}
      <div ref={wrapRef} style={{ position: "absolute", inset: 0, zIndex: 9999 }}>
        <canvas ref={canvasRef} style={{ display: "block", cursor: "crosshair" }} />
      </div>

      {/* The UI Overlay (Progress Bar) */}
      <div ref={uiRef} style={{
        position: "absolute", inset: 0, zIndex: 50000, pointerEvents: "none",
        display: "flex", flexDirection: "column", justifyContent: "flex-end"
      }}>
        {/* Bottom Progress Bar */}
        <div style={{ pointerEvents: "none" }}>
          <div style={{ height: 3, background: "rgba(255,255,255,0.05)", width: "100%" }}>
            <div ref={barRef} style={{
              height: "100%", width: "0%", background: "rgba(194, 164, 255, 0.8)",
              transition: "width 0.1s linear"
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
