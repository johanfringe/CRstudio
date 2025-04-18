module.exports = [{
      plugin: require('../node_modules/@sentry/gatsby/gatsby-browser.js'),
      options: {"plugins":[],"dsn":"https://86312fc3076242b523789d67dd8ebdeb@o4508861802872832.ingest.de.sentry.io/4508861808443472","environment":"development","tracesSampleRate":0.1,"debug":true,"release":"dev-local","sourceMapsUploadOptions":{"include":["./public","./.cache"],"ignore":["node_modules",".cache/dev-404-page"],"validate":true,"rewrite":true}},
    },{
      plugin: require('../node_modules/gatsby-plugin-react-i18next/gatsby-browser.js'),
      options: {"plugins":[],"localeJsonSourceName":"locales","languages":["en","fr","nl"],"fallbackLanguage":"en","defaultLanguage":"","siteUrl":"http://localhost:8000","i18nextOptions":{"fallbackLng":"en","supportedLngs":["en","fr","nl"],"interpolation":{"escapeValue":false},"detection":{"order":["path","htmlTag","cookie","navigator"],"caches":["cookie"]}},"redirect":true},
    },{
      plugin: require('../node_modules/gatsby-plugin-manifest/gatsby-browser.js'),
      options: {"plugins":[],"name":"Catalogue Raisonné","short_name":"CR","start_url":"/","background_color":"#ffffff","theme_color":"#663399","display":"standalone","icon":"static/icons/favicon-512x512.png","legacy":true,"theme_color_in_head":true,"cache_busting_mode":"query","crossOrigin":"anonymous","include_favicon":true,"cacheDigest":"25fcdfc9b3ec1ab58885bcc31da4342e"},
    },{
      plugin: require('../gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby/dist/internal-plugins/partytown/gatsby-browser.js'),
      options: {"plugins":[]},
    }]
