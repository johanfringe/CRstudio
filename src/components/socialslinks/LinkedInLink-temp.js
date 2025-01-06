import React from "react";

const LinkedInLink = () => {
  return (
    <a
      href="https://linkedin.com"
      className="text-gray-800 hover:text-gray-600"
      aria-label="LinkedIn"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-6 h-6"
      >
        <path d="M12,0C5.4,0,0,5.4,0,12s5.4,12,12,12s12-5.4,12-12S18.6,0,12,0z" fill="currentColor" />
        <rect x="6.1" y="9.5" width="2.4" height="7.7" fill="white" />
        <path
          d="M7.3,5.9c-0.9,0-1.5,0.6-1.5,1.3c0,0.7,0.6,1.3,1.4,1.3h0c0.9,0,1.5-0.6,1.5-1.3C8.7,6.4,8.2,5.9,7.3,5.9z"
          fill="white"
        />
        <path
          d="M15.1,9.4c-1.4,0-2.2,0.8-2.4,1.3V9.5H10c0,0.6,0,7.7,0,7.7h2.7v-4.2c0-0.2,0-0.5,0.1-0.6 c0.2-0.5,0.6-0.9,1.3-0.9c0.9,0,1.4,0.7,1.4,1.8v4h2.7v-4.3C18.2,10.6,16.8,9.4,15.1,9.4z"
          fill="white"
        />
      </svg>
    </a>
  );
};

export default LinkedInLink;
