import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Fragment from 'vue-fragment'
// import VueRulerTool from 'vue-ruler-tool'
import * as echarts from "echarts";
import BrowserZoomCorrect from "@/util/scal";

import '@/icons'
import animated from 'animate.css'
Vue.use(animated)

Vue.prototype.$echarts = echarts;

Vue.use(Fragment.Plugin)
Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
  const whiteList = ["/ppt", '/map'];
  if (whiteList.indexOf(to.fullPath) !== -1) {
    new BrowserZoomCorrect().init();
  }
  next()
})
// Vue.component('vue-ruler-tool', VueRulerTool)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
