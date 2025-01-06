exports.id = "component---src-pages-index-js";
exports.ids = ["component---src-pages-index-js"];
exports.modules = {

/***/ "./src/components/Brand.js":
/*!*********************************!*\
  !*** ./src/components/Brand.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var gatsby__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gatsby */ "./.cache/gatsby-browser-entry.js");


const Brand = () => {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link, {
    to: "/",
    className: "text-4xl font-roboto tracking-wide"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("b", null, "CR"), "studio");
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Brand);

/***/ }),

/***/ "./src/components/Footer.js":
/*!**********************************!*\
  !*** ./src/components/Footer.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _public_page_data_sq_d_2089510249_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../public/page-data/sq/d/2089510249.json */ "./public/page-data/sq/d/2089510249.json");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _context_LanguageProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../context/LanguageProvider */ "./src/context/LanguageProvider.js");
/* harmony import */ var _socialslinks_InstagramLink__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./socialslinks/InstagramLink */ "./src/components/socialslinks/InstagramLink.js");
/* harmony import */ var _socialslinks_FacebookLink__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./socialslinks/FacebookLink */ "./src/components/socialslinks/FacebookLink.js");
/* harmony import */ var _socialslinks_LinkedInLink__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./socialslinks/LinkedInLink */ "./src/components/socialslinks/LinkedInLink.js");
/* harmony import */ var _socialslinks_TikTokLink__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./socialslinks/TikTokLink */ "./src/components/socialslinks/TikTokLink.js");
/* harmony import */ var _socialslinks_WeChatLink__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./socialslinks/WeChatLink */ "./src/components/socialslinks/WeChatLink.js");
/* harmony import */ var _socialslinks_XLink__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./socialslinks/XLink */ "./src/components/socialslinks/XLink.js");
/* harmony import */ var _socialslinks_YouTubeLink__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./socialslinks/YouTubeLink */ "./src/components/socialslinks/YouTubeLink.js");










const Footer = () => {
  const {
    language
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(_context_LanguageProvider__WEBPACK_IMPORTED_MODULE_2__.LanguageContext);
  const data = _public_page_data_sq_d_2089510249_json__WEBPACK_IMPORTED_MODULE_0__.data;

  // Dynamische inhoud gebaseerd op de taal
  const content = data.allLanguagesJson.nodes.find(node => node.parent.name === language) || data.allLanguagesJson.nodes.find(node => node.parent.name === "en"); // Fallback naar Engels

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("footer", {
    className: "bg-gray-100 text-gray-600 py-6 px-3 md:px-5 lg:px-7"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "container mx-auto flex flex-col md:flex-row items-center justify-between"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("p", {
    className: "text-sm font-roboto text-center md:text-left"
  }, "\xA9 2025 CRstudio BV"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "flex space-x-6 mt-4 md:mt-0"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("a", {
    href: "/partners",
    className: "footer-link"
  }, content.footer.links.partners), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("a", {
    href: "/cookies",
    className: "footer-link"
  }, content.footer.links.cookies), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("a", {
    href: "/legal",
    className: "footer-link"
  }, content.footer.links.legal)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "flex space-x-4 mt-4 md:mt-0"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_socialslinks_InstagramLink__WEBPACK_IMPORTED_MODULE_3__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_socialslinks_FacebookLink__WEBPACK_IMPORTED_MODULE_4__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_socialslinks_LinkedInLink__WEBPACK_IMPORTED_MODULE_5__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_socialslinks_TikTokLink__WEBPACK_IMPORTED_MODULE_6__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_socialslinks_WeChatLink__WEBPACK_IMPORTED_MODULE_7__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_socialslinks_XLink__WEBPACK_IMPORTED_MODULE_8__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_socialslinks_YouTubeLink__WEBPACK_IMPORTED_MODULE_9__["default"], null))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Footer);

/***/ }),

/***/ "./src/components/Header.js":
/*!**********************************!*\
  !*** ./src/components/Header.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _public_page_data_sq_d_3791503632_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../public/page-data/sq/d/3791503632.json */ "./public/page-data/sq/d/3791503632.json");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _context_LanguageProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../context/LanguageProvider */ "./src/context/LanguageProvider.js");
