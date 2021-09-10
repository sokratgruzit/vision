import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    navigation: false,
    hideGalactic: true,
    playGame: false,
    stopGalactic: false,
    stopRoadmap: false,
    stopGalaxyGarbage: false,
    stopRoadmapInner: false,
    currentSlide: 0,
    slideChange: true,
    firstAnimation: false,
    roadmapIndex: null,
    header: false
  },
  mutations: {
    setHeader (state, data) {
      state.header = data
    },
    setRoadmapIndex (state, data) {
      state.roadmapIndex = data
    },
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
    stopGalaxyGarbage (state, data) {
      state.galaxyGarbage = data
    },
    stopRoadmapInner (state, data) {
      state.stopRoadmapInner = data
    },
    stopRoadmap (state, data) {
      state.stopRoadmap = data
    },
    stopGalactic (state, data) {
      state.stopGalactic = data
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
