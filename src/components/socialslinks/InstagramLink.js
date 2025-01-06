import React from "react";

const InstagramLink = () => {
  return (
    <a
      href="https://instagram.com"
      className="text-gray-800 hover:text-gray-600"
      
      aria-label="Instagram"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg
        version="1.1"
        id="Livello_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 24 24"
        className="w-6 h-6"
        style={{ enableBackground: "new 0 0 24 24" }}
        xmlSpace="preserve"
        fill="currentColor"
      >
        <style type="text/css">
          {".st0{fill:#FFFFFF;}"}
        </style>
          <circle className="st0" cx="12" cy="12.9" r="8.5" />
          <path d="M12,14.1c1.2,0,2.1-0.9,2.1-2.1c0-0.5-0.1-0.9-0.4-1.2c-0.4-0.5-1-0.9-1.7-0.9s-1.3,0.3-1.7,0.9C10,11.1,9.9,11.5,9.9,12C9.9,13.2,10.8,14.1,12,14.1z" />
          <polygon points="16.6,9.4 16.6,7.7 16.6,7.4 16.3,7.4 14.6,7.4 14.6,9.4" />
          <path d="M15.3,12c0,1.8-1.5,3.3-3.3,3.3S8.7,13.8,8.7,12c0-0.4,0.1-0.9,0.2-1.2H7.2v4.9c0,0.6,0.5,1.1,1.1,1.1h7.3c0.6,0,1.1-0.5,1.1-1.1v-4.9H15C15.2,11.2,15.3,11.6,15.3,12z" />
          <path d="M12,0C5.4,0,0,5.4,0,12s5.4,12,12,12s12-5.4,12-12S18.6,0,12,0z M18,10.8v4.9c0,1.3-1,2.3-2.3,2.3H8.3C7,18,6,17,6,15.7v-4.9V8.3C6,7.1,7,6,8.3,6h7.3C17,6,18,7.1,18,8.3V10.8z" />
      </svg>
    </a>
  );
};

export default InstagramLink;
