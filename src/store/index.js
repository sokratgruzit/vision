import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    navigation: false,
    hideGalactic: true,
    playGame: false
  },
  mutations: {
    playGame (state, data) {
      state.playGame = data
    },
    hideGalactic (state, data) {
      state.currentSlide = data
    },
    openNavigation (state, data) {
      state.navigation = data
    }
  },
  actions: {
  },
  modules: {
  }
})
