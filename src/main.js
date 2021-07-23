import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './assets/css/main.css'
import VueKinesis from 'vue-kinesis'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueCountdown from '@chenfengyuan/vue-countdown'

Vue.component(VueCountdown.name, VueCountdown)
import Swiper, {
  Navigation,
  Pagination,
  Autoplay,
  Mousewheel,
  Scrollbar,
  Thumbs,
  Controller,
  EffectFade
} from 'swiper';
// import style
import 'swiper/swiper-bundle.css'
Swiper.use([
  Navigation,
  Pagination,
  Autoplay,
  Mousewheel,
  Scrollbar,
  Thumbs,
  Controller,
  EffectFade
]);
Vue.use(VueAwesomeSwiper, {Navigation, Pagination});

Vue.use(VueKinesis)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
