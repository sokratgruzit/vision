<template>
  <div class="smooth-scroll-container">
    <slot />
  </div>
</template>

<script>
  import Scrollbar from "smooth-scrollbar";

  export default {
    name: "SmoothScrollContainer",
    data() {
      return  {
        smoothScrollInstance: 0,
        oldOffset: 0
      };
    },
    watch: {
      '$store.state.current_content_request_status' : function () {
        if(this.$store.state.current_content_request_status == 'done'){
          this.smoothScrollInstance.scrollTop ? this.smoothScrollInstance.scrollTop = 0 : ''
        }
      }
    },
    mounted() {
      if(window.innerWidth >= 768){
        this.smoothScrollInstance = Scrollbar.init(this.$el,{ 'damping': 0.08, 'renderByPixels': true, 'continuousScrolling': true})
        this.smoothScrollInstance.addListener(this.onScroll);
        this.smoothScrollInstance.scrollTop = 0;
      }

    },
    beforeDestroy() {
      this.smoothScrollInstance ? this.smoothScrollInstance.destroy(this.$el) : '';
    },
    methods: {
      onScroll({ offset }) {
        console.log(offset)
        this.$store.commit('setScrollOffset', offset.y);
      }
    }
  };
</script>

<style scoped>
  .smooth-scroll-container {
    height: 100vh;
  }
  @media (max-width: 767px) {
    .smooth-scroll-container {
      height: auto;
    }
  }
</style>
