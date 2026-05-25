"use client";

import { motion, useInView, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));

  const [rendered, setRendered] = useState("0");

  useEffect(() => {
    if (isInView && !shouldReduceMotion) spring.set(value);
    if (isInView && shouldReduceMotion) setRendered(String(value));
  }, [isInView, spring, value, shouldReduceMotion]);

  useEffect(() => {
    const unsubscribe = display.on("change", (v) => setRendered(String(v)));
    return unsubscribe;
  }, [display]);

  return (
    <motion.span
      ref={ref}
      className="font-serif text-[clamp(3rem,6vw,5rem)] tracking-[-0.03em] bg-gradient-to-b from-white to-indigo-300 bg-clip-text text-transparent"
    >
      {rendered}
      {suffix}
    </motion.span>
  );
}
