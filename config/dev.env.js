'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //API_BASEURL: '"https://api.devsumeihome.com/"'
  API_BASEURL: '"https://testapi2.sumeihome.com/"'
})
  