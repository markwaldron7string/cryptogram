import React from "react";
import "./Logo.css";
import "./Logo.css";

const Logo = ({ className = "" }) => (
  <svg
    className={`logo-svg ${className}`}
    viewBox="0 0 180 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Cryptogram"
  >
    <defs>
      <linearGradient id="logoHexGrad" x1="0" y1="0" x2="36" y2="36">
        <stop stopColor="#00f0ff" />
        <stop offset="0.5" stopColor="#0ea5e9" />
        <stop offset="1" stopColor="#6366f1" />
      </linearGradient>
      <linearGradient id="logoTextGrad" x1="40" y1="0" x2="180" y2="36">
        <stop stopColor="#00f0ff" />
        <stop offset="1" stopColor="#a78bfa" />
      </linearGradient>
      <filter id="logoGlow">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <g className="logo-mark" filter="url(#logoGlow)">
      <path
        d="M18 2 L32 10 L32 26 L18 34 L4 26 L4 10 Z"
        stroke="url(#logoHexGrad)"
        strokeWidth="1.5"
        fill="rgba(0,240,255,0.06)"
      />
      <path
        d="M18 10 L24 14 L24 22 L18 26 L12 22 L12 14 Z"
        stroke="url(#logoHexGrad)"
        strokeWidth="1"
        fill="rgba(14,165,233,0.12)"
      />
      <circle cx="18" cy="18" r="2.5" fill="#00f0ff" className="logo-core" />
      <path
        d="M18 8 v4 M18 24 v4 M8 18 h4 M24 18 h4"
        stroke="#00f0ff"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
    </g>

    <text
      x="42"
      y="24"
      fill="url(#logoTextGrad)"
      fontFamily="'Space Grotesk', sans-serif"
      fontSize="19"
      fontWeight="700"
      letterSpacing="-0.02em"
    >
      CRYPTOGRAM
    </text>
  </svg>
);

export default Logo;
