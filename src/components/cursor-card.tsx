"use client";

import { useRef, useEffect, type MouseEvent } from "react";

export function CursorCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => { prefersReducedMotion.current = e.matches; };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleMouseMove = (e: MouseEvent) => {
    if (prefersReducedMotion.current) return;
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    card.style.setProperty("--mx", `${x * 100}%`);
    card.style.setProperty("--my", `${y * 100}%`);
    card.style.transform = `perspective(800px) rotateY(${(x - 0.5) * 6}deg) rotateX(${(0.5 - y) * 6}deg)`;
  };

  const handleMouseLeave = () => {
    if (prefersReducedMotion.current) return;
    const card = ref.current;
    if (!card) return;
    card.style.setProperty("--mx", "50%");
    card.style.setProperty("--my", "50%");
    card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative cursor-default overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface p-8 transition-[opacity,background] duration-200"
      style={
        {
          "--mx": "50%",
          "--my": "50%",
        } as React.CSSProperties
      }
    >
      {/* Dynamic gradient that follows cursor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at var(--mx) var(--my), rgba(99,102,241,0.08), transparent 50%)",
        }}
      />

      <div className="relative z-10">
        <div aria-hidden="true" className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 border border-accent/15 text-lg">
          {icon}
        </div>
        <h3 className="text-lg font-semibold tracking-[-0.02em]">{title}</h3>
        <p className="mt-2 text-sm text-text-muted">{desc}</p>
      </div>
    </div>
  );
}
