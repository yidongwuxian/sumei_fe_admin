'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

function getSourchMap(env) {
  if (env === "production") {
    return config.build.productionSourceMap
  } else if (env === "test") {
    return config.test.testSourceMap
  } else {
    return config.dev.cssSourceMap
  }
}

module.exports = {
  loaders: utils.cssLoaders({
    // sourceMap: sourceMapEnabled,
    // extract: isProduction
    sourceMap: getSourchMap(process.env.NODE_ENV),
    extract: process.env.NODE_ENV === ('production'||'test')
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
