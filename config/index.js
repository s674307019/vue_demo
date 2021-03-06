'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: { // 设置跨域代理
      // '/apiBaiDuMap':{
      //     target:'http://api.map.baidu.com/geocoder/v2/',
      //     changeOrigin:true,
      //     pathRewrite:{
      //         '^/apiBaiDuMap': '/'
      //     }
      // }
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 1000, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'), // 指定index.html打包之后的存放路径

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'), // 指定webpack的入口文件打包之后存放地址
    assetsSubDirectory: 'static', // 指定webpack的入口文件打包之后存放地址的子路径
    assetsPublicPath: './', // 这个就是静态文件的引用前缀

    /**
     * Source Maps
     */

    productionSourceMap: false, // 默认情况是true（true代表打包生成.map文件；false代表打包不生成.map文件）
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
