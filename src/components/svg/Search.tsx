import React from 'react';

export default function Search({ className }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="16.0741" cy="15.0741" r="10.0741" stroke="currentColor" strokeWidth="2" />
      <line
        x1="24.3031"
        y1="22.7407"
        x2="28"
        y2="26.4376"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
