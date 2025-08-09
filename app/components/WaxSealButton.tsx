"use client";

import React from "react";

type Props = {
  label: string;
  onClick?: () => void;
  imgSrc?: string; // optional external or local image to use instead of SVG
  size?: number; // px size of the seal (width=height)
};

export default function WaxSealButton({ label, onClick, imgSrc, size = 128 }: Props) {
  if (imgSrc) {
    return (
      <button
        onClick={onClick}
        className="select-none inline-flex items-center justify-center"
        style={{ width: size, height: size, background: "transparent", border: "none", position: "relative" }}
        aria-label={label}
      >
        <img
          src={imgSrc}
          alt="wax seal"
          width={size}
          height={size}
          draggable={false}
          style={{ width: size, height: size, objectFit: "contain" }}
        />
        <span className="seal-emboss" style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 18 }}>
          {label}
        </span>
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className="select-none inline-flex items-center justify-center"
      aria-label={label}
      style={{
        width: 96,
        height: 96,
        border: "none",
        background: "transparent",
        borderRadius: 9999,
        transform: "translateZ(0)",
      }}
    >
      <svg width="96" height="96" viewBox="0 0 96 96" role="img" aria-hidden="true" shapeRendering="geometricPrecision">
        <defs>
          {/* main wax gradient */}
          <radialGradient id="waxGrad" cx="32%" cy="28%" r="75%">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="38%" stopColor="#d64545" />
            <stop offset="72%" stopColor="#b13434" />
            <stop offset="100%" stopColor="#7a2121" />
          </radialGradient>

          {/* glossy highlight overlays */}
          <radialGradient id="spec1" cx="38%" cy="28%" r="42%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="28%" stopColor="rgba(255,255,255,0.38)" />
            <stop offset="48%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <radialGradient id="spec2" cx="70%" cy="74%" r="60%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.22)" />
            <stop offset="40%" stopColor="rgba(0,0,0,0.12)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          {/* edge rim gradient */}
          <linearGradient id="rimGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="55%" stopColor="rgba(0,0,0,0.25)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
          </linearGradient>

          {/* inner shadow (deboss well) */}
          <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feOffset dx="0" dy="2" />
            <feGaussianBlur stdDeviation="2" result="b" />
            <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
            <feBlend in2="SourceGraphic" mode="multiply" />
          </filter>

          {/* deboss for text */}
          <filter id="textDeboss" x="-50%" y="-50%" width="200%" height="200%">
            <feOffset dx="0.8" dy="0.8" in="SourceAlpha" result="sh" />
            <feGaussianBlur in="sh" stdDeviation="0.4" result="shb" />
            <feColorMatrix in="shb" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" result="shadow" />
            <feOffset dx="-0.8" dy="-0.8" in="SourceAlpha" result="hl" />
            <feGaussianBlur in="hl" stdDeviation="0.35" result="hlb" />
            <feColorMatrix in="hlb" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0" result="highlight" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="highlight" />
            </feMerge>
          </filter>
          {/* Path reused for clip & stroke */}
          <clipPath id="sealClip">
            <path d="M48 10c8 0 16 3.2 20.6 7.6 5.6 5.4 13.6 6.2 13.6 15 0 8-6 10-7 16s2.2 7.4-1.4 14c-4 6.6-10.8 6.8-16 10-5 3.2-7.6 11-16.8 11-9.8 0-12.8-5.6-17.2-9.2-5.2-4-10.6-5.2-12.8-12.8-1.6-6.2 3.2-10 3.2-16s-6.4-10.8-3.2-17.2 8.8-7.6 14.4-9.6C32 26 35.6 19 48 19Z" />
          </clipPath>
        </defs>

        {/* soft ground shadow */}
        <ellipse cx="52" cy="68" rx="28" ry="7" fill="rgba(60,20,20,0.16)" />

        {/* irregular wax blob */}
        <g filter="url(#innerShadow)">
          <path
            d="M48 12c8-1 16 2 21 7 6 5 13 6 13 14 0 7-5 10-6 16-1 6 2 9-2 14-4 6-10 7-16 9-6 3-9 9-18 9s-13-5-17-8c-5-4-10-6-12-12-2-7 3-10 3-16s-6-11-3-17 9-8 15-10 11-6 22-6Z"
            fill="url(#waxGrad)"
          />
          {/* glare + occlusion layers */}
          <path d="M16 50c2.2 5 7.2 8.4 12.4 11.4 4.8 3 8.6 8.2 17 8.2 7.4 0 10.6-5.2 15-8.2 4.4-3 10-5 12.4-10" fill="url(#spec2)" />
          <path d="M22 32c3.2-3 8.6-5.2 15-7.2 6-2 11.4-3 16.8-2 5.4 1 9.8 3 13 6" fill="url(#spec1)" />
          {/* rim bevel */}
          <path d="M48 12c8-1 16 2 21 7 6 5 13 6 13 14 0 7-5 10-6 16-1 6 2 9-2 14-4 6-10 7-16 9-6 3-9 9-18 9s-13-5-17-8c-5-4-10-6-12-12-2-7 3-10 3-16s-6-11-3-17 9-8 15-10 11-6 22-6Z" fill="none" stroke="url(#rimGrad)" strokeWidth="1.6" opacity="0.9" />
        </g>

        {/* debossed label */}
        <g transform="translate(0,2)" clipPath="url(#sealClip)">
          <text
            x="48"
            y="50"
            textAnchor="middle"
            fontFamily="Cormorant, Cormorant Garamond, serif"
            fontSize="18"
            fontWeight={700}
            letterSpacing="0.03em"
            fill="#6a2020"
            opacity="0.6"
            filter="url(#textDeboss)"
          >
            {label}
          </text>
        </g>
      </svg>
    </button>
  );
}


