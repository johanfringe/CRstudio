import React from "react";

const XLink = () => {
  return (
    <a
      href="https://twitter.com"
      className="text-gray-800 hover:text-gray-600"
      aria-label="X (formerly Twitter)"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-6 h-6"
      >
        <circle cx="12" cy="12" r="12" fill="currentColor" />
        <g transform="translate(52.390088,-25.058597)">
          <path
            d="M-47.7,30.1l5.7,7.7l-5.8,6.2h1.3l5-5.4l4.1,5.4h4.4l-6-8.1l5.4-5.8h-1.3l-4.6,5l-3.8-5H-47.7z M-45.8,31h2l8.9,12h-2L-45.8,31z"
            fill="white"
          />
        </g>
      </svg>
    </a>
  );
};

export default XLink;
