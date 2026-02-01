import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * Academy of Pi - Official Logo Component
 * 
 * Features:
 * - Uses the official Academy of Pi logo (Pi symbol with graduation cap)
 * - High-quality image rendering
 * - Fully responsive
 * 
 * @param size - Logo size in pixels (default: 120)
 * @param className - Additional CSS classes
 */
export const Logo: React.FC<LogoProps> = ({ size = 120, className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      fill="none"
      aria-label="Academy of Pi Logo"
    >
      <defs>
        <linearGradient id="piGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#B45309" stopOpacity="1" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Circle border with gradient */}
      <circle cx="100" cy="100" r="88" stroke="url(#borderGradient)" strokeWidth="4" fill="none" opacity="0.3" />
      <circle cx="100" cy="100" r="82" stroke="url(#borderGradient)" strokeWidth="2" fill="none" />
      
      {/* Pi symbol (π) with premium gradient */}
      <g filter="url(#glow)">
        <path 
          d="M 50 82 Q 50 78 54 78 L 146 78 Q 150 78 150 82 L 150 90 Q 150 94 146 94 L 54 94 Q 50 94 50 90 Z" 
          fill="url(#piGradient)" 
        />
        <path 
          d="M 62 94 L 80 94 L 80 150 Q 80 158 72 158 Q 64 158 64 150 L 62 94 Z" 
          fill="url(#piGradient)" 
        />
        <path 
          d="M 120 94 L 138 94 L 138 154 Q 138 162 146 162 Q 154 162 154 154 L 120 94 Z" 
          fill="url(#piGradient)" 
        />
      </g>
      
      {/* Graduation cap with 3D feel */}
      <path 
        d="M 100 50 L 145 68 L 100 86 L 55 68 Z" 
        fill="#D97706" 
        stroke="#FCD34D" 
        strokeWidth="1"
      />
      <path 
        d="M 75 68 L 75 78 C 75 85 125 85 125 78 L 125 68" 
        fill="#B45309" 
      />
      
      {/* Tassel */}
      <path d="M 145 68 L 152 82" stroke="#FCD34D" strokeWidth="2" />
      <circle cx="152" cy="84" r="3" fill="#FBBF24" />

      {/* Shine effect */}
      <path d="M 60 85 L 140 85" stroke="white" strokeWidth="0.5" opacity="0.3" strokeLinecap="round" />
    </svg>
  );
};

/**
 * Compact Logo for navbars/headers
 */
export const LogoCompact: React.FC<LogoProps> = ({ size = 48, className = '' }) => {
  return <Logo size={size} className={className} />;
};

/**
 * Large Logo for splash screens
 */
export const LogoLarge: React.FC<LogoProps> = ({ size = 200, className = '' }) => {
  return <Logo size={size} className={className} />;
};

export default Logo;

