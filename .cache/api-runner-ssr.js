var plugins = [{
      name: 'gatsby-plugin-image',
      plugin: require('/Users/johan/CRstudio/CRstudio/node_modules/gatsby-plugin-image/gatsby-ssr.js'),
      options: {"plugins":[]},
    },{
      name: 'gatsby-plugin-react-helmet',
      plugin: require('/Users/johan/CRstudio/CRstudio/node_modules/gatsby-plugin-react-helmet/gatsby-ssr.js'),
      options: {"plugins":[]},
    },{
      name: 'gatsby-plugin-react-i18next',
      plugin: require('/Users/johan/CRstudio/CRstudio/node_modules/gatsby-plugin-react-i18next/gatsby-ssr.js'),
      options: {"plugins":[],"localeJsonSourceName":"locales","languages":["en","fr","nl","zu"],"defaultLanguage":"zu","siteUrl":"https://crstudio.online","i18nextOptions":{"interpolation":{"escapeValue":false},"detection":{"order":["path","htmlTag","cookie","navigator"],"caches":["cookie"]},"fallbackLng":"zu","backend":{"loadPath":"/Users/johan/CRstudio/CRstudio/src/locales/{{lng}}/{{ns}}.json"}},"pages":[{"matchPath":"/:lang/:rest*","getLanguageFromPath":true}]},
    },{
      name: 'gatsby-plugin-sitemap',
      plugin: require('/Users/johan/CRstudio/CRstudio/node_modules/gatsby-plugin-sitemap/gatsby-ssr.js'),
      options: {"plugins":[],"output":"/sitemap.xml","excludes":["/admin/*","/drafts/*","/preview/*","/private/*"],"createLinkInHead":true,"entryLimit":45000,"query":"{ site { siteMetadata { siteUrl } } allSitePage { nodes { path } } }"},
    },{
      name: 'gatsby-plugin-manifest',
      plugin: require('/Users/johan/CRstudio/CRstudio/node_modules/gatsby-plugin-manifest/gatsby-ssr.js'),
      options: {"plugins":[],"name":"Catalogue Raisonné","short_name":"CR","start_url":"/","background_color":"#ffffff","theme_color":"#663399","display":"standalone","icon":"content/images/icons/favicon-512x512.png","legacy":true,"theme_color_in_head":true,"cache_busting_mode":"query","crossOrigin":"anonymous","include_favicon":true,"cacheDigest":"25fcdfc9b3ec1ab58885bcc31da4342e"},
    },{
      name: 'partytown',
      plugin: require('/Users/johan/CRstudio/CRstudio/node_modules/gatsby/dist/internal-plugins/partytown/gatsby-ssr.js'),
      options: {"plugins":[]},
    }]
/* global plugins */
// During bootstrap, we write requires at top of this file which looks like:
// var plugins = [
//   {
//     plugin: require("/path/to/plugin1/gatsby-ssr.js"),
//     options: { ... },
//   },
//   {
//     plugin: require("/path/to/plugin2/gatsby-ssr.js"),
//     options: { ... },
//   },
// ]

const apis = require(`./api-ssr-docs`)

function augmentErrorWithPlugin(plugin, err) {
  if (plugin.name !== `default-site-plugin`) {
    // default-site-plugin is user code and will print proper stack trace,
    // so no point in annotating error message pointing out which plugin is root of the problem
    err.message += ` (from plugin: ${plugin.name})`
  }

  throw err
}

export function apiRunner(api, args, defaultReturn, argTransform) {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  const results = []
  plugins.forEach(plugin => {
    const apiFn = plugin.plugin[api]
    if (!apiFn) {
      return
    }

    try {
      const result = apiFn(args, plugin.options)

      if (result && argTransform) {
        args = argTransform({ args, result })
      }

      // This if case keeps behaviour as before, we should allow undefined here as the api is defined
      // TODO V4
      if (typeof result !== `undefined`) {
        results.push(result)
      }
    } catch (e) {
      augmentErrorWithPlugin(plugin, e)
    }
  })

  return results.length ? results : [defaultReturn]
}

export async function apiRunnerAsync(api, args, defaultReturn, argTransform) {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  const results = []
  for (const plugin of plugins) {
    const apiFn = plugin.plugin[api]
    if (!apiFn) {
      continue
    }

    try {
      const result = await apiFn(args, plugin.options)

      if (result && argTransform) {
        args = argTransform({ args, result })
      }

      // This if case keeps behaviour as before, we should allow undefined here as the api is defined
      // TODO V4
      if (typeof result !== `undefined`) {
        results.push(result)
      }
    } catch (e) {
      augmentErrorWithPlugin(plugin, e)
    }
  }

  return results.length ? results : [defaultReturn]
}
