import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    navigation: false,
    hideGalactic: true,
    playGame: false,
    currentSlide: 0,
    slideChange: true,
    firstAnimation: false
  },
  mutations: {
    setFirstAnimation (state, data) {
      state.firstAnimation = data
    },
    setChangeSlide (state, data) {
      state.slideChange = data
    },
    changeSlide (state, data) {
      state.currentSlide = data
    },
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
