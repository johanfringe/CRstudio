
// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---cache-dev-404-page-js": preferDefault(require("/Users/johan/CRstudio/CRstudio/.cache/dev-404-page.js")),
  "component---src-pages-404-js": preferDefault(require("/Users/johan/CRstudio/CRstudio/src/pages/404.js")),
  "component---src-pages-admin-js": preferDefault(require("/Users/johan/CRstudio/CRstudio/src/pages/admin.js")),
  "component---src-pages-demo-js": preferDefault(require("/Users/johan/CRstudio/CRstudio/src/pages/demo.js")),
  "component---src-pages-index-js": preferDefault(require("/Users/johan/CRstudio/CRstudio/src/pages/index.js"))
}

