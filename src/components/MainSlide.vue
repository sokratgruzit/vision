<template>
    <div class="main-slide container" :class="firstAnimation ? 'animated' : ''">
      <div class="main-slide__inner">
        <h1 class="main-slide__title">
          <div class="main-slide__title-out">
            <div class="main-slide__title-in">CORE</div>
          </div>
          <div class="main-slide__title-out">
            <div class="main-slide__title-in">VISION</div>
          </div>
        </h1>
        <div class="main-slide__description">
          <p>Multi Chain PoS Network focused
            on Interoperability, Scalability and Usability.
            It utilizes AI Enabled Proof of Stake Algorithm, Multi Layered Consensus Model and Voting
            Based Governance.</p>
          <div class="explore-button__container">
            <div class="explore-button">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <div class="explore-button__text">
                Explore Now
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';


export default {
  name: 'MainSlide',
  data () {
    return {
      firstAnimation: false
    }
  },
  methods: {
  },
  mounted () {
    setTimeout(() => {
      this.firstAnimation = true
    }, 100);
  },
}
</script>
<style scoped>
  .explore-button__text{
    text-transform: uppercase;
  }
  .main-slide__video-container .main-slide__video-bg{
    transition: 1.2s cubic-bezier(.79,.01,.15,.99);
    transform: translateY(130%) translateX(-130%) rotate3d(40, 50, -10, -40deg);
    opacity: 0;
  }
  .hooper-slide.is-active .animated .main-slide__video-container .main-slide__video-bg{
    transform: translateY(0%) translateX(0%) rotate3d(40, 50, -10, 0deg);
    transition-delay: .7s;
    opacity: .3;
  }
  #galaxy-container{
    transition: 1.2s cubic-bezier(.79,.01,.15,.99);
    transform: translateY(130%) translateX(-130%) rotate3d(40, 50, -10, -40deg);
    opacity: 0;
    transition-delay: .5s;
  }
  .hooper-slide.is-active .animated #galaxy-container{
    transform: translateY(0%) translateX(0%) rotate3d(40, 50, -10, 0deg);
    transition-delay: 1s;
    opacity: 1;
  }
  .explore-button__container{
    margin-right: auto;
    display: flex;
    transform: translateY(200%) translateX(-300%) rotate3d(40, 50, -50,
    32deg
    );
    transition: 1s cubic-bezier(.79,.01,.15,.99);
    transition-delay: .3s;
    opacity: 0;
  }
  .hooper-slide.is-active .animated .explore-button__container{
    transform: translateY(0%) translateX(0%) rotate3d(40, 50, -50,
    0deg
    );
    transition-delay: 1.2s;
    opacity: 1;
  }
  .main-slide__video-bg {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 5;
    object-fit: cover;
    opacity: .3;
  }
  .main-slide__video-container{
    display: flex;
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 1;
    left: 0px;
    bottom: 0px;
    transform: translateX(-5%) translateY(30%);
  }
  .main-slide{
    height: 100%;
    position: relative;
    overflow: hidden;
  }
  .main-slide__inner{
    display: flex;
    width: 100%;
    justify-content: space-between;
    position: relative;
    z-index: 5;
  }
  .main-slide__title-in{
    font-size: 180px;
    line-height: 160px;
    /*transform: translateY(120%);*/
    transition: 1.2s cubic-bezier(.79,.01,.15,.99);
    transition-delay: 0s;
    transform: translateY(130%) translateX(-130%) rotate(-25deg) rotate3d(40, 50, -10, -40deg);
  }
  .main-slide__description p {
    transition: 1.2s cubic-bezier(.79,.01,.15,.99);
    opacity: 0;
    transition-delay: .2s;
    transform: translateY(200%) translateX(-350%) rotate(-10deg) rotate3d(40, 50, -50, 32deg);
  }
  .hooper-slide.is-active .animated .main-slide__description p{
    transform: translateY(0%) translateX(0%) rotate3d(40, 50, -10, 0deg);
    transition-delay: .9s;
    opacity: 1;
  }
  .main-slide__title-out:first-child .main-slide__title-in{
    transition-delay: .1s;
  }
  .main-slide__title-out:last-child .main-slide__title-in{
    transition-delay: 0s;
  }
  .hooper-slide.is-active .animated  .main-slide__title-out .main-slide__title-in{
    /*transform: translateY(0%);*/
    transform: translateY(0%) translateX(-0%) rotate3d(100, 50, -32, 0deg);
  }
  .hooper-slide.is-active .main-slide__title-out:last-child .main-slide__title-in{
    transition-delay: .9s;
  }
  .hooper-slide.is-active .main-slide__title-out:first-child .main-slide__title-in{
    transition-delay: .8s;
  }
  .main-slide__title-out:last-child .main-slide__title-in{
    color: rgba(255, 113, 82, 1);
    padding-left: 110px;
  }
  .main-slide__title-out{
    display: flex;
    /*overflow: hidden;*/
  }
  .main-slide__title{
    padding-top: 170px;
  }
  .main-slide__description{
    width: 400px;
    display: flex;
    flex-direction: column;
    padding-top: 295px;
  }
  .main-slide__description p{
    text-align: left;
    color: rgba(171, 176, 188, 1);
  }
  .explore-button{
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0px 47px;
    border: 1px solid rgba(255, 255, 255, .1);
    margin-right: auto;
    position: relative;
    cursor: pointer;
  }
  .explore-button span:nth-child(1){
    top: -1px;
    left: -1px;
    border-left: 1px solid #8785FF;
    border-top: 1px solid #8785FF;
  }
  .explore-button span:nth-child(2){
    top: -1px;
    right: -1px;
    border-right: 1px solid #8785FF;
    border-top: 1px solid #8785FF;
  }
  .explore-button span:nth-child(3){
    bottom: -1px;
    right: -1px;
    border-right: 1px solid #8785FF;
    border-bottom: 1px solid #8785FF;
  }
  .explore-button span:nth-child(4){
    bottom: -1px;
    left: -1px;
    border-left: 1px solid #8785FF;
    border-bottom: 1px solid #8785FF;
  }
  .explore-button span{
    height: 9px;
    width: 9px;
    position: absolute;
  }
  .main-slide__description .explore-button{
    margin-top: 60px;
  }
  /*Ipad 1024*/
  @media (max-width: 1365px){
    .main-slide__title-in {
      font-size: 100px;
      line-height: 100px;
    }
    .main-slide__description{
      padding-top: 205px;
    }
  }
  /*Ipad 768*/
  @media (max-width: 1023px){
    .main-slide__inner{
      flex-direction: column;
      justify-content: flex-start;
    }
    .main-slide__description{
      padding-top: 0px;
      margin-top: 50px;
    }
    .main-slide__video-container {
      transform: translateX(0%) translateY(30%);
    }
  }
  /*Mobile 320*/
  @media (max-width: 767px){
    .main-slide__title-in {
      font-size: 80px;
      line-height: 80px;
    }
    .main-slide__title-out:last-child .main-slide__title-in {
      padding-left: 40px;
    }
    .main-slide__title {
      padding-top: 120px;
    }
    .main-slide__description p{
      font-size: 16px;
    }
    .main-slide__description{
      width: 100%;
      margin-top: 30px;
    }
    .main-slide__description .explore-button{
      margin-top: 30px;
    }
  }
</style>
