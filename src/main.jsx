import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { motion, useMotionValue, useSpring } from "motion/react";

function MotionEffects() {
  const cursorX = useMotionValue(-1000);
  const cursorY = useMotionValue(-1000);
  const smoothCursorX = useSpring(cursorX, { stiffness: 120, damping: 30, mass: 0.45 });
  const smoothCursorY = useSpring(cursorY, { stiffness: 120, damping: 30, mass: 0.45 });
  const orbitX = useSpring(0, { stiffness: 90, damping: 24, mass: 0.5 });
  const orbitY = useSpring(0, { stiffness: 90, damping: 24, mass: 0.5 });

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!finePointer.matches || reducedMotion.matches) return undefined;

    const moveGlow = (event) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
    };

    window.addEventListener("pointermove", moveGlow, { passive: true });
    return () => window.removeEventListener("pointermove", moveGlow);
  }, [cursorX, cursorY]);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const heroArt = document.querySelector(".hero-art");
    const orbitScene = document.querySelector(".orbit-scene");

    if (!finePointer.matches || reducedMotion.matches || !heroArt || !orbitScene) return undefined;

    const moveOrbits = (event) => {
      const bounds = heroArt.getBoundingClientRect();
      const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
      const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
      orbitX.set(horizontal * 4);
      orbitY.set(vertical * 4);
    };
    const resetOrbits = () => {
      orbitX.set(0);
      orbitY.set(0);
    };
    const unsubscribeX = orbitX.on("change", (value) => {
      orbitScene.style.setProperty("--orbit-shift-x", `${value}px`);
    });
    const unsubscribeY = orbitY.on("change", (value) => {
      orbitScene.style.setProperty("--orbit-shift-y", `${value}px`);
    });

    heroArt.addEventListener("pointermove", moveOrbits, { passive: true });
    heroArt.addEventListener("pointerleave", resetOrbits);
    return () => {
      heroArt.removeEventListener("pointermove", moveOrbits);
      heroArt.removeEventListener("pointerleave", resetOrbits);
      unsubscribeX();
      unsubscribeY();
      orbitScene.style.removeProperty("--orbit-shift-x");
      orbitScene.style.removeProperty("--orbit-shift-y");
    };
  }, [orbitX, orbitY]);

  return (
    <motion.div
      className="cursor-glow"
      style={{ x: smoothCursorX, y: smoothCursorY }}
    />
  );
}

createRoot(document.getElementById("motion-effects-root")).render(<MotionEffects />);
