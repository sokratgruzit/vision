<template>
  <div class="roadmap__container">
    <div class="roadmap__slider-container">
      <swiper ref="swiperTop" class="roadmap__slider" :options="swiperOptions">
        <swiper-slide>
          <div class="roadmap__slide">
            hi
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="roadmap__slide">
            hi
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="roadmap__slide">
            hi
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {
  },
  data () {
    return {
      swiperOptions: {
        slidesPerView: 'auto',
        speed: 800,
        spaceBetween: 100,
        watchOverflow: true,
        centeredSlides: true
      }
    }
  },
  methods: {
  }
}
</script>
<style scoped>
  .roadmap__container{
    position: relative;
    height: 100vh;
    width: 100%;
  }
  .roadmap__slider-container{
    margin-top: 160px;
  }
  .roadmap__slider-container .swiper-slide{
    width: 80%;
    padding-top: 50%;
    background: red;
  }
</style>
