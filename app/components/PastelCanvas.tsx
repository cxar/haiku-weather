import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
}

// A full-screen HTML canvas that paints drifting pastel circles.
export default function PastelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();
  const particles = useRef<Particle[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);

  // Pastel palette
  const colors = [
    "#ffadad",
    "#ffd6a5",
    "#fdffb6",
    "#caffbf",
    "#9bf6ff",
    "#a0c4ff",
    "#bdb2ff",
    "#ffc6ff",
  ];

  // Resize canvas to match viewport / DPR
  const resize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  };

  // Initialise particle set
  const initParticles = () => {
    const count = 45;
    const { innerWidth: w, innerHeight: h } = window;
    const spanX = w * 0.4; // keep them roughly in the central 40% area
    const spanY = h * 0.4;
    particles.current = Array.from({ length: count }, () => {
      const radius = 80 + Math.random() * 120;
      return {
        x: w / 2 + (Math.random() - 0.5) * spanX,
        y: h / 2 + (Math.random() - 0.5) * spanY,
        radius,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      } as Particle;
    });
  };

  // Draw a single frame
  const draw = (ctx: CanvasRenderingContext2D) => {
    const dpr = window.devicePixelRatio || 1;
    const widthCss = ctx.canvas.width / dpr;
    const heightCss = ctx.canvas.height / dpr;
    ctx.clearRect(0, 0, widthCss, heightCss);
    ctx.globalCompositeOperation = "lighter"; // colours add together softly

    particles.current.forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      // Soft radial gradient for each particle
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.radius);
      const rgba = (hex: string, alpha: number) => {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const gVal = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r},${gVal},${b},${alpha})`;
      };
      g.addColorStop(0, rgba(p.color, 0.65));
      g.addColorStop(1, rgba(p.color, 0));

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Update position
      p.x += p.vx;
      p.y += p.vy;
      const w = widthCss;
      const h = heightCss;
      // Bounce off edges
      if (p.x - p.radius < 0 && p.vx < 0) {
        p.vx *= -1;
        p.x = p.radius; // keep inside
      }
      if (p.x + p.radius > w && p.vx > 0) {
        p.vx *= -1;
        p.x = w - p.radius;
      }
      if (p.y - p.radius < 0 && p.vy < 0) {
        p.vy *= -1;
        p.y = p.radius;
      }
      if (p.y + p.radius > h && p.vy > 0) {
        p.vy *= -1;
        p.y = h - p.radius;
      }

      // Pointer interaction: simple repulsion
      if (pointer.current) {
        const dx = p.x - pointer.current.x;
        const dy = p.y - pointer.current.y;
        const distSq = dx * dx + dy * dy;
        const range = 200; // px radius of influence
        if (distSq < range * range) {
          const dist = Math.sqrt(distSq) || 1;
          const force = (1 - dist / range) * 0.3; // strength diminishes with distance
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      // Slow down velocities gradually for smooth motion
      p.vx *= 0.98;
      p.vy *= 0.98;
    });
  };

  useEffect(() => {
    resize();
    initParticles();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Account for device pixel ratio so drawing coordinates align with CSS pixels
    const dpr = window.devicePixelRatio || 1;
    ctx.scale(dpr, dpr);

    const render = () => {
      draw(ctx);
      animationRef.current = requestAnimationFrame(render);
    };
    render();

    window.addEventListener("resize", () => {
      resize();
      initParticles();
    });

    // Pointer / touch listeners
    const handleMove = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };
    };
    const clearPointer = () => {
      pointer.current = null;
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerdown", handleMove);
    window.addEventListener("pointerup", clearPointer);
    window.addEventListener("pointerleave", clearPointer);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleMove);
      window.removeEventListener("pointerup", clearPointer);
      window.removeEventListener("pointerleave", clearPointer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
} 