/* harmony import */ var _Brand__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Brand */ "./src/components/Brand.js");
/* harmony import */ var _config_languages__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../config/languages */ "./src/config/languages.js");




 // Importeer talenconfiguratie

const Header = () => {
  const {
    0: isOpen,
    1: setIsOpen
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false); // Hamburger menu state
  const {
    0: dropdownOpen,
    1: setDropdownOpen
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false); // Dropdown menu state
  const {
    language,
    switchLanguage
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(_context_LanguageProvider__WEBPACK_IMPORTED_MODULE_2__.LanguageContext);
  const data = _public_page_data_sq_d_3791503632_json__WEBPACK_IMPORTED_MODULE_0__.data;
  const content = data.allLanguagesJson.nodes.find(node => node.parent.name === language) || data.allLanguagesJson.nodes.find(node => node.parent.name === "en");
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("header", {
    className: "sticky top-0 bg-white z-50"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("nav", {
    className: "container mx-auto flex items-center justify-between p-4"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_Brand__WEBPACK_IMPORTED_MODULE_3__["default"], null)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "hidden md:flex items-center space-x-6"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("a", {
    href: "/demo",
    className: "nav-link"
  }, content.header.links.demo), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("a", {
    href: "/pricing",
    className: "nav-link"
  }, content.header.links.pricing), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("a", {
    href: "/contact",
    className: "nav-link"
  }, content.header.links.contact), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("a", {
    href: "/login",
    className: "nav-link"
  }, content.header.links.login), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "relative"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("button", {
    className: "flex items-center px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 font-roboto font-medium",
    onClick: () => setDropdownOpen(!dropdownOpen)
  }, (language || "SELECT").toLowerCase(), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("span", {
    style: {
      fontSize: "12px",
      marginLeft: "5px"
    }
  }, "\u25BC")), dropdownOpen && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "absolute mt-2 bg-white shadow-md rounded-md w-32"
  }, _config_languages__WEBPACK_IMPORTED_MODULE_4__["default"].map(lang => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("button", {
    key: lang.code,
    onClick: () => {
      switchLanguage(lang.code);
      setDropdownOpen(false); // Sluit dropdown na selectie
    },
    className: "block w-full text-left px-4 py-1 hover:bg-gray-100 font-roboto font-medium"
  }, lang.label)))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("a", {
    href: "/signup",
    className: "bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-roboto font-medium"
  }, content.header.links.signup)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("button", {
    className: "md:hidden text-4xl text-gray-700 hover:text-gray-900",
    onClick: () => setIsOpen(!isOpen),
    "aria-label": "Toggle Menu"
  }, "\u2630")), isOpen && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "md:hidden flex flex-col items-start space-y-2 px-4"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("a", {
    href: "/demo",
    className: "mobile-nav-link"
  }, content.header.links.demo), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("a", {
    href: "/pricing",
    className: "mobile-nav-link"
  }, content.header.links.pricing), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("a", {
    href: "/contact",
    className: "mobile-nav-link"
  }, content.header.links.contact), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("a", {
    href: "/login",
    className: "mobile-nav-link"
  }, content.header.links.login), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("a", {
    href: "/signup",
    className: "mobile-nav-link"
  }, content.header.links.signup)));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Header);

/***/ }),

/***/ "./src/components/Layout.js":
/*!**********************************!*\
  !*** ./src/components/Layout.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Header__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Header */ "./src/components/Header.js");
/* harmony import */ var _Footer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Footer */ "./src/components/Footer.js");
/* harmony import */ var _styles_global_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/global.css */ "./src/styles/global.css");
/* harmony import */ var _styles_global_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_global_css__WEBPACK_IMPORTED_MODULE_3__);




const Layout = ({
  children
}) => {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "flex flex-col min-h-screen"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_Header__WEBPACK_IMPORTED_MODULE_1__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("main", {
    className: "flex-grow container mx-auto px-4 py-8"
  }, children), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_Footer__WEBPACK_IMPORTED_MODULE_2__["default"], null));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Layout);

/***/ }),

