import React, { useEffect, useRef } from "react";

export const Cursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const mouse = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    document.addEventListener("mousemove", onMouseMove);

    const updatePosition = () => {
      const ease = 6;
      pos.x += (mouse.x - pos.x) / ease;
      pos.y += (mouse.y - pos.y) / ease;

      if (cursor) {
        cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }
      requestAnimationFrame(updatePosition);
    };

    requestAnimationFrame(updatePosition);

    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-cursor]") as HTMLElement;
      if (!target) return;

      const cursorType = target.dataset.cursor;
      if (cursorType === "icons") {
        const rect = target.getBoundingClientRect();
        cursor.classList.add("cursor-icons");
        cursor.style.setProperty("--cursorH", `${rect.height}px`);
      } else if (cursorType === "disable") {
        cursor.classList.add("cursor-disable");
      }
    };

    const onMouseOut = () => {
      cursor.classList.remove("cursor-disable", "cursor-icons");
    };

    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef} />;
};
export default Cursor;
