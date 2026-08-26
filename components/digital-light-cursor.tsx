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
    const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!cursor || !precisePointer.matches || reducedMotion.matches) return;

    let frame = 0;
    let pointerX = -100;
    let pointerY = -100;

    document.body.classList.add("digital-cursor-enabled");

    const draw = () => {
      cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      frame = 0;
    };

    const move = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      cursor.classList.add("is-visible");
      if (!frame) frame = window.requestAnimationFrame(draw);
    };

    const updateTarget = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      cursor.classList.toggle("is-interactive", Boolean(target?.closest(interactiveSelector)));
    };

    const press = () => cursor.classList.add("is-pressed");
    const release = () => cursor.classList.remove("is-pressed");
    const hide = () => cursor.classList.remove("is-visible", "is-interactive", "is-pressed");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", updateTarget, { passive: true });
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("blur", hide);
    document.documentElement.addEventListener("mouseleave", hide);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      document.body.classList.remove("digital-cursor-enabled");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", updateTarget);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
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
