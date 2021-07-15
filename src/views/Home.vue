<template>
  <div class="home-slider">
    <hooper>
      <slide>
        <MainSlide/>
      </slide>
      <slide>
        slide 2
      </slide>
      <slide>
        slide 3
      </slide>
    </hooper>
    <Game v-if="true"/>
  </div>
</template>

<script>
// @ is an alias to /src
import { Hooper, Slide } from 'hooper'
import 'hooper/dist/hooper.css'
import Game from '@/components/Game.vue'
import MainSlide from '../components/MainSlide'

export default {
  name: 'Home',
  components: {
    MainSlide,
    Game,
    Hooper,
    Slide
  }
}
</script>
<style>
  .home-slider{
    height: 100vh;
    width: 100%;
  }
  .hooper-track{
    /*transition-delay: 1s!important;*/
    /*transition-duration: 1s!important;*/
  }
  .hooper-slide{
    height: 100vh;
  }
  .hooper{
    height: 100%;
  }
</style>
