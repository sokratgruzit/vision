<template>
  <div class="home-slider">
    <hooper @slide="updateCarousel">
      <slide>
<!--        <MainSlide v-if="this.$store.state.currentSlide == 0"/>-->
        <MainSlide v-if="true"/>
      </slide>
      <slide>
        <GameStart/>
      </slide>
    </hooper>
    <Game v-if="$store.state.playGame"/>
  </div>
</template>

<script>
// @ is an alias to /src
import { Hooper, Slide } from 'hooper'
import 'hooper/dist/hooper.css'
import Game from '@/components/Game.vue'
import MainSlide from '../components/MainSlide'
import GameStart from '../components/GameStart'

export default {
  name: 'Home',
  components: {
    MainSlide,
    Game,
    Hooper,
    Slide,
    GameStart
  },
  data () {
    return {
      activeSlide: 0
    }
  },
  methods: {
    updateCarousel (payload) {
     setTimeout(() => {
       this.$store.commit('changeSlide', payload.currentSlide)
       console.log(this.$store.state.currentSlide)
     },1200)
    }
  }
}
</script>
<style>
  .home-slider{
    height: 100vh;
    width: 100%;
  }
  .hooper-track{
    transition-delay: 1.2s!important;
    transition-duration: 1s!important;
  }
  .hooper-slide{
    height: 100vh;
  }
  .hooper{
    height: 100%;
  }
</style>
