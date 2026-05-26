import gsap from "gsap";

export const applyCardTilt = (element: HTMLElement) => {
  element.addEventListener("mousemove", (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const tiltX = (y - centerY) / 20;
    const tiltY = (centerX - x) / 20;
    
    gsap.to(element, {
      rotateX: tiltX,
      rotateY: tiltY,
      transformPerspective: 1000,
      ease: "power2.out",
      duration: 0.5
    });
  });

  element.addEventListener("mouseleave", () => {
    gsap.to(element, {
      rotateX: 0,
      rotateY: 0,
      ease: "power2.out",
      duration: 0.5
    });
  });
};
