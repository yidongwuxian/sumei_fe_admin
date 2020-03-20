import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'

import '@/icons' // icon
import '@/permission' // permission control
//VueQuillEditor start
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
  
 Vue.use(VueQuillEditor)
//VueQuillEditor end
// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.use(ElementUI, { locale })
//设置 Vue.config.productionTip = false 来关闭生产模式下给出的提示
Vue.config.productionTip = false

Vue.prototype.$axios = axios;

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
