import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Roadmap from '../views/Roadmap.vue'
import Statistic from '../views/Statistic.vue'
import GalaxyGarbage from '../views/GalaxyGarbage.vue'
import RoadmapSlider from '../views/RoadmapSlider.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/roadmap',
    name: 'Roadmap',
    component: Roadmap,
    children: [
      {
        path: ":sectionName",
        name: "wiki",
        component: RoadmapSlider
      }
    ]
  },
  {
    path: '/statistic',
    name: 'Statistic',
    component: Statistic
  },
  {
    path: '/galaxy-garbage',
    name: 'GalaxyGarbage',
    component: GalaxyGarbage
  },
  {
    path: '/roadmap-slider',
    name: 'RoadmapSlider',
    component: RoadmapSlider
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