/***/ "./src/components/socialslinks/FacebookLink.js":
/*!*****************************************************!*\
  !*** ./src/components/socialslinks/FacebookLink.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const FacebookLink = () => {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    href: "https://facebook.com",
    className: "text-gray-800 hover:text-gray-600",
    "aria-label": "Facebook",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    className: "w-6 h-6",
    fill: "currentColor"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("circle", {
    cx: "13.6",
    cy: "12.3",
    r: "9",
    fill: "white"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M12,0C5.4,0,0,5.4,0,12s5.4,12,12,12s12-5.4,12-12S18.6,0,12,0z M15.6,11.5h-2.1v7h-3v-7h-2v-2h2V8.3 c0-1.1,0.4-2.8,2.6-2.8h2.4v2.3h-1.4c-0.2,0-0.6,0.1-0.6,0.7v1h2.3L15.6,11.5z"
  })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FacebookLink);

/***/ }),

/***/ "./src/components/socialslinks/InstagramLink.js":
/*!******************************************************!*\
  !*** ./src/components/socialslinks/InstagramLink.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const InstagramLink = () => {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    href: "https://instagram.com",
    className: "text-gray-800 hover:text-gray-600",
    "aria-label": "Instagram",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    version: "1.1",
    id: "Livello_1",
    xmlns: "http://www.w3.org/2000/svg",
    xmlnsXlink: "http://www.w3.org/1999/xlink",
    x: "0px",
    y: "0px",
    viewBox: "0 0 24 24",
    className: "w-6 h-6",
    style: {
      enableBackground: "new 0 0 24 24"
    },
    xmlSpace: "preserve",
    fill: "currentColor"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("style", {
    type: "text/css"
  }, ".st0{fill:#FFFFFF;}"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("circle", {
    className: "st0",
    cx: "12",
    cy: "12.9",
    r: "8.5"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M12,14.1c1.2,0,2.1-0.9,2.1-2.1c0-0.5-0.1-0.9-0.4-1.2c-0.4-0.5-1-0.9-1.7-0.9s-1.3,0.3-1.7,0.9C10,11.1,9.9,11.5,9.9,12C9.9,13.2,10.8,14.1,12,14.1z"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("polygon", {
    points: "16.6,9.4 16.6,7.7 16.6,7.4 16.3,7.4 14.6,7.4 14.6,9.4"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M15.3,12c0,1.8-1.5,3.3-3.3,3.3S8.7,13.8,8.7,12c0-0.4,0.1-0.9,0.2-1.2H7.2v4.9c0,0.6,0.5,1.1,1.1,1.1h7.3c0.6,0,1.1-0.5,1.1-1.1v-4.9H15C15.2,11.2,15.3,11.6,15.3,12z"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M12,0C5.4,0,0,5.4,0,12s5.4,12,12,12s12-5.4,12-12S18.6,0,12,0z M18,10.8v4.9c0,1.3-1,2.3-2.3,2.3H8.3C7,18,6,17,6,15.7v-4.9V8.3C6,7.1,7,6,8.3,6h7.3C17,6,18,7.1,18,8.3V10.8z"
  })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (InstagramLink);

/***/ }),

/***/ "./src/components/socialslinks/LinkedInLink.js":
/*!*****************************************************!*\
  !*** ./src/components/socialslinks/LinkedInLink.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const LinkedInLink = () => {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    href: "https://linkedin.com",
    className: "text-gray-800 hover:text-gray-600",
    "aria-label": "LinkedIn",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    className: "w-6 h-6"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M12,0C5.4,0,0,5.4,0,12s5.4,12,12,12s12-5.4,12-12S18.6,0,12,0z",
    fill: "currentColor"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("rect", {
    x: "6.1",
    y: "9.5",
    width: "2.4",
    height: "7.7",
    fill: "white"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M7.3,5.9c-0.9,0-1.5,0.6-1.5,1.3c0,0.7,0.6,1.3,1.4,1.3h0c0.9,0,1.5-0.6,1.5-1.3C8.7,6.4,8.2,5.9,7.3,5.9z",
    fill: "white"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M15.1,9.4c-1.4,0-2.2,0.8-2.4,1.3V9.5H10c0,0.6,0,7.7,0,7.7h2.7v-4.2c0-0.2,0-0.5,0.1-0.6 c0.2-0.5,0.6-0.9,1.3-0.9c0.9,0,1.4,0.7,1.4,1.8v4h2.7v-4.3C18.2,10.6,16.8,9.4,15.1,9.4z",
    fill: "white"
  })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LinkedInLink);

/***/ }),

