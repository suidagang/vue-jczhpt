import Vue from 'vue'
import IconSvg from '../components/iconSvg/index.vue'

Vue.component('icon-svg', IconSvg)

//全局引入所有.svg文件
const req = require.context('./svg', false, /.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);