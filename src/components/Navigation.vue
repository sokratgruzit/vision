<template>
  <div class="navigation__container" v-if="true" :class="$store.state.navigation ? 'activeNav' : ''">
    <img :src="require(`@/assets/img/nav.jpeg`)" alt="" class="navigation__bg">
    <div class="navigation__inner container">
      <div class="navigation__left">
        <router-link to="/roadmap" @click.native="closeMenu" class="navigation__link">
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
        <router-link to="/about" class="navigation__link" @click.native="closeMenu">
          <span>A</span>
          <span>B</span>
          <span>O</span>
          <span>U</span>
          <span>T</span>
          <div class="arrow">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M27 5L53 30L27 55" stroke="#FF7152" stroke-width="4"/>
              <line x1="52" y1="30" x2="4" y2="30" stroke="#FF7152" stroke-width="4"/>
            </svg>
          </div>
        </router-link>
      </div>
      <div class="navigation__right">
        <router-link to="/" class="navigation__news">
          <div class="navigation__news-date">Today, 22:10</div>
          <div class="navigation__news-text">8 years of Nightingale in retrospect</div>
        </router-link>
        <router-link to="/" class="navigation__news">
          <div class="navigation__news-date">Yesterday, 07:15</div>
          <div class="navigation__news-text">Nightingale rides with Piaggio Group</div>
        </router-link>
        <router-link to="/" class="navigation__news">
          <div class="navigation__news-date">22 june</div>
          <div class="navigation__news-text">8 years of Nightingale in retrospect</div>
        </router-link>
      </div>
      <footer>
        <div class="footer__text">© CORE Vision, 2021</div>
        <div class="footer__text">All rights reserved</div>
        <router-link to="/" class="footer__link">Privacy & Terms</router-link>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  methods: {
    closeMenu () {
      this.$store.commit('openNavigation', false)
    }
  }
}
</script>
<style scoped>
  .footer__link{
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    border-bottom: 1px solid #ABB0BC;
  }
  .footer__link:hover{
    color: #fff;
    border-bottom: 1px solid transparent;
  }
  footer *{
    font-size: 16px;
    color: #ABB0BC;
  }
  footer{
    display: flex;
    justify-content: space-between;
    margin-top: auto;
    margin-bottom: 60px;
    width: 100%;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    transform: translateY(10px);
    opacity: 0;
    transition-delay: .2s;
  }
  .activeNav footer{
    transform: translateY(0px);
    opacity: 1;
  }
  .navigation__news-date{
    color: rgba(171, 176, 188, 1);
  }
  .navigation__news{
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-right: auto;
    margin-bottom: 30px;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
  }
  .navigation__news:hover{
    opacity: .7;
  }
  .navigation__right{
    width: 50%;
    display: flex;
    flex-direction: column;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    transform: translateY(10px);
    opacity: 0;
    transition-delay: .1s;
  }
  .activeNav .navigation__right{
    transform: translateY(0px);
    opacity: 1;
  }
  .navigation__link .arrow{
    margin-left: 25px;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    transform: translateX(0px);
    opacity: 0;
  }
  .navigation__link:hover .arrow{
    transform: translateX(10px);
    opacity: 1;
  }
  .navigation__container{
    position: fixed;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    z-index: 15;
    padding-top: 230px;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    opacity: 0;
    pointer-events: none;
  }
  .navigation__container.activeNav{
    opacity: 1;
    pointer-events: all;
  }
  .navigation__inner{
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    position: relative;
    z-index: 5;
  }
  .navigation__bg{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    z-index: 1;
    height: 100%;
    object-fit: cover;
  }
  .navigation__left{
    width: 50%;
    flex-direction: column;
    display: flex;
    align-items: flex-start;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    transform: translateY(10px);
    opacity: 0;
    transition-delay: .1s;
  }
  .activeNav .navigation__left{
    transform: translateY(0px);
    opacity: 1;
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
  /*Ipad Pro 1024*/
  @media (max-width: 1450px) {
    .navigation__container{
      padding-top: 170px;
    }
    .footer{
      margin-bottom: 30px;
    }
    .navigation__link span {
      font-size: 70px;
      line-height: 70px;
    }
  }
  /*Ipad 768*/
  @media (max-width: 1023px){
    .navigation__link span {
      font-size: 50px;
      line-height: 50px;
    }
    footer{
      margin-bottom: 30px;
    }
  }
  /*Mobile 320*/
  @media (max-width: 767px){
    .navigation__inner{
      flex-direction: column;
    }
    .navigation__left{
      width: 100%;
    }
    .navigation__right{
      width: 100%;
    }
    .navigation__container {
      padding-top: 120px;
    }
    .navigation__link .arrow svg{
      height: 45px;
    }
    .navigation__link .arrow{
      margin-left: 10px;
    }
    .navigation__news{
      margin-bottom: 15px;
    }
    .navigation__right{
      margin-top: 15px;
    }
    .navigation__news-date,.navigation__news-text{
      font-size: 16px;
      line-height: 24px;
    }
    footer{
      flex-direction: column;
    }
    .footer__link{
      margin: 0px auto;
    }
  }
</style>
