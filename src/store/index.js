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
    stopStatistic: false,
    currentSlide: 0,
    slideChange: true,
    firstAnimation: false,
    roadmapIndex: null,
    header: false,
    roadmapInnerRoute: false,
    scrollOffset: 0,
    sound: true
  },
  mutations: {
    setSound (state, data) {
      state.sound = data
    },
    setScrollOffset (state, data) {
      state.scrollOffset = data
    },
    setRoadmapInnerRoute (state, data) {
      state.roadmapInnerRoute = data
    },
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
    stopStatistic (state, data) {
      state.stopStatistic = data
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
