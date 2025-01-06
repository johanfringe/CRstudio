import React from "react";

const FacebookLink = () => {
  return (
    <a
      href="https://facebook.com"
      className="text-gray-800 hover:text-gray-600"
      aria-label="Facebook"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-6 h-6"
        fill="currentColor"
      >
          <circle cx="13.6" cy="12.3" r="9" fill="white" />
          <path d="M12,0C5.4,0,0,5.4,0,12s5.4,12,12,12s12-5.4,12-12S18.6,0,12,0z M15.6,11.5h-2.1v7h-3v-7h-2v-2h2V8.3 c0-1.1,0.4-2.8,2.6-2.8h2.4v2.3h-1.4c-0.2,0-0.6,0.1-0.6,0.7v1h2.3L15.6,11.5z" />
      </svg>
    </a>
  );
};

export default FacebookLink;
