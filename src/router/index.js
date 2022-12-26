import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Test from '../views/Test.vue'
import Ruler from '../views/Ruler.vue'
import Layout from '../views/Layout.vue'
import Ppt from '../views/Ppt.vue'
import Map from '../views/Map.vue'
import GisMap from '../views/GisMap.vue'
import Drag from '../views/Drag.vue'
import ParamsComponents from '../views/ParamsComponents.vue'
import XingkongPage from '../views/Xingkong.vue'
import SvgPage from '../views/SvgPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Drag',
    component: Drag,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/test/:id',
    name: 'Test',
    component: Test
  },
  {
    path: "/ruler",
    name: "Ruler",
    component: Ruler
  },
  {
    path: '/layout',
    name: 'Layout',
    component: Layout
  }, {
    path: '/ppt',
    name: 'ppt',
    component: Ppt
  }, {
    path: '/map',
    name: 'map',
    component: Map
  }, {
    path: '/gismap',
    name: 'gismap',
    component: GisMap
  }, {
    path: '/paramscomponents',
    name: 'paramscomponents',
    component: ParamsComponents
  }, {
    path: '/xingkong',
    name: 'xingkong',
    component: XingkongPage
  }, {
    path: '/svg',
    name: 'svg',
    component: SvgPage
  }


]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
