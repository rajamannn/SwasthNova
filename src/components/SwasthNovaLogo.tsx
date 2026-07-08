import React from "react";

interface SwasthNovaLogoProps {
  className?: string;
  size?: number;
}

export const SwasthNovaLogo: React.FC<SwasthNovaLogoProps> = ({ className = "", size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${className}`}
      style={{ minWidth: size, minHeight: size }}
      id="swasthnova-custom-logo"
    >
      <defs>
        {/* Blue Cradling Ring & Hand Gradient */}
        <linearGradient id="swasthBlueGrad" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284c7" /> {/* Sky 600 */}
          <stop offset="50%" stopColor="#2563eb" /> {/* Blue 600 */}
          <stop offset="100%" stopColor="#1d4ed8" /> {/* Blue 700 */}
        </linearGradient>

        {/* Central Leaves Gradient */}
        <linearGradient id="swasthLeafGrad" x1="50" y1="25" x2="50" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ade80" /> {/* Green 400 */}
          <stop offset="100%" stopColor="#15803d" /> {/* Green 700 */}
        </linearGradient>

        {/* Green Ground/Wave Gradient */}
        <linearGradient id="swasthGroundGrad" x1="30" y1="55" x2="70" y2="75" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#16a34a" /> {/* Green 600 */}
          <stop offset="100%" stopColor="#14532d" /> {/* Green 900 */}
        </linearGradient>
      </defs>

      {/* Background Outer Blue Glow Ring (subtle) */}
      <circle cx="50" cy="50" r="46" stroke="#2563eb" strokeWidth="1.5" strokeOpacity="0.15" fill="none" />

      {/* Main Outer Blue Swoosh (Left and bottom circular ring cradling hand) */}
      <path
        d="M 50 8
           A 42 42 0 1 0 92 50
           C 92 38, 86 28, 77 20
           C 85 28, 88 38, 88 50
           A 38 38 0 1 1 50 12
           C 50 12, 50 8, 50 8 Z"
        fill="url(#swasthBlueGrad)"
      />

      {/* Hand cradling bottom curve */}
      <path
        d="M 12 50
           C 12 70, 28 88, 50 88
           C 35 88, 22 78, 18 64
           C 14 50, 20 38, 12 50 Z"
        fill="url(#swasthBlueGrad)"
        opacity="0.9"
      />

      {/* Stylized Bottom Green Wave / Ground */}
      <path
        d="M 24 64
           C 36 54, 64 54, 76 64
           C 65 74, 35 74, 24 64 Z"
        fill="url(#swasthGroundGrad)"
      />

      {/* Central Leaf 1 (Middle vertical leaf) */}
      <path
        d="M 50 60
           C 42 50, 42 38, 50 26
           C 58 38, 58 50, 50 60 Z"
        fill="url(#swasthLeafGrad)"
      />

      {/* Left Leaf 2 (Angled left leaf) */}
      <path
        d="M 46 60
           C 32 53, 28 43, 32 35
           C 41 40, 45 49, 46 60 Z"
        fill="url(#swasthLeafGrad)"
      />

      {/* Right Leaf 3 (Angled right leaf) */}
      <path
        d="M 54 60
           C 68 53, 72 43, 68 35
           C 59 40, 55 49, 54 60 Z"
        fill="url(#swasthLeafGrad)"
      />
    </svg>
  );
};