/***/ "./src/components/socialslinks/TikTokLink.js":
/*!***************************************************!*\
  !*** ./src/components/socialslinks/TikTokLink.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const TikTokLink = () => {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    href: "https://tiktok.com",
    className: "text-gray-800 hover:text-gray-600",
    "aria-label": "TikTok",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    className: "w-6 h-6",
    fill: "currentColor"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("circle", {
    cx: "12",
    cy: "12",
    r: "12",
    fill: "currentColor"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M12.3,5.1c0.8,0,1.5,0,2.3,0c0,0.9,0.4,1.8,1,2.4l0,0c0.7,0.6,1.5,1,2.4,1l0,0v2.3c-0.9,0-1.7-0.2-2.5-0.6l0,0 c-0.4-0.2-0.7-0.4-1-0.6l0,0c0,1.7,0,3.4,0,5.1c0,0.9-0.3,1.6-0.8,2.3l0,0c-0.8,1.1-2,1.8-3.4,1.9h0c-0.1,0-0.1,0-0.2,0 c-0.8,0-1.6-0.2-2.2-0.6l0,0c-1.2-0.7-2-1.9-2.1-3.3l0,0c0-0.3,0-0.6,0-0.9c0.2-2.2,2.1-3.9,4.3-3.9c0.3,0,0.5,0,0.7,0.1l0,0 c0,0.9,0,1.7,0,2.6c-0.2-0.1-0.4-0.1-0.7-0.1c-0.9,0-1.6,0.6-1.9,1.3l0,0c-0.1,0.2-0.1,0.4-0.1,0.7c0,0.1,0,0.2,0,0.3l0,0 c0.2,0.9,1,1.7,1.9,1.7c0,0,0.1,0,0.1,0h0c0.7,0,1.3-0.4,1.6-0.9l0,0c0.1-0.2,0.2-0.4,0.2-0.6l0,0c0.1-1,0-2.1,0-3.1 C12.3,9.7,12.3,7.4,12.3,5.1L12.3,5.1z",
    fill: "white"
  })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TikTokLink);

/***/ }),

/***/ "./src/components/socialslinks/WeChatLink.js":
/*!***************************************************!*\
  !*** ./src/components/socialslinks/WeChatLink.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const WeChatLink = () => {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    href: "https://www.wechat.com",
    className: "text-gray-800 hover:text-gray-600",
    "aria-label": "WeChat",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    className: "w-6 h-6",
    fill: "currentColor"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("circle", {
    cx: "12",
    cy: "12.9",
    r: "8.5",
    fill: "currentColor"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M12,0c6.6,0,12,5.4,12,12s-5.4,12-12,12S0,18.6,0,12S5.4,0,12,0z M14.2,10.2c2,0,3.8,1.5,3.8,3.3 c0,1-0.7,1.9-1.6,2.6l0.3,1.1l-1.2-0.7c-0.4,0.1-0.9,0.2-1.4,0.2c-2.1,0-3.8-1.5-3.8-3.3C10.3,11.7,12,10.2,14.2,10.2z M9.8,6.8 c2.2,0,4.2,1.4,4.6,3.2c-0.1,0-0.3,0-0.4,0c-2.1,0-3.8,1.6-3.8,3.6c0,0.3,0.1,0.7,0.1,1c-0.1,0-0.3,0-0.4,0c-0.6,0-1-0.1-1.6-0.2 l-1.6,0.8l0.5-1.4c-1.1-0.8-1.8-1.8-1.8-3.1C5.2,8.5,7.3,6.8,9.8,6.8L9.8,6.8z M12.9,12c-0.2,0-0.5,0.2-0.5,0.5 c0,0.2,0.2,0.5,0.5,0.5c0.3,0,0.6-0.2,0.6-0.5C13.5,12.2,13.3,12,12.9,12z M15.4,12c-0.2,0-0.4,0.2-0.4,0.5c0,0.2,0.2,0.5,0.4,0.5 c0.3,0,0.6-0.2,0.6-0.5C16,12.2,15.7,12,15.4,12z M11.5,8.7c-0.3,0-0.7,0.2-0.7,0.6c0,0.3,0.3,0.6,0.7,0.6c0.3,0,0.6-0.2,0.6-0.6 C12,8.9,11.8,8.7,11.5,8.7z M8.3,8.7C8,8.7,7.6,8.9,7.6,9.3c0,0.3,0.3,0.6,0.7,0.6c0.3,0,0.6-0.2,0.6-0.6C8.9,8.9,8.6,8.7,8.3,8.7z",
    fill: "white"
  })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WeChatLink);

/***/ }),

