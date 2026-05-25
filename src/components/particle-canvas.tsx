"use client";

import { useRef, useEffect, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  radius: number;
  alpha: number;
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const cx = width / 2;
    const cy = height / 2;

    for (let i = 0; i < 120; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 200;
      particles.push({
        x: cx + Math.cos(angle) * dist * 3,
        y: cy + Math.sin(angle) * dist * 3,
        vx: 0,
        vy: 0,
        targetX: cx + Math.cos(angle) * dist,
        targetY: cy + Math.sin(angle) * dist,
        radius: 1 + Math.random() * 2,
        alpha: 0.4 + Math.random() * 0.6,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.parentElement!.offsetWidth;
      canvas.height = canvas.parentElement!.offsetHeight;
      initParticles(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const { x: mx, y: my } = mouseRef.current;

      for (const p of particles) {
        // Attract toward target position
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        p.vx += dx * 0.003;
        p.vy += dy * 0.003;

        // Repel from cursor
        const cdx = p.x - mx;
        const cdy = p.y - my;
        const cursorDist = Math.sqrt(cdx * cdx + cdy * cdy);
        if (cursorDist < 120) {
          p.vx += (cdx / cursorDist) * 0.5;
          p.vy += (cdy / cursorDist) * 0.5;
        }

        // Friction
        p.vx *= 0.92;
        p.vy *= 0.92;

        p.x += p.vx;
        p.y += p.vy;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.alpha})`;
        ctx.fill();
      }

      // Draw lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 * (1 - dist / 60)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [initParticles]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
}
