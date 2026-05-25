"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    num: "01",
    title: "Diagnose",
    desc: "Map where time is lost, where teams wait, and where manual decisions slow the business down.",
  },
  {
    num: "02",
    title: "Design",
    desc: "Shape a system around the actual process instead of forcing the business into generic software.",
  },
  {
    num: "03",
    title: "Build",
    desc: "Implement the workflow, AI touchpoints, and integrations that automate the work.",
  },
  {
    num: "04",
    title: "Refine",
    desc: "Adjust based on real usage so the system becomes durable, usable, and scalable.",
  },
];

function TimelineStep({
  step,
  index,
  shouldReduceMotion,
}: {
  step: (typeof steps)[0];
  index: number;
  shouldReduceMotion: boolean | null;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="relative pl-20 pb-14 last:pb-0"
      initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
      animate={
        isInView
          ? { opacity: 1, x: 0 }
          : shouldReduceMotion
            ? {}
            : { opacity: 0, x: -20 }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.5, delay: index * 0.1 }
      }
    >
      {/* Dot on the line */}
      <motion.div
        className="absolute left-[18px] top-1 h-[17px] w-[17px] rounded-full border-2 border-accent bg-bg-surface"
        animate={
          isInView
            ? {
                backgroundColor: "#6366F1",
                boxShadow: "0 0 30px rgba(99,102,241,0.6)",
              }
            : {}
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { delay: index * 0.1 + 0.3 }
        }
      />

      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
        {step.num} &mdash; {step.title}
      </p>
      <p className="mt-2 max-w-lg text-text-muted">{step.desc}</p>
    </motion.div>
  );
}

export function ProcessTimeline() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="py-32">
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="mb-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
            How It Works
          </p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">
            A clear path from friction to intelligent execution.
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative mx-auto max-w-2xl">
          {/* Vertical line */}
          <div className="absolute left-[18px] top-0 h-full w-px bg-gradient-to-b from-accent via-accent/40 to-transparent" />

          {steps.map((step, i) => (
            <TimelineStep
              key={step.num}
              step={step}
              index={i}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
