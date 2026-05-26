"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const services = [
  {
    label: "Flagship Service",
    title: "AI Opportunity Audit",
    desc: "Before you invest in the wrong tools, we identify where AI and automation create the biggest operational impact. You get a prioritized roadmap — not a list of buzzwords.",
    tags: ["Workflow mapping", "Bottleneck analysis", "ROI prioritization"],
    large: true,
  },
  {
    label: "Build",
    title: "Workflow Automation",
    desc: "Replace manual coordination, approvals, and handoffs with systems that run themselves.",
  },
  {
    label: "Build",
    title: "Custom AI Apps",
    desc: "Internal tools, copilots, and interfaces built around how your team actually works.",
  },
  {
    label: "Advanced",
    title: "Agentic Workflow Systems",
    desc: "Multi-step AI systems that coordinate actions, support decisions, and manage complex process flows — with human oversight built in.",
    wide: true,
  },
];

function ServiceCard({
  service,
  index,
  shouldReduceMotion,
}: {
  service: (typeof services)[0];
  index: number;
  shouldReduceMotion: boolean | null;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={`group rounded-2xl border border-border-subtle bg-bg-surface p-8 transition-colors hover:border-border-subtle ${
        service.large ? "md:row-span-2" : ""
      } ${service.wide ? "md:col-span-2" : ""}`}
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
      animate={
        isInView
          ? { opacity: 1, y: 0 }
          : shouldReduceMotion
            ? {}
            : { opacity: 0, y: 20 }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.4, delay: index * 0.1 }
      }
      style={
        service.large
          ? {
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(99,102,241,0.02))",
            }
          : undefined
      }
    >
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
        {service.label}
      </p>
      <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em]">
        {service.title}
      </h3>
      <p className="mt-2 text-sm text-text-muted">{service.desc}</p>
      {service.tags && (
        <div className="mt-5 flex flex-wrap gap-2">
          {service.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function ServicesSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-32">
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="mb-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
            Services
          </p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">
            What Tabula builds.
          </h2>
          <p className="mx-auto mt-4 max-w-[48ch] text-text-muted">
            We focus on workflow transformation first. Technology follows the
            business problem, not the other way around.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr] md:grid-rows-[auto_auto]">
          {services.map((service, i) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={i}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
