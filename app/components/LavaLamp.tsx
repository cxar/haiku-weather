"use client";

import React, { useEffect, useRef } from "react";

type Blob = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  hue: number;
  phase: number;
};

function hsla(h: number, s: number, l: number, a: number) {
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}

export default function LavaLamp() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>();
  const blobsRef = useRef<Blob[]>([]);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const t0Ref = useRef<number>(0);

  const resize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  };

  const initBlobs = () => {
    const count = Math.max(6, Math.min(10, Math.round((window.innerWidth * window.innerHeight) / 160000)));
    const { innerWidth: W, innerHeight: H } = window;
    const pastelHues = [205, 270, 140, 18, 320]; // periwinkle, lavender, mint, peach, orchid
    blobsRef.current = Array.from({ length: count }, () => {
      const baseRadius = 120 + Math.random() * 140;
      const hue = pastelHues[Math.floor(Math.random() * pastelHues.length)] + (Math.random() * 8 - 4);
      return {
        x: W * (0.25 + Math.random() * 0.5),
        y: H * (0.25 + Math.random() * 0.5),
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        baseRadius,
        hue,
        phase: Math.random() * Math.PI * 2,
      } as Blob;
    });
  };

  const draw = (ts: number) => {
    if (!t0Ref.current) t0Ref.current = ts;
    const t = (ts - t0Ref.current) / 1000;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    // Background: soft vertical gradient with a touch more contrast so colors read better
    const gBg = ctx.createLinearGradient(0, 0, 0, H);
    gBg.addColorStop(0, hsla(28, 50, 95, 1));
    gBg.addColorStop(1, hsla(210, 45, 90, 1));
    ctx.fillStyle = gBg;
    ctx.fillRect(0, 0, W, H);

    // Draw blobs with screen blending for vibrant pastels without blowing out to white
    ctx.globalCompositeOperation = "screen";

    for (const blob of blobsRef.current) {
      const radius = blob.baseRadius * (0.82 + 0.18 * Math.sin(t * 0.8 + blob.phase));
      const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, radius);
      grad.addColorStop(0, hsla(blob.hue, 60, 60, 0.65));
      grad.addColorStop(0.45, hsla(blob.hue + 8, 60, 65, 0.42));
      grad.addColorStop(0.9, hsla(blob.hue, 60, 70, 0.08));
      grad.addColorStop(1, hsla(blob.hue, 60, 70, 0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(blob.x, blob.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Update physics
      const currentX = Math.sin(t * 0.15 + blob.phase) * 0.12;
      const currentY = Math.cos(t * 0.18 + blob.phase) * 0.12;
      blob.vx += currentX * 0.02;
      blob.vy += currentY * 0.02;

      // Pointer attraction
      if (pointerRef.current) {
        const dx = pointerRef.current.x - blob.x;
        const dy = pointerRef.current.y - blob.y;
        const dist = Math.hypot(dx, dy) || 1;
        const influence = Math.min(1, 160 / dist) * 0.08; // gentle
        blob.vx += (dx / dist) * influence;
        blob.vy += (dy / dist) * influence;
      }

      blob.x += blob.vx;
      blob.y += blob.vy;

      // Soft friction
      blob.vx *= 0.985;
      blob.vy *= 0.985;

      // Bounce softly off edges
      if (blob.x - blob.baseRadius < 0 && blob.vx < 0) blob.vx *= -0.9;
      if (blob.x + blob.baseRadius > W && blob.vx > 0) blob.vx *= -0.9;
      if (blob.y - blob.baseRadius < 0 && blob.vy < 0) blob.vy *= -0.9;
      if (blob.y + blob.baseRadius > H && blob.vy > 0) blob.vy *= -0.9;
    }

    // Restore default composite
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();

    rafRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    resize();
    initBlobs();
    rafRef.current = requestAnimationFrame(draw);

    const onResize = () => {
      resize();
      initBlobs();
    };
    const onPointer = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
    };
    const clearPointer = () => {
      pointerRef.current = null;
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    window.addEventListener("pointerup", clearPointer, { passive: true });
    window.addEventListener("pointercancel", clearPointer, { passive: true });
    window.addEventListener("pointerleave", clearPointer, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("pointerup", clearPointer);
      window.removeEventListener("pointercancel", clearPointer);
      window.removeEventListener("pointerleave", clearPointer);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}


