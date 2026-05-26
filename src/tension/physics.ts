// physics.ts – initializes the tearable cloth UI using Matter.js
// Adapted from the original repo's script.js

import { Engine, Render, Runner, Composites, Composite, Bodies, Body, Vector, Mouse, MouseConstraint, Events } from 'matter-js';

// Exported initializer – receives a container element where the canvas and UI will be rendered
export function initTension(root: HTMLElement) {
  // 1. Engine & World setup
  const engine = Engine.create();
  const world = engine.world;

  // 2. Renderer – attach to the provided container element
  const render = Render.create({
    element: root,
    engine: engine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      background: 'transparent',
      wireframes: false,
      showAngleIndicator: false,
    },
  });

  // Start rendering and the runner
  Render.run(render);
  const runner = Runner.create();
  Runner.run(runner, engine);

  // 3. Global variables mirroring the original script
  let cloth: any = null;
  let activeStart: { x: number; y: number } | null = null;
  let activeEnd: { x: number; y: number } | null = null;
  let currentGap = 25;
  // Tracking tear progress
  let totalConstraints = 0;
  let brokenCount = 0;
  let tornDispatched = false;
  const particleOptions = { friction: 0.00001, render: { visible: false } };
  const constraintOptions = { stiffness: 0.3, damping: 0.1, render: { type: 'line', strokeStyle: '#2ecc71', lineWidth: 1 } };

  // UI elements (they already exist in the DOM from Landing.tsx)
  const densitySlider = document.getElementById('densitySlider') as HTMLInputElement;
  const drawBtn = document.getElementById('drawBtn') as HTMLButtonElement;
  const regenBtn = document.getElementById('regenBtn') as HTMLButtonElement;
  const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;
  const collisionToggle = document.getElementById('collisionToggle') as HTMLInputElement;
  const windToggle = document.getElementById('windToggle') as HTMLInputElement;
  const strengthSlider = document.getElementById('strengthSlider') as HTMLInputElement;
  const speedSlider = document.getElementById('speedSlider') as HTMLInputElement;
  const tearSlider = document.getElementById('tearSlider') as HTMLInputElement;
  const windControl = document.getElementById('windControl') as HTMLElement;
  const windDot = document.getElementById('windDot') as HTMLElement;

  // Helper to (re)create the cloth
  function createCloth(startPoint: { x: number; y: number } | null, endPoint: { x: number; y: number } | null) {
    if (cloth) Composite.remove(world, cloth);
    activeStart = startPoint;
    activeEnd = endPoint;

    // Update spacing based on density slider
    const densityVal = parseInt(densitySlider?.value ?? '35');
    currentGap = 60 - densityVal;

    let cols: number, rows: number, x: number, y: number, angle: number;
    if (startPoint && endPoint) {
      const dx = endPoint.x - startPoint.x;
      const dy = endPoint.y - startPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      cols = Math.max(2, Math.floor(distance / currentGap));
      rows = cols;
      x = startPoint.x + dx / 2;
      y = startPoint.y + dy / 2;
      angle = Math.atan2(dy, dx);
    } else {
      const targetSize = 500;
      cols = Math.floor(targetSize / currentGap);
      rows = Math.floor((targetSize * 0.75) / currentGap);
      // const totalWidth = (cols - 1) * currentGap; // unused
      const totalHeight = (rows - 1) * currentGap;
      x = window.innerWidth / 2;
      y = window.innerHeight / 2 - totalHeight / 2;
      angle = 0;
    }

    const stackX = -((cols - 1) * currentGap) / 2;
    const stackY = 0;
    cloth = Composites.stack(stackX, stackY, cols, rows, currentGap, currentGap, function (px: number, py: number) {
      return Bodies.circle(px, py, 5, particleOptions);
    });
    Composites.mesh(cloth, cols, rows, false, constraintOptions);
    Composite.translate(cloth, { x, y });
    if (angle !== 0) Composite.rotate(cloth, angle, { x, y });

    // Pin the top row
    for (let i = 0; i < cols; i++) {
      Body.setStatic(cloth.bodies[i], true);
    }
    Composite.add(world, cloth);
    // Record total number of constraints for tear detection
    totalConstraints = Composite.allConstraints(cloth).length;
    brokenCount = 0;
    tornDispatched = false;
  }

  // Initial cloth creation
  createCloth(null, null);

  // Mouse handling
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: { stiffness: 0.2, render: { visible: false } },
  });
  Composite.add(world, mouseConstraint);
  render.mouse = mouse;

  // Interaction state
  let isDrawing = false;
  let drawStart: { x: number; y: number } | null = null;
  let drawCurrent: { x: number; y: number } | null = null;
  let interactionBody: any = null;
  const interactionRadius = 30;
  let isSolidMode = false;
  let isWindOn = false;
  let windAngle = 0;
  let isDraggingWind = false;

  // UI listeners (mirroring original script)
  collisionToggle?.addEventListener('change', (e: Event) => {
    const target = e.target as HTMLInputElement;
    isSolidMode = target.checked;
  });

  drawBtn?.addEventListener('click', () => {
    isDrawing = !isDrawing;
    if (isDrawing) {
      drawBtn.classList.add('active');
      document.body.classList.add('drawing-mode');
      drawBtn.querySelector('span')!.textContent = '✖';
      Composite.remove(world, mouseConstraint);
    } else {
      cancelDraw();
    }
  });

  function cancelDraw() {
    isDrawing = false;
    drawStart = null;
    drawCurrent = null;
    drawBtn.classList.remove('active');
    document.body.classList.remove('drawing-mode');
    drawBtn.querySelector('span')!.textContent = '✎';
    Composite.add(world, mouseConstraint);
  }

  regenBtn?.addEventListener('click', () => createCloth(activeStart, activeEnd));
  resetBtn?.addEventListener('click', () => createCloth(null, null));
  densitySlider?.addEventListener('change', () => createCloth(activeStart, activeEnd));
  windToggle?.addEventListener('change', (e: Event) => {
    const target = e.target as HTMLInputElement;
    isWindOn = target.checked;
  });

  // Wind UI handling
  function updateWindDirection(e: MouseEvent) {
    const rect = windControl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    windAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const radius = 24;
    const dotX = Math.cos(windAngle) * radius;
    const dotY = Math.sin(windAngle) * radius;
    windDot.style.transform = `translate(calc(-50% + ${dotX}px), calc(-50% + ${dotY}px))`;
  }
  windControl?.addEventListener('mousedown', (e) => {
    isDraggingWind = true;
    updateWindDirection(e);
  });
  window.addEventListener('mousemove', (e) => {
    if (isDraggingWind) updateWindDirection(e);
  });
  window.addEventListener('mouseup', () => {
    isDraggingWind = false;
  });

  // Slider UI helper (mirrors original script)
  function updateSliderUI(slider: HTMLInputElement) {
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const standardVal = parseFloat(slider.defaultValue);
    let currentVal = parseFloat(slider.value);
    const range = max - min;
    const snapZone = range * 0.04;
    if (Math.abs(currentVal - standardVal) < snapZone) {
      currentVal = standardVal;
      slider.value = standardVal.toString();
    }
    const progressPct = ((currentVal - min) / range) * 100;
    const defaultPct = ((standardVal - min) / range) * 100;
    slider.style.setProperty('--progress', `${progressPct}%`);
    slider.style.setProperty('--default-pos', `${defaultPct}%`);
    const displayId = slider.getAttribute('data-display');
    if (displayId) {
      const displayEl = document.getElementById(displayId);
      if (displayEl) {
        if (slider.step && slider.step.includes('.')) {
          displayEl.textContent = currentVal.toFixed(1);
        } else {
          displayEl.textContent = currentVal.toString();
        }
      }
    }
  }
  document.querySelectorAll('.progress-slider').forEach((s) => {
    const slider = s as HTMLInputElement;
    updateSliderUI(slider);
    slider.addEventListener('input', () => updateSliderUI(slider));
  });

  // Canvas mouse events for drawing / interaction
  render.canvas.addEventListener('mousedown', (e: MouseEvent) => {
    const rect = render.canvas.getBoundingClientRect();
    const mX = e.clientX - rect.left;
    const mY = e.clientY - rect.top;
    if (isDrawing) {
      drawStart = { x: mX, y: mY };
      return;
    }
    if (e.button === 0) {
      interactionBody = Bodies.circle(mX, mY, interactionRadius, { isStatic: true, render: { visible: false } });
      Composite.add(world, interactionBody);
    }
  });

  render.canvas.addEventListener('mousemove', (e: MouseEvent) => {
    const rect = render.canvas.getBoundingClientRect();
    const mX = e.clientX - rect.left;
    const mY = e.clientY - rect.top;
    if (isDrawing && drawStart) {
      drawCurrent = { x: mX, y: mY };
    }
    if (interactionBody) {
      if (isSolidMode) {
        const vX = mX - interactionBody.position.x;
        const vY = mY - interactionBody.position.y;
        Body.setVelocity(interactionBody, { x: vX, y: vY });
        Body.setPosition(interactionBody, { x: mX, y: mY });
      } else {
        Body.setPosition(interactionBody, { x: mX, y: mY });
      }
    }
  });

  window.addEventListener('mouseup', (e: MouseEvent) => {
    if (isDrawing && drawStart) {
      const rect = render.canvas.getBoundingClientRect();
      const drawEnd = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      createCloth(drawStart, drawEnd);
      cancelDraw();
    }
    if (interactionBody) {
      Composite.remove(world, interactionBody);
      interactionBody = null;
    }
  });

  // Main physics update – tearing, wind, constraint breaking
  const cutRadius = 15;
  Events.on(engine, 'afterUpdate', () => {
    if (!cloth) return;
    const constraints = Composite.allConstraints(cloth);
    const bodies = Composite.allBodies(cloth);
    const mousePosition = mouse.position;
    const isRightClick = mouse.button === 2;
    const time = engine.timing.timestamp;
    const tearMultiplier = parseFloat(tearSlider?.value ?? '5');
    const tearDistance = currentGap * tearMultiplier;

    // Wind
    if (isWindOn) {
      const strengthVal = (parseFloat(strengthSlider?.value ?? '20') * 0.000001);
      const speedVal = (parseFloat(speedSlider?.value ?? '10') * 0.0002);
      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        if (body.isStatic) continue;
        const wavePhase = body.position.x * 0.002 + body.position.y * 0.002;
        const windStrength = Math.sin(time * speedVal + wavePhase) * strengthVal + strengthVal;
        Body.applyForce(body, body.position, {
          x: windStrength * Math.cos(windAngle),
          y: windStrength * Math.sin(windAngle),
        });
      }
    }

    // Constraint breaking & mouse cutting
    for (let i = constraints.length - 1; i >= 0; i--) {
      const constraint = constraints[i];
      const { bodyA, bodyB } = constraint;
      const currentDist = Vector.magnitude(Vector.sub(bodyA.position, bodyB.position));

      // Mouse cut (if not right‑click or drawing)
      if (!isRightClick && !isDrawing && !interactionBody) {
        const midX = (bodyA.position.x + bodyB.position.x) / 2;
        const midY = (bodyA.position.y + bodyB.position.y) / 2;
        const distMouse = Vector.magnitude({ x: mousePosition.x - midX, y: mousePosition.y - midY });
        if (distMouse < cutRadius) {
          Composite.remove(cloth, constraint);
          brokenCount++;
          continue;
        }
      }

      // Break if stretched beyond limit
      if (currentDist > tearDistance) {
        Composite.remove(cloth, constraint);
        brokenCount++;
      }
    }
    // Dispatch clothTorn event when a large portion is broken
    if (!tornDispatched && totalConstraints > 0 && brokenCount / totalConstraints >= 0.8) {
      root.dispatchEvent(new CustomEvent('clothTorn'));
      tornDispatched = true;
    }
  });

  // Rendering hooks – custom drawing of UI overlays
  Events.on(render, 'afterRender', () => {
    if (!cloth) return;
    const context = render.context;
    // Drawing guide while creating custom cloth
    if (isDrawing && drawStart && drawCurrent) {
      context.beginPath();
      context.moveTo(drawStart.x, drawStart.y);
      context.lineTo(drawCurrent.x, drawCurrent.y);
      context.strokeStyle = '#fff';
      context.lineWidth = 2;
      context.setLineDash([5, 5]);
      context.stroke();
      context.setLineDash([]);
      context.fillStyle = '#ffc107';
      context.beginPath();
      context.arc(drawStart.x, drawStart.y, 4, 0, 2 * Math.PI);
      context.arc(drawCurrent.x, drawCurrent.y, 4, 0, 2 * Math.PI);
      context.fill();
    }

    // Interaction body overlay
    if (interactionBody) {
      const pos = interactionBody.position;
      context.beginPath();
      context.arc(pos.x, pos.y, interactionRadius, 0, 2 * Math.PI);
      if (isSolidMode) {
        context.fillStyle = '#2196f3';
        context.strokeStyle = '#ffffff';
        context.lineWidth = 2;
        context.shadowBlur = 0;
      } else {
        context.fillStyle = 'rgba(33, 150, 243, 0.3)';
        context.strokeStyle = '#2196f3';
        context.lineWidth = 2;
        context.shadowColor = '#2196f3';
        context.shadowBlur = 20;
      }
      context.fill();
      context.stroke();
      context.shadowBlur = 0;
    }

    // Cloth constraints – colour‑coded strain
    const constraints = Composite.allConstraints(cloth);
    const tearMultiplier = parseFloat(tearSlider?.value ?? '5');
    const breakingDist = currentGap * tearMultiplier;
    context.lineWidth = 1;
    for (let i = 0; i < constraints.length; i++) {
      const c = constraints[i];
      const a = c.bodyA.position;
      const b = c.bodyB.position;
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const strain = (dist - currentGap) / (breakingDist - currentGap);
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      if (strain > 0.9) context.strokeStyle = '#ff3333';
      else if (strain > 0.5) context.strokeStyle = '#ffaa33';
      else context.strokeStyle = '#2ecc71';
      context.stroke();
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
  });

  // Accordion UI (from original script)
  document.querySelectorAll('details').forEach((el) => {
    const summary = el.querySelector('summary');
    const content = el.querySelector('.accordion-content');
    if (!summary || !content) return;
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      if (el.hasAttribute('open')) {
        const closingAnim = content.animate([
          { height: content.scrollHeight + 'px', opacity: 1 },
          { height: '0px', opacity: 0 },
        ], { duration: 400, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });
        closingAnim.onfinish = () => el.removeAttribute('open');
      } else {
        el.setAttribute('open', 'true');
        content.animate([
          { height: '0px', opacity: 0 },
          { height: content.scrollHeight + 'px', opacity: 1 },
        ], { duration: 400, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });
      }
    });
  });
}
