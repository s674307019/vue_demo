import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store' // vuex-状态管理

import Axios from 'axios'
Vue.prototype.$http=Axios // 在vue原型链上使用Axios
Vue.prototype.$URL='http://192.168.0.29:8000/' // 定义请求地址(域名)

import wx from 'weixin-js-sdk'
Vue.prototype.$wx=wx


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
