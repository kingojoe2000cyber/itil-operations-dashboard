"use client";

import { useEffect, useRef } from "react";

const interactiveSelector = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "[role='button']",
  "[role='link']",
  "[data-cursor-focus]",
].join(",");

export function DigitalLightCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    if (!cursor) return;

    let frame = 0;
    let pointerX = -100;
    let pointerY = -100;

    const draw = () => {
      cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      frame = 0;
    };

    const move = (event: MouseEvent) => {
      document.body.classList.add("digital-cursor-enabled");
      pointerX = event.clientX;
      pointerY = event.clientY;
      cursor.classList.add("is-visible");
      if (!frame) frame = window.requestAnimationFrame(draw);
    };

    const updateTarget = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      cursor.classList.toggle("is-interactive", Boolean(target?.closest(interactiveSelector)));
    };

    const press = () => cursor.classList.add("is-pressed");
    const release = () => cursor.classList.remove("is-pressed");
    const hide = () => {
      document.body.classList.remove("digital-cursor-enabled");
      cursor.classList.remove("is-visible", "is-interactive", "is-pressed");
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", updateTarget, { passive: true });
    window.addEventListener("mousedown", press, { passive: true });
    window.addEventListener("mouseup", release, { passive: true });
    window.addEventListener("blur", hide);
    document.documentElement.addEventListener("mouseleave", hide);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      document.body.classList.remove("digital-cursor-enabled");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", updateTarget);
      window.removeEventListener("mousedown", press);
      window.removeEventListener("mouseup", release);
      window.removeEventListener("blur", hide);
      document.documentElement.removeEventListener("mouseleave", hide);
    };
  }, []);

  return (
    <div ref={cursorRef} className="digital-cursor" aria-hidden="true">
      <span className="digital-cursor__aura" />
      <span className="digital-cursor__ring" />
      <span className="digital-cursor__core" />
    </div>
  );
}