/***/ "./src/components/socialslinks/XLink.js":
/*!**********************************************!*\
  !*** ./src/components/socialslinks/XLink.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const XLink = () => {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    href: "https://twitter.com",
    className: "text-gray-800 hover:text-gray-600",
    "aria-label": "X (formerly Twitter)",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    className: "w-6 h-6"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("circle", {
    cx: "12",
    cy: "12",
    r: "12",
    fill: "currentColor"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("g", {
    transform: "translate(52.390088,-25.058597)"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M-47.7,30.1l5.7,7.7l-5.8,6.2h1.3l5-5.4l4.1,5.4h4.4l-6-8.1l5.4-5.8h-1.3l-4.6,5l-3.8-5H-47.7z M-45.8,31h2l8.9,12h-2L-45.8,31z",
    fill: "white"
  }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (XLink);

/***/ }),

/***/ "./src/components/socialslinks/YouTubeLink.js":
/*!****************************************************!*\
  !*** ./src/components/socialslinks/YouTubeLink.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const YouTubeLink = () => {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    href: "https://youtube.com",
    className: "text-gray-800 hover:text-gray-600",
    "aria-label": "YouTube",
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    className: "w-6 h-6"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("circle", {
    cx: "13.3",
    cy: "12.6",
    r: "8.5",
    fill: "white"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M9.7,15.5V8.5l6.1,3.5L9.7,15.5z M12,5.8c-3.4,0-6.2,2.8-6.2,6.2s2.8,6.2,6.2,6.2c3.4,0,6.2-2.8,6.2-6.2l0,0 C18.2,8.6,15.4,5.8,12,5.8L12,5.8L12,5.8z M12,19.1L12,19.1c-3.9,0-7.1-3.2-7.1-7.1S8.1,4.9,12,4.9c3.9,0,7.1,3.2,7.1,7.1l0,0l0,0 v0C19.1,15.9,15.9,19.1,12,19.1L12,19.1L12,19.1L12,19.1z M12,0L12,0C5.4,0,0,5.4,0,12s5.4,12,12,12s12-5.4,12-12l0,0 C24,5.4,18.6,0,12,0L12,0L12,0z",
    fill: "currentColor"
  })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (YouTubeLink);

/***/ }),

/***/ "./src/config/languages.js":
/*!*********************************!*\
  !*** ./src/config/languages.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const languages = [{
  code: "da",
  label: "Dansk"
}, {
  code: "de",
  label: "Deutsch"
}, {
  code: "en",
  label: "English"
}, {
  code: "es",
  label: "Español"
}, {
  code: "fr",
  label: "Français"
}, {
  code: "it",
  label: "Italiano"
}, {
  code: "hu",
  label: "Magyar"
}, {
  code: "nl",
  label: "Nederlands"
}, {
  code: "pl",
  label: "Polski"
}, {
  code: "pt",
  label: "Português"
}, {
  code: "ro",
  label: "Română"
}, {
  code: "ru",
  label: "Русский"
}, {
  code: "sv",
  label: "Svenska"
}, {
  code: "tr",
  label: "Türkçe"
}, {
  code: "uk",
  label: "Українська"
}, {
  code: "cs",
  label: "Čeština"
}, {
  code: "el",
  label: "Ελληνικά"
}, {
  code: "ar",
  label: "العربية"
}, {
  code: "bn",
  label: "বাংলা"
}, {
  code: "hi",
  label: "हिंदी"
}, {
  code: "zh",
  label: "中文"
}, {
  code: "ja",
  label: "日本語"
}, {
  code: "ko",
  label: "한국어"
}, {
  code: "ur",
  label: "اُردُو"
}];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (languages);

/***/ }),

/***/ "./src/pages/index.js?export=default":
/*!*******************************************!*\
  !*** ./src/pages/index.js?export=default ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _context_LanguageProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../context/LanguageProvider */ "./src/context/LanguageProvider.js");
