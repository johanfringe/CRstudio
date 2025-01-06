import React from "react";

const TikTokLink = () => {
  return (
    <a
      href="https://tiktok.com"
      className="text-gray-800 hover:text-gray-600"
      aria-label="TikTok"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-6 h-6"
        fill="currentColor"
      >
        <circle cx="12" cy="12" r="12" fill="currentColor" />
        <path
          d="M12.3,5.1c0.8,0,1.5,0,2.3,0c0,0.9,0.4,1.8,1,2.4l0,0c0.7,0.6,1.5,1,2.4,1l0,0v2.3c-0.9,0-1.7-0.2-2.5-0.6l0,0 c-0.4-0.2-0.7-0.4-1-0.6l0,0c0,1.7,0,3.4,0,5.1c0,0.9-0.3,1.6-0.8,2.3l0,0c-0.8,1.1-2,1.8-3.4,1.9h0c-0.1,0-0.1,0-0.2,0 c-0.8,0-1.6-0.2-2.2-0.6l0,0c-1.2-0.7-2-1.9-2.1-3.3l0,0c0-0.3,0-0.6,0-0.9c0.2-2.2,2.1-3.9,4.3-3.9c0.3,0,0.5,0,0.7,0.1l0,0 c0,0.9,0,1.7,0,2.6c-0.2-0.1-0.4-0.1-0.7-0.1c-0.9,0-1.6,0.6-1.9,1.3l0,0c-0.1,0.2-0.1,0.4-0.1,0.7c0,0.1,0,0.2,0,0.3l0,0 c0.2,0.9,1,1.7,1.9,1.7c0,0,0.1,0,0.1,0h0c0.7,0,1.3-0.4,1.6-0.9l0,0c0.1-0.2,0.2-0.4,0.2-0.6l0,0c0.1-1,0-2.1,0-3.1 C12.3,9.7,12.3,7.4,12.3,5.1L12.3,5.1z"
          fill="white"
        />
      </svg>
    </a>
  );
};

export default TikTokLink;