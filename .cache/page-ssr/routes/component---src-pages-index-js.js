exports.id = 293;
exports.ids = [293];
exports.modules = {

/***/ 3514:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var _interopRequireDefault=__webpack_require__(4994);exports.__esModule=true;exports.Link=void 0;var _extends2=_interopRequireDefault(__webpack_require__(4634));var _objectWithoutPropertiesLoose2=_interopRequireDefault(__webpack_require__(4893));var _react=_interopRequireWildcard(__webpack_require__(1799));var _i18nextContext=__webpack_require__(3064);var _gatsby=__webpack_require__(123);var _types=__webpack_require__(3773);var _excluded=["language","to","onClick"];function _getRequireWildcardCache(nodeInterop){if(typeof WeakMap!=="function")return null;var cacheBabelInterop=new WeakMap();var cacheNodeInterop=new WeakMap();return(_getRequireWildcardCache=function _getRequireWildcardCache(nodeInterop){return nodeInterop?cacheNodeInterop:cacheBabelInterop;})(nodeInterop);}function _interopRequireWildcard(obj,nodeInterop){if(!nodeInterop&&obj&&obj.__esModule){return obj;}if(obj===null||typeof obj!=="object"&&typeof obj!=="function"){return{default:obj};}var cache=_getRequireWildcardCache(nodeInterop);if(cache&&cache.has(obj)){return cache.get(obj);}var newObj={};var hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj){if(key!=="default"&&Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;if(desc&&(desc.get||desc.set)){Object.defineProperty(newObj,key,desc);}else{newObj[key]=obj[key];}}}newObj.default=obj;if(cache){cache.set(obj,newObj);}return newObj;}var Link=/*#__PURE__*/_react.default.forwardRef(function(_ref,ref){var language=_ref.language,to=_ref.to,_onClick=_ref.onClick,rest=(0,_objectWithoutPropertiesLoose2.default)(_ref,_excluded);var context=(0,_react.useContext)(_i18nextContext.I18nextContext);var urlLanguage=language||context.language;var getLanguagePath=function getLanguagePath(language){return context.generateDefaultLanguagePage||language!==context.defaultLanguage?"/"+language:'';};var link=""+getLanguagePath(urlLanguage)+to;return(/*#__PURE__*/// @ts-ignore
_react.default.createElement(_gatsby.Link,(0,_extends2.default)({},rest,{to:link,innerRef:ref,hrefLang:urlLanguage,onClick:function onClick(e){if(language){localStorage.setItem(_types.LANGUAGE_KEY,language);}if(_onClick){_onClick(e);}}})));});exports.Link=Link;

/***/ }),

/***/ 9384:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
exports.__esModule=true;var _reactI18next=__webpack_require__(2389);Object.keys(_reactI18next).forEach(function(key){if(key==="default"||key==="__esModule")return;if(key in exports&&exports[key]===_reactI18next[key])return;exports[key]=_reactI18next[key];});var _i18nextContext=__webpack_require__(3064);Object.keys(_i18nextContext).forEach(function(key){if(key==="default"||key==="__esModule")return;if(key in exports&&exports[key]===_i18nextContext[key])return;exports[key]=_i18nextContext[key];});var _useI18next=__webpack_require__(2232);Object.keys(_useI18next).forEach(function(key){if(key==="default"||key==="__esModule")return;if(key in exports&&exports[key]===_useI18next[key])return;exports[key]=_useI18next[key];});var _Link=__webpack_require__(3514);Object.keys(_Link).forEach(function(key){if(key==="default"||key==="__esModule")return;if(key in exports&&exports[key]===_Link[key])return;exports[key]=_Link[key];});

/***/ }),

/***/ 2232:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var _interopRequireDefault=__webpack_require__(4994);exports.__esModule=true;exports.useI18next=void 0;var _extends2=_interopRequireDefault(__webpack_require__(4634));var _reactI18next=__webpack_require__(2389);var _react=__webpack_require__(1799);var _gatsby=__webpack_require__(123);var _i18nextContext=__webpack_require__(3064);var _types=__webpack_require__(3773);var useI18next=function useI18next(ns,options){var _useTranslation=(0,_reactI18next.useTranslation)(ns,options),i18n=_useTranslation.i18n,t=_useTranslation.t,ready=_useTranslation.ready;var context=(0,_react.useContext)(_i18nextContext.I18nextContext);var routed=context.routed,defaultLanguage=context.defaultLanguage,generateDefaultLanguagePage=context.generateDefaultLanguagePage;var getLanguagePath=function getLanguagePath(language){return generateDefaultLanguagePage||language!==defaultLanguage?"/"+language:'';};var removePrefix=function removePrefix(pathname){var base= true?"":0;if(base&&pathname.indexOf(base)===0){pathname=pathname.slice(base.length);}return pathname;};var removeLocalePart=function removeLocalePart(pathname){if(!routed)return pathname;var i=pathname.indexOf("/",1);return pathname.substring(i);};var navigate=function navigate(to,options){var languagePath=getLanguagePath(context.language);var link=routed?""+languagePath+to:""+to;return(0,_gatsby.navigate)(link,options);};var changeLanguage=function changeLanguage(language,to,options){var languagePath=getLanguagePath(language);var pathname=to||removeLocalePart(removePrefix(window.location.pathname));var link=""+languagePath+pathname+window.location.search;localStorage.setItem(_types.LANGUAGE_KEY,language);return(0,_gatsby.navigate)(link,options);};return(0,_extends2.default)({},context,{i18n:i18n,t:t,ready:ready,navigate:navigate,changeLanguage:changeLanguage});};exports.useI18next=useI18next;

/***/ }),

/***/ 4755:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(9384);

/***/ }),

/***/ 8017:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ IndexPage)
});

