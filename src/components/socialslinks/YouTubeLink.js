import React from "react";

const YouTubeLink = () => {
  return (
    <a
      href="https://youtube.com"
      className="text-gray-800 hover:text-gray-600"
      aria-label="YouTube"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-6 h-6"
      >
          <circle cx="13.3" cy="12.6" r="8.5" fill="white" />
          <path
            d="M9.7,15.5V8.5l6.1,3.5L9.7,15.5z M12,5.8c-3.4,0-6.2,2.8-6.2,6.2s2.8,6.2,6.2,6.2c3.4,0,6.2-2.8,6.2-6.2l0,0 C18.2,8.6,15.4,5.8,12,5.8L12,5.8L12,5.8z M12,19.1L12,19.1c-3.9,0-7.1-3.2-7.1-7.1S8.1,4.9,12,4.9c3.9,0,7.1,3.2,7.1,7.1l0,0l0,0 v0C19.1,15.9,15.9,19.1,12,19.1L12,19.1L12,19.1L12,19.1z M12,0L12,0C5.4,0,0,5.4,0,12s5.4,12,12,12s12-5.4,12-12l0,0 C24,5.4,18.6,0,12,0L12,0L12,0z"
            fill="currentColor"
          />
      </svg>
    </a>
  );
};

export default YouTubeLink;
