exports.id = "component---src-pages-index-js";
exports.ids = ["component---src-pages-index-js"];
exports.modules = {

/***/ "./node_modules/gatsby-plugin-react-i18next/dist/Link.js":
/*!***************************************************************!*\
  !*** ./node_modules/gatsby-plugin-react-i18next/dist/Link.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
exports.__esModule = true;
exports.Link = void 0;
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/extends.js"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/objectWithoutPropertiesLoose */ "./node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _i18nextContext = __webpack_require__(/*! ./i18nextContext */ "./node_modules/gatsby-plugin-react-i18next/dist/i18nextContext.js");
var _gatsby = __webpack_require__(/*! gatsby */ "./.cache/gatsby-browser-entry.js");
var _types = __webpack_require__(/*! ./types */ "./node_modules/gatsby-plugin-react-i18next/dist/types.js");
var _excluded = ["language", "to", "onClick"];
function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}
var Link = /*#__PURE__*/_react.default.forwardRef(function (_ref, ref) {
  var language = _ref.language,
    to = _ref.to,
    _onClick = _ref.onClick,
    rest = (0, _objectWithoutPropertiesLoose2.default)(_ref, _excluded);
  var context = (0, _react.useContext)(_i18nextContext.I18nextContext);
  var urlLanguage = language || context.language;
  var getLanguagePath = function getLanguagePath(language) {
    return context.generateDefaultLanguagePage || language !== context.defaultLanguage ? "/" + language : '';
  };
  var link = "" + getLanguagePath(urlLanguage) + to;
  return (/*#__PURE__*/
    // @ts-ignore
    _react.default.createElement(_gatsby.Link, (0, _extends2.default)({}, rest, {
      to: link,
      innerRef: ref,
      hrefLang: urlLanguage,
      onClick: function onClick(e) {
        if (language) {
          localStorage.setItem(_types.LANGUAGE_KEY, language);
        }
        if (_onClick) {
          _onClick(e);
        }
      }
    }))
  );
});
exports.Link = Link;

/***/ }),

/***/ "./node_modules/gatsby-plugin-react-i18next/dist/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/gatsby-plugin-react-i18next/dist/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


exports.__esModule = true;
var _reactI18next = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/index.js");
Object.keys(_reactI18next).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _reactI18next[key]) return;
  exports[key] = _reactI18next[key];
});
var _i18nextContext = __webpack_require__(/*! ./i18nextContext */ "./node_modules/gatsby-plugin-react-i18next/dist/i18nextContext.js");
Object.keys(_i18nextContext).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _i18nextContext[key]) return;
  exports[key] = _i18nextContext[key];
});
var _useI18next = __webpack_require__(/*! ./useI18next */ "./node_modules/gatsby-plugin-react-i18next/dist/useI18next.js");
Object.keys(_useI18next).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useI18next[key]) return;
  exports[key] = _useI18next[key];
});
var _Link = __webpack_require__(/*! ./Link */ "./node_modules/gatsby-plugin-react-i18next/dist/Link.js");
Object.keys(_Link).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Link[key]) return;
  exports[key] = _Link[key];
});

/***/ }),

/***/ "./node_modules/gatsby-plugin-react-i18next/dist/useI18next.js":
/*!*********************************************************************!*\
  !*** ./node_modules/gatsby-plugin-react-i18next/dist/useI18next.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");
exports.__esModule = true;
exports.useI18next = void 0;
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/extends.js"));
var _reactI18next = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/index.js");
var _react = __webpack_require__(/*! react */ "react");
var _gatsby = __webpack_require__(/*! gatsby */ "./.cache/gatsby-browser-entry.js");
var _i18nextContext = __webpack_require__(/*! ./i18nextContext */ "./node_modules/gatsby-plugin-react-i18next/dist/i18nextContext.js");
var _types = __webpack_require__(/*! ./types */ "./node_modules/gatsby-plugin-react-i18next/dist/types.js");
var useI18next = function useI18next(ns, options) {
  var _useTranslation = (0, _reactI18next.useTranslation)(ns, options),
    i18n = _useTranslation.i18n,
    t = _useTranslation.t,
    ready = _useTranslation.ready;
  var context = (0, _react.useContext)(_i18nextContext.I18nextContext);
  var routed = context.routed,
    defaultLanguage = context.defaultLanguage,
    generateDefaultLanguagePage = context.generateDefaultLanguagePage;
  var getLanguagePath = function getLanguagePath(language) {
    return generateDefaultLanguagePage || language !== defaultLanguage ? "/" + language : '';
  };
  var removePrefix = function removePrefix(pathname) {
    var base =  true ? "" : 0;
    if (base && pathname.indexOf(base) === 0) {
      pathname = pathname.slice(base.length);
    }
    return pathname;
  };
  var removeLocalePart = function removeLocalePart(pathname) {
    if (!routed) return pathname;
    var i = pathname.indexOf("/", 1);
    return pathname.substring(i);
  };
  var navigate = function navigate(to, options) {
    var languagePath = getLanguagePath(context.language);
    var link = routed ? "" + languagePath + to : "" + to;
    return (0, _gatsby.navigate)(link, options);
  };
  var changeLanguage = function changeLanguage(language, to, options) {
    var languagePath = getLanguagePath(language);
    var pathname = to || removeLocalePart(removePrefix(window.location.pathname));
    var link = "" + languagePath + pathname + window.location.search;
    localStorage.setItem(_types.LANGUAGE_KEY, language);
    return (0, _gatsby.navigate)(link, options);
  };
  return (0, _extends2.default)({}, context, {
    i18n: i18n,
    t: t,
    ready: ready,
    navigate: navigate,
    changeLanguage: changeLanguage
  });
};
exports.useI18next = useI18next;

