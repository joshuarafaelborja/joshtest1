import React from 'react';

export function SpotNotification({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="100" fill="#3B82F6" />
      <path d="M60 80C60 80 70 50 90 50C110 50 100 80 100 80" fill="#F5D6A8" />
      <path d="M140 80C140 80 130 50 110 50C90 50 100 80 100 80" fill="#F5D6A8" />
      <ellipse cx="100" cy="120" rx="50" ry="45" fill="#F5D6A8" />
      <ellipse cx="100" cy="125" rx="35" ry="30" fill="#FFF3E0" />
      <circle cx="85" cy="110" r="6" fill="#1E293B" />
      <circle cx="115" cy="110" r="6" fill="#1E293B" />
      <circle cx="87" cy="108" r="2" fill="white" />
      <circle cx="117" cy="108" r="2" fill="white" />
      <ellipse cx="100" cy="125" rx="8" ry="5" fill="#1E293B" />
      <path d="M88 135C94 142 106 142 112 135" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
      {/* Notification dot */}
      <circle cx="160" cy="45" r="20" fill="#EF4444" />
      <circle cx="160" cy="45" r="14" fill="#EF4444" stroke="white" strokeWidth="3" />
      {/* Sparkle */}
      <path d="M155 45L160 38L165 45L160 52Z" fill="white" />
    </svg>
  );
}
