import React from "react";

const WeChatLink = () => {
  return (
    <a
      href="https://www.wechat.com"
      className="text-gray-800 hover:text-gray-600"
      aria-label="WeChat"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-6 h-6"
        fill="currentColor"
      >
          <circle cx="12" cy="12.9" r="8.5" fill="currentColor" />
          <path
            d="M12,0c6.6,0,12,5.4,12,12s-5.4,12-12,12S0,18.6,0,12S5.4,0,12,0z M14.2,10.2c2,0,3.8,1.5,3.8,3.3
            c0,1-0.7,1.9-1.6,2.6l0.3,1.1l-1.2-0.7c-0.4,0.1-0.9,0.2-1.4,0.2c-2.1,0-3.8-1.5-3.8-3.3C10.3,11.7,12,10.2,14.2,10.2z M9.8,6.8
            c2.2,0,4.2,1.4,4.6,3.2c-0.1,0-0.3,0-0.4,0c-2.1,0-3.8,1.6-3.8,3.6c0,0.3,0.1,0.7,0.1,1c-0.1,0-0.3,0-0.4,0c-0.6,0-1-0.1-1.6-0.2
            l-1.6,0.8l0.5-1.4c-1.1-0.8-1.8-1.8-1.8-3.1C5.2,8.5,7.3,6.8,9.8,6.8L9.8,6.8z M12.9,12c-0.2,0-0.5,0.2-0.5,0.5
            c0,0.2,0.2,0.5,0.5,0.5c0.3,0,0.6-0.2,0.6-0.5C13.5,12.2,13.3,12,12.9,12z M15.4,12c-0.2,0-0.4,0.2-0.4,0.5c0,0.2,0.2,0.5,0.4,0.5
            c0.3,0,0.6-0.2,0.6-0.5C16,12.2,15.7,12,15.4,12z M11.5,8.7c-0.3,0-0.7,0.2-0.7,0.6c0,0.3,0.3,0.6,0.7,0.6c0.3,0,0.6-0.2,0.6-0.6
            C12,8.9,11.8,8.7,11.5,8.7z M8.3,8.7C8,8.7,7.6,8.9,7.6,9.3c0,0.3,0.3,0.6,0.7,0.6c0.3,0,0.6-0.2,0.6-0.6C8.9,8.9,8.6,8.7,8.3,8.7z"
            fill="white"
          />
      </svg>
    </a>
  );
};

export default WeChatLink;