/* harmony import */ var _components_Layout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/Layout */ "./src/components/Layout.js");



const languages = [{
  code: "da",
  label: "Dansk"
}, {
  code: "de",
  label: "Deutsch"
}, {
  code: "en",
  label: "English"
}, {
  code: "es",
  label: "Español"
}, {
  code: "fr",
  label: "Français"
}, {
  code: "it",
  label: "Italiano"
}, {
  code: "hu",
  label: "Magyar"
}, {
  code: "nl",
  label: "Nederlands"
}, {
  code: "pl",
  label: "Polski"
}, {
  code: "pt",
  label: "Português"
}, {
  code: "ro",
  label: "Română"
}, {
  code: "ru",
  label: "Русский"
}, {
  code: "sv",
  label: "Svenska"
}, {
  code: "tr",
  label: "Türkçe"
}, {
  code: "uk",
  label: "Українська"
}, {
  code: "cs",
  label: "Čeština"
}, {
  code: "el",
  label: "Ελληνικά"
}, {
  code: "ar",
  label: "العربية"
}, {
  code: "bn",
  label: "বাংলা"
}, {
  code: "hi",
  label: "हिंदी"
}, {
  code: "zh",
  label: "中文"
}, {
  code: "ja",
  label: "日本語"
}, {
  code: "ko",
  label: "한국어"
}, {
  code: "ur",
  label: "اُردُو"
}];
const IndexPage = () => {
  const {
    language,
    switchLanguage
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_context_LanguageProvider__WEBPACK_IMPORTED_MODULE_1__.LanguageContext);
  if (!language) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("main", {
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f8ff"
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
        // Responsieve kolommen
        gap: "20px",
        // Ruimte tussen knoppen
        width: "80%",
        // Beperk de breedte van de grid-container
        maxWidth: "900px",
        // Maximaal 6 kolommen (150px x 6 = 900px)
        justifyContent: "center"
      }
    }, languages.map(({
      code,
      label
    }) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      key: code,
      onClick: () => switchLanguage(code),
      style: {
        backgroundColor: "#1D4ED8",
        color: "white",
        padding: "15px 15px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
        textAlign: "center"
      }
    }, label))));
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_Layout__WEBPACK_IMPORTED_MODULE_2__["default"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("section", {
    className: "text-center py-16 bg-gray-50"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "container mx-auto"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", {
    className: "text-4xl font-bold text-gray-800 mb-6"
  }, "Welcome to CRstudio"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
    className: "text-lg text-gray-600"
  }, "The selected language is:", " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "font-medium text-blue-600"
  }, language)))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (IndexPage);

/***/ }),

/***/ "./src/styles/global.css":
/*!*******************************!*\
  !*** ./src/styles/global.css ***!
  \*******************************/
/***/ (() => {



/***/ }),

/***/ "./public/page-data/sq/d/2089510249.json":
/*!***********************************************!*\
  !*** ./public/page-data/sq/d/2089510249.json ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"data":{"allLanguagesJson":{"nodes":[{"footer":{"links":{"partners":"Partners FR","cookies":"Cookies","legal":"Legal"}},"parent":{"name":"fr"}},{"footer":{"links":{"partners":"Partners NL","cookies":"Cookies","legal":"Legal"}},"parent":{"name":"nl"}},{"footer":{"links":{"partners":"Partners EN","cookies":"Cookies","legal":"Legal"}},"parent":{"name":"en"}}]}}}');

/***/ }),

/***/ "./public/page-data/sq/d/3791503632.json":
/*!***********************************************!*\
  !*** ./public/page-data/sq/d/3791503632.json ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"data":{"allLanguagesJson":{"nodes":[{"header":{"links":{"demo":"Demo FR","pricing":"Pricing","contact":"Contact","login":"Login","signup":"Essayer le Demo"}},"parent":{"name":"fr"}},{"header":{"links":{"demo":"Demo NL","pricing":"Pricing","contact":"Contact","login":"Inloggen","signup":"Probeer de Demo"}},"parent":{"name":"nl"}},{"header":{"links":{"demo":"Demo EN","pricing":"Pricing","contact":"Contact","login":"Login","signup":"Try the Demo"}},"parent":{"name":"en"}}]}}}');

/***/ })

};
;
//# sourceMappingURL=component---src-pages-index-js.js.map