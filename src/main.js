import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Fragment from 'vue-fragment'
// import VueRulerTool from 'vue-ruler-tool'
import * as echarts from "echarts";

Vue.prototype.$echarts = echarts;

Vue.use(Fragment.Plugin)
Vue.config.productionTip = false

// Vue.component('vue-ruler-tool', VueRulerTool)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
