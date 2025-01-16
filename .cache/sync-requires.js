
// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---cache-dev-404-page-js": preferDefault(require("/Users/johan/CRstudio/CRstudio/.cache/dev-404-page.js")),
  "component---src-pages-index-js": preferDefault(require("/Users/johan/CRstudio/CRstudio/src/pages/index.js"))
}

