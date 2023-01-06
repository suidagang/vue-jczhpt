import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const getRandomType = (num) => {
  let result = 1;
  result = Math.ceil(Math.random() * num);
  return result;
};
export default new Vuex.Store({
  state: {
    currentPageAnimate: 1,
    pageAnimateNum: 3
  },
  mutations: {
    changeCurrentPageAnimate(state) {
      const val = getRandomType(state.pageAnimateNum);
      state.currentPageAnimate = val;
    }
  },
  actions: {
  },
  modules: {
  }
})
