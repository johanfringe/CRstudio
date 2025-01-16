module.exports = [{
      plugin: require('../node_modules/gatsby-plugin-react-i18next/gatsby-browser.js'),
      options: {"plugins":[],"localeJsonSourceName":"locales","languages":["en","fr","nl","zu"],"defaultLanguage":"zu","siteUrl":"https://crstudio.online","i18nextOptions":{"interpolation":{"escapeValue":false},"detection":{"order":["path","htmlTag","cookie","navigator"],"caches":["cookie"]},"fallbackLng":"zu","backend":{"loadPath":"/Users/johan/CRstudio/CRstudio/src/locales/{{lng}}/{{ns}}.json"}},"pages":[{"matchPath":"/:lang/:rest*","getLanguageFromPath":true}]},
    },{
      plugin: require('../node_modules/gatsby-plugin-manifest/gatsby-browser.js'),
      options: {"plugins":[],"name":"Catalogue Raisonné","short_name":"CR","start_url":"/","background_color":"#ffffff","theme_color":"#663399","display":"standalone","icon":"content/images/icons/favicon-512x512.png","legacy":true,"theme_color_in_head":true,"cache_busting_mode":"query","crossOrigin":"anonymous","include_favicon":true,"cacheDigest":"25fcdfc9b3ec1ab58885bcc31da4342e"},
    },{
      plugin: require('../gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby/dist/internal-plugins/partytown/gatsby-browser.js'),
      options: {"plugins":[]},
    }]
