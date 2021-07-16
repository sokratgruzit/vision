<template>
  <div class="navigation__container" v-if="false">
    <div class="navigation__inner container">
      <div class="navigation__left">
        <router-link to="/" class="navigation__link">
          <span>R</span>
          <span>O</span>
          <span>A</span>
          <span>D</span>
          <span>M</span>
          <span>A</span>
          <span>P</span>
          <div class="arrow">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M27 5L53 30L27 55" stroke="#FF7152" stroke-width="4"/>
              <line x1="52" y1="30" x2="4" y2="30" stroke="#FF7152" stroke-width="4"/>
            </svg>
          </div>
        </router-link>
        <router-link to="/" class="navigation__link">
          <span>S</span>
          <span>O</span>
          <span>L</span>
          <span>U</span>
          <span>T</span>
          <span>I</span>
          <span>O</span>
          <span>N</span>
          <span>S</span>
          <div class="arrow">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M27 5L53 30L27 55" stroke="#FF7152" stroke-width="4"/>
              <line x1="52" y1="30" x2="4" y2="30" stroke="#FF7152" stroke-width="4"/>
            </svg>
          </div>
        </router-link>
        <router-link to="/" class="navigation__link">
          <span>T</span>
          <span>E</span>
          <span>A</span>
          <span>M</span>
          <div class="arrow">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M27 5L53 30L27 55" stroke="#FF7152" stroke-width="4"/>
              <line x1="52" y1="30" x2="4" y2="30" stroke="#FF7152" stroke-width="4"/>
            </svg>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  methods: {
  }
}
</script>
<style scoped>
  .navigation__container{
    position: fixed;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    z-index: 15;
    background: red;
    padding-top: 230px;
  }
  .navigation__inner{
    display: flex;
  }
  .navigation__left{
    width: 50%;
    flex-direction: column;
    display: flex;
    align-items: flex-start;
  }
  .navigation__link{
    display: flex;
    align-items: center;
  }
  .navigation__link span{
    font-size: 90px;
    line-height: 90px;
    color: rgba(77, 86, 108, 1);
    display: flex;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
  }
  .navigation__link:hover span{
    transform: rotate3d(0, 2, 0, 170deg);
    color: #fff;
  }
  .navigation__link{

  }
</style>
