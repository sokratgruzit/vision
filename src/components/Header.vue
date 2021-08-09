<template>
    <header :class="$store.state.header ? 'active' : ''">
      <div class="container">
        <div class="header__inner">
        <router-link to="/" class="logo" @click.native="closeMenu">
          <svg width="46" height="50" viewBox="0 0 46 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.09146 12.6147C9.09492 9.95028 11.7196 7.82168 14.7344 6.41639C17.7491 5.0111 21.0615 4.37223 24.3798 4.55604C27.6981 4.73985 30.9205 5.7407 33.7633 7.47045C36.6061 9.2002 38.982 11.6058 40.6819 14.4754L42.1501 13.6557L44.5972 12.2131C42.4018 8.50166 39.2839 5.42757 35.5493 3.29254C31.8148 1.15751 27.5919 0.0349121 23.2953 0.0349121C18.9986 0.0349121 14.7758 1.15751 11.0413 3.29254C7.30669 5.42757 4.18872 8.50166 1.99336 12.2131L0.777969 14.1311L2.71933 15.2869L10.2319 19.7705C9.0031 22.8759 8.91756 26.3201 9.99067 29.4833C11.0638 32.6465 13.2251 35.321 16.0857 37.0256C18.9463 38.7301 22.3184 39.3528 25.5952 38.7817C28.872 38.2105 31.8383 36.4829 33.9605 33.9098L39.4338 37.1885C37.4299 39.8553 34.8036 41.9855 31.7866 43.3911C28.7696 44.7967 25.4546 45.4345 22.1343 45.2482C18.814 45.0619 15.5904 44.0572 12.7479 42.3228C9.90533 40.5884 7.53132 38.1777 5.83529 35.3033L1.96073 37.6065C4.15609 41.318 7.27406 44.3921 11.0086 46.5271C14.7432 48.6621 18.966 49.7847 23.2627 49.7847C27.5593 49.7847 31.7821 48.6621 35.5167 46.5271C39.2513 44.3921 42.3692 41.318 44.5646 37.6065L45.7229 35.6557L43.7815 34.5L37.6148 30.8197L32.2965 27.7377C31.6491 29.8087 30.3159 31.5947 28.5185 32.799C26.7212 34.0033 24.5679 34.5533 22.4164 34.3576C20.2649 34.1619 18.2449 33.2323 16.6919 31.7233C15.1389 30.2143 14.1466 28.2168 13.8797 26.0626C13.6129 23.9084 14.0876 21.7274 15.225 19.8818C16.3625 18.0363 18.0941 16.6375 20.1322 15.9177C22.1702 15.198 24.392 15.2007 26.4284 15.9255C28.4647 16.6502 30.1929 18.0533 31.3258 19.9016L35.233 17.6393C34.0852 15.7263 32.4994 14.1163 30.6077 12.9431C28.7159 11.77 26.5727 11.0676 24.3564 10.8945C22.1401 10.7213 19.9146 11.0823 17.8651 11.9475C15.8156 12.8127 14.0013 14.1571 12.5729 15.8688L7.09146 12.6147Z" fill="#FF7152"/>
          </svg>
        </router-link>
        <div class="burger__container">
          <div class="burger" :class="$store.state.navigation ? 'active' : ''" @click="openNav">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div class="header__last-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="2" y1="24" x2="2" y2="18" stroke="white" stroke-width="2"/>
            <line x1="7" y1="24" x2="7" y2="14" stroke="white" stroke-width="2"/>
            <line x1="12" y1="24" x2="12" y2="17" stroke="white" stroke-width="2"/>
            <line x1="17" y1="24" x2="17" y2="10" stroke="white" stroke-width="2"/>
            <line x1="22" y1="24" x2="22" y2="21" stroke="white" stroke-width="2"/>
          </svg>
        </div>
      </div>
      </div>
    </header>
</template>

<script>
export default {
  name: 'Header',
  methods: {
    openNav () {
      if (this.$store.state.navigation === false) {
        this.$store.commit('openNavigation', true)
      } else {
        this.$store.commit('openNavigation', false)
      }
      console.log(this.$store.state.navigation)
    },
    closeMenu () {
      this.$store.commit('openNavigation', false)
    }
  },
  mounted () {
    this.$store.commit('setHeader', true)
  }
}
</script>
<style scoped>
  .burger__container{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .header__last-button{
    position: relative;
    z-index: 2;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    transform: translateY(10px);
    opacity: 0;
  }
  header.active .header__last-button{
    transform: translateY(0px);
    opacity: 1;
    transition-delay: .2s;
  }
  .logo{
    position: relative;
    z-index: 2;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    transform: translateY(10px);
    opacity: 0;
  }
  header.active .logo{
    transform: translateY(0px);
    opacity: 1;
  }
  header{
    height: 130px;
    position: fixed;
    width: 100%;
    left: 0px;
    top: 0px;
    z-index: 20;
  }
  header .container{
    height: 100%;
  }
  .header__inner{
    display: flex;
    width: 100%;
    justify-content: space-between;
    position: relative;
    border-bottom: 1px solid rgba(255, 255, 255, 0);
    align-items: center;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
  }
  header.active .header__inner{
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .burger{
    height: 18px;
    width: 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    transform: translateY(10px);
    opacity: 0;
  }
  header.active .burger{
    transform: translateY(0px);
    opacity: 1;
    transition-delay: .1s;
  }
  .burger span{
    height: 2px;
    width: 100%;
    background: #FFFFFF;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
  }
  .burger:hover span{
    background: rgba(255, 113, 82, 1);
  }
  .burger span:nth-child(2){
    transition-delay: .2s;
  }
  .burger span:nth-child(3){
    transition-delay: .3s;
  }
  .burger.active span:nth-child(3),.burger.active span:nth-child(1){
    transform: scaleX(0);
  }
  /*Mobile 320*/
  @media (max-width: 767px){
    header{
      height: 90px;
    }
  }
</style>
