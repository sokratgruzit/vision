<template>
  <div class="home-slider">
    <hooper>
      <slide>
        <MainSlide/>
      </slide>
      <slide>
        <GameStart/>
      </slide>
      <Game v-if="false"/>
    </hooper>
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
