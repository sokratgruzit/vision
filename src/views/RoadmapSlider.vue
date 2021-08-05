<template>
  <div class="home-slider">
    <hooper @slide="updateCarousel" :mouseDrag="false" :class="!$store.state.firstAnimation ? 'nopointern' : ''">
      <slide>
        slide 1
      </slide>
      <slide>
        slide 2
      </slide>
      <slide>
        slide 3
      </slide>
      <slide>
        slide 3
      </slide>
    </hooper>
  </div>
</template>

<script>
  import { Hooper, Slide } from 'hooper'
  import 'hooper/dist/hooper.css'
  export default {
    name: 'RoadmapSlide',
    components: {
      Hooper,
      Slide,
    },
    data () {
      return {
        activeSlide: 0
      }
    },
    methods: {
      handleScroll (event) {
        console.log('hii')
      },
      updateCarousel (payload) {
        console.log('hi')
        // this.$store.commit('changeSlide', payload.currentSlide);
        // this.$store.commit('setChangeSlide', true);
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