// EXTERNAL MODULE: external "/Users/johan/CRstudio/CRstudio/node_modules/react/index.js"
var index_js_ = __webpack_require__(1799);
var index_js_default = /*#__PURE__*/__webpack_require__.n(index_js_);
// EXTERNAL MODULE: ./node_modules/gatsby-plugin-react-i18next/index.js
var gatsby_plugin_react_i18next = __webpack_require__(4755);
// EXTERNAL MODULE: ./node_modules/react-helmet/es/Helmet.js
var Helmet = __webpack_require__(8154);
;// ./src/components/layout/Seo.js
// src/components/layout/Seo.js
function Seo(props){const{language,languages,originalPath}=(0,gatsby_plugin_react_i18next.useI18next)();const{t}=(0,gatsby_plugin_react_i18next.useTranslation)();const siteUrl="https://crstudio.online";const title=t("seo.title");const description=t("seo.description");const canonicalUrl=`${siteUrl}/${language}${originalPath}`;const ogImage=`${siteUrl}/default-og-image.jpg`;const fonts=["inter-v18-latin-regular"// "montserrat-v29-latin-regular",
// "open-sans-v40-latin-regular",
// "roboto-v47-latin-regular",
];return/*#__PURE__*/index_js_default().createElement(Helmet.Helmet,null,/*#__PURE__*/index_js_default().createElement("html",{lang:language}),/*#__PURE__*/index_js_default().createElement("title",null,title),/*#__PURE__*/index_js_default().createElement("meta",{name:"description",content:description}),/*#__PURE__*/index_js_default().createElement("meta",{name:"robots",content:"index, follow"}),/*#__PURE__*/index_js_default().createElement("link",{rel:"canonical",href:canonicalUrl}),/*#__PURE__*/index_js_default().createElement("meta",{name:"google",content:"notranslate"}),/*#__PURE__*/index_js_default().createElement("meta",{property:"og:title",content:title}),/*#__PURE__*/index_js_default().createElement("meta",{property:"og:description",content:description}),/*#__PURE__*/index_js_default().createElement("meta",{property:"og:url",content:canonicalUrl}),/*#__PURE__*/index_js_default().createElement("meta",{property:"og:locale",content:`${language}_${language.toUpperCase()}`}),/*#__PURE__*/index_js_default().createElement("meta",{property:"og:image",content:ogImage}),/*#__PURE__*/index_js_default().createElement("meta",{property:"og:image:width",content:"1200"}),/*#__PURE__*/index_js_default().createElement("meta",{property:"og:image:height",content:"630"}),/*#__PURE__*/index_js_default().createElement("meta",{property:"og:type",content:"website"}),/*#__PURE__*/index_js_default().createElement("meta",{property:"og:site_name",content:"CRstudio"}),/*#__PURE__*/index_js_default().createElement("meta",{name:"twitter:title",content:title}),/*#__PURE__*/index_js_default().createElement("meta",{name:"twitter:description",content:description}),/*#__PURE__*/index_js_default().createElement("meta",{name:"twitter:url",content:canonicalUrl}),/*#__PURE__*/index_js_default().createElement("meta",{name:"twitter:image",content:ogImage}),/*#__PURE__*/index_js_default().createElement("meta",{name:"twitter:card",content:"summary_large_image"}),fonts.map(font=>/*#__PURE__*/index_js_default().createElement("link",{key:font,rel:"preload",href:`/fonts/${font}.woff2`,as:"font",type:"font/woff2",crossOrigin:"anonymous"})),languages.map(lang=>/*#__PURE__*/index_js_default().createElement("link",{key:lang,rel:"alternate",hrefLang:lang,href:`${siteUrl}/${lang}${originalPath}`})),/*#__PURE__*/index_js_default().createElement("link",{rel:"icon",href:"/content/images/icons/favicon.svg",type:"image/svg+xml"}),/*#__PURE__*/index_js_default().createElement("link",{rel:"icon",href:"/content/images/icons/favicon.ico",sizes:"any"}),/*#__PURE__*/index_js_default().createElement("link",{rel:"icon",type:"image/png",sizes:"16x16",href:"/content/images/icons/favicon-16x16.png"}),/*#__PURE__*/index_js_default().createElement("link",{rel:"icon",type:"image/png",sizes:"32x32",href:"/content/images/icons/favicon-32x32.png"}),/*#__PURE__*/index_js_default().createElement("link",{rel:"icon",type:"image/png",sizes:"180x180",href:"/content/images/icons/favicon-180x180.png"}),/*#__PURE__*/index_js_default().createElement("link",{rel:"icon",type:"image/png",sizes:"192x192",href:"/content/images/icons/favicon-192x192.png"}),/*#__PURE__*/index_js_default().createElement("link",{rel:"icon",type:"image/png",sizes:"512x512",href:"/content/images/icons/favicon-512x512.png"}),/*#__PURE__*/index_js_default().createElement("link",{rel:"apple-touch-icon",sizes:"180x180",href:"/content/images/icons/apple-touch-icon.png"}));}
;// ./src/pages/index.js
// src/pages/index.js :
// >>> PAGE COMPONENT <<<
function IndexPage(){const{t}=(0,gatsby_plugin_react_i18next.useTranslation)();return/*#__PURE__*/index_js_default().createElement((index_js_default()).Fragment,null,/*#__PURE__*/index_js_default().createElement(Seo,null),/*#__PURE__*/index_js_default().createElement("main",null,/*#__PURE__*/index_js_default().createElement("h1",null,t("welcome_message")),/*#__PURE__*/index_js_default().createElement("p",null,t("description"))));}// >>> GATSBY-PLUGIN-REACT-I18NEXT QUERY <<<
const query="2059891297";

/***/ }),

/***/ 4893:
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