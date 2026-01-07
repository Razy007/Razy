import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * Academy of Pi - Official Logo Component
 * 
 * Features:
 * - Pi symbol (π) with graduation cap
 * - Orange circle border
 * - Star accent
 * - Fully responsive SVG
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
      {/* Circle border */}
      <circle cx="100" cy="100" r="85" stroke="#FF8C00" strokeWidth="6" fill="none" />
      
      {/* Pi symbol (π) in orange */}
      <g fill="#FF8C00">
        {/* Horizontal bar of Pi */}
        <rect x="50" y="80" width="100" height="12" rx="2" />
        
        {/* Left pillar of Pi */}
        <rect x="60" y="80" width="18" height="70" rx="2" />
        
        {/* Right pillar of Pi */}
        <rect x="122" y="80" width="18" height="70" rx="2" />
      </g>
      
      {/* Graduation cap */}
      <g fill="#FF8C00">
        {/* Cap top (board) */}
        <polygon points="100,55 140,70 100,75 60,70" opacity="0.95" />
        
        {/* Cap base */}
        <ellipse cx="100" cy="71" rx="25" ry="7" opacity="0.9" />
        
        {/* Tassel */}
        <line x1="140" y1="70" x2="145" y2="78" stroke="#FF8C00" strokeWidth="2" />
        <circle cx="145" cy="80" r="3" />
      </g>
      
      {/* Star accent (top right) */}
      <g fill="#FF8C00" transform="translate(155, 40)">
        {/* 4-point star */}
        <path d="M 0,-8 L 2,-2 L 8,0 L 2,2 L 0,8 L -2,2 L -8,0 L -2,-2 Z" />
      </g>
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