/***/ }),

/***/ "./node_modules/gatsby-plugin-react-i18next/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/gatsby-plugin-react-i18next/index.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./dist */ "./node_modules/gatsby-plugin-react-i18next/dist/index.js");

/***/ }),

/***/ "./src/components/layout/Seo.js":
/*!**************************************!*\
  !*** ./src/components/layout/Seo.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Seo)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-helmet */ "./node_modules/react-helmet/es/Helmet.js");
/* harmony import */ var gatsby_plugin_react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! gatsby-plugin-react-i18next */ "./node_modules/gatsby-plugin-react-i18next/index.js");
/* harmony import */ var gatsby_plugin_react_i18next__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(gatsby_plugin_react_i18next__WEBPACK_IMPORTED_MODULE_2__);
// src/components/layout/Seo.js



function Seo(props) {
  const {
    language,
    languages,
    originalPath
  } = (0,gatsby_plugin_react_i18next__WEBPACK_IMPORTED_MODULE_2__.useI18next)();
  const {
    t
  } = (0,gatsby_plugin_react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
  const siteUrl = "https://crstudio.online";
  const title = t("seo.title");
  const description = t("seo.description");
  const canonicalUrl = `${siteUrl}/${language}${originalPath}`;
  const ogImage = `${siteUrl}/icons/default-og-image.jpg`;
  const fonts = ["inter-v18-latin-regular"
  // "montserrat-v29-latin-regular",
  // "open-sans-v40-latin-regular",
  // "roboto-v47-latin-regular",
  ];
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_helmet__WEBPACK_IMPORTED_MODULE_1__.Helmet, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("html", {
    lang: language
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("title", null, title), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    name: "description",
    content: description
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    name: "robots",
    content: "index, follow"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("link", {
    rel: "canonical",
    href: canonicalUrl
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    name: "google",
    content: "notranslate"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    property: "og:title",
    content: title
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    property: "og:description",
    content: description
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    property: "og:url",
    content: canonicalUrl
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    property: "og:locale",
    content: `${language}_${language.toUpperCase()}`
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    property: "og:image",
    content: ogImage
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    property: "og:image:width",
    content: "1200"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    property: "og:image:height",
    content: "630"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    property: "og:type",
    content: "website"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    property: "og:site_name",
    content: "CRstudio"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    name: "twitter:title",
    content: title
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    name: "twitter:description",
    content: description
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    name: "twitter:url",
    content: canonicalUrl
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    name: "twitter:image",
    content: ogImage
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    name: "twitter:card",
    content: "summary_large_image"
  }), fonts.map(font => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("link", {
    key: font,
    rel: "preload",
    href: `/fonts/${font}.woff2`,
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous"
  })), languages.map(lang => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("link", {
    key: lang,
    rel: "alternate",
    hrefLang: lang,
    href: `${siteUrl}/${lang}${originalPath}`
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("link", {
    rel: "icon",
    href: "/icons/favicon.svg",
    type: "image/svg+xml"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("link", {
    rel: "icon",
    href: "/icons/favicon.ico",
    sizes: "any"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("link", {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/icons/favicon-16x16.png"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("link", {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/icons/favicon-32x32.png"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("link", {
    rel: "icon",
    type: "image/png",
    sizes: "180x180",
    href: "/icons/favicon-180x180.png"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("link", {
    rel: "icon",
    type: "image/png",
    sizes: "192x192",
    href: "/icons/favicon-192x192.png"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("link", {
    rel: "icon",
    type: "image/png",
    sizes: "512x512",
    href: "/icons/favicon-512x512.png"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("link", {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/icons/apple-touch-icon.png"
  }));
}

/***/ }),

/***/ "./src/pages/index.js?export=default":
/*!*******************************************!*\
  !*** ./src/pages/index.js?export=default ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ IndexPage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var gatsby_plugin_react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gatsby-plugin-react-i18next */ "./node_modules/gatsby-plugin-react-i18next/index.js");
/* harmony import */ var gatsby_plugin_react_i18next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(gatsby_plugin_react_i18next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_layout_Seo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/layout/Seo */ "./src/components/layout/Seo.js");
// src/pages/index.js :





// >>> PAGE COMPONENT <<<
function IndexPage() {
  const {
    t
  } = (0,gatsby_plugin_react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_layout_Seo__WEBPACK_IMPORTED_MODULE_2__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("main", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", null, t("welcome_message")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, t("description"))));
}

// >>> GATSBY-PLUGIN-REACT-I18NEXT QUERY <<<
const query = "2059891297";

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js ***!
  \*****************************************************************************/
/***/ ((module) => {

function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (e.includes(n)) continue;
    t[n] = r[n];
  }
  return t;
}
module.exports = _objectWithoutPropertiesLoose, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ })

};
;
//# sourceMappingURL=component---src-pages-index-js.js.map