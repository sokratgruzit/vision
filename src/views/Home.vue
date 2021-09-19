<template>
  <div class="home-slider">
    <hooper ref="carousel" :transition="1000" @slide="updateCarousel" :mouseDrag="false" :class="!$store.state.firstAnimation ? 'nopointern' : ''">
      <slide>
<!--        <MainSlide v-if="this.$store.state.currentSlide == 0"/>-->
        <MainSlide v-if="true"/>
      </slide>
      <slide>
        <GameStart/>
      </slide>
      <slide>
        <Story/>
      </slide>
    </hooper>
    <Galactic/>
  </div>
</template>

<script>
// @ is an alias to /src
import { Hooper, Slide } from 'hooper'
import 'hooper/dist/hooper.css'
import MainSlide from '../components/MainSlide'
import GameStart from '../components/GameStart'
import Galactic from '../components/Galactic'
import Story from '../components/Story'

export default {
  name: 'Home',
  components: {
    MainSlide,
    Hooper,
    Slide,
    GameStart,
    Galactic,
    Story
  },
  data () {
    return {
      activeSlide: 0
    }
  },
  methods: {
    handleScroll (event) {
      
    },
    updateCarousel (payload) {
      this.$store.commit('changeSlide', payload.currentSlide);
      this.$store.commit('setChangeSlide', true);
    }
  },
  watch: {
    '$store.state.currentSlide': function () {
      this.$refs.carousel.slideTo(this.$store.state.currentSlide);
    }
  }

}
</script>
<style>
  .nopointer{
    pointer-events: none!important;
  }
  .home-slider .hooper{
    z-index: 2;
  }
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
