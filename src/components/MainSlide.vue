<template>
  <div class="main-slide container">
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
</template>

<script>
// @ is an alias to /src

export default {
  name: 'MainSlide'
}
</script>
<style scoped>
  .main-slide{
    height: 100%;
  }
  .main-slide__inner{
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  .main-slide__title-in{
    font-size: 180px;
    line-height: 160px;
  }
  .main-slide__title-out:last-child .main-slide__title-in{
    color: rgba(255, 113, 82, 1);
    padding-left: 110px;
  }
  .main-slide__title-out{
    display: flex;
    overflow: hidden;
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
</style>
