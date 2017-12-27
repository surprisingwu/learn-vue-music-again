import 'babel-polyfill'
import Vue from 'vue'
import router from './router'
import App from './App'

import 'common/stylus/index.styl'
import fastclick from 'fastclick'
fastclick.attach(document.body)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})