import React from "react";

export function CoffeeSteam() {
  return (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-16 h-12 flex justify-around pointer-events-none z-10 select-none">
      {/* Wave 1 */}
      <svg
        className="steam-particle-1 w-4 h-12 text-[#e2cfbe]/30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        viewBox="0 0 24 36"
      >
        <path d="M12 36c-4-6 4-12 0-18s-4-12 0-18" />
      </svg>
      {/* Wave 2 */}
      <svg
        className="steam-particle-2 w-4 h-12 text-[#e2cfbe]/35"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        viewBox="0 0 24 36"
      >
        <path d="M12 36c3-6-3-12 0-18s3-12 0-18" />
      </svg>
      {/* Wave 3 */}
      <svg
        className="steam-particle-3 w-4 h-12 text-[#e2cfbe]/30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        viewBox="0 0 24 36"
      >
        <path d="M12 36c-2-6 2-12 0-18s-2-12 0-18" />
      </svg>
    </div>
  );
}
