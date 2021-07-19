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
      <div id="galaxy-container"></div>
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
      firstAnimation: false,
      scene: null,
      galaxyMesh: null,
      camera: null,
      renderer: null,
      controls: null,
      clock: null,
      mouse: new THREE.Vector2(),
      target: new THREE.Vector2(),
      mouseX: 0,
      mouseY: 0,
      count: 0,
			windowHalfX: window.innerWidth / 2,
			windowHalfY: window.innerHeight / 2,
      galaxyGeo: null,
      galaxyMat: null,
      uniforms: null,
      galaxyVertex: `
        uniform vec3 uCameraPos;
        attribute float alpha;
        attribute float size;
        attribute vec3 color;
        varying float vAlpha;
        varying vec3 vColor;

        void main() {
          float d = distance(position.xyz, uCameraPos);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vAlpha = alpha;
          vColor = color;
          gl_PointSize = size;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      galaxyFragment: `
        varying vec3 vColor;
        uniform sampler2D pointTexture;
        varying float vAlpha;

        void main() {
          gl_FragColor = vec4(vColor, vAlpha);
          gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
        }
      `,
      moveGalaxy: true,
      particles: null,
      fixedY: 0,
      fixedMesh: true,
      oldx: 0,
      mouseDirection: ""
    }
  },
  methods: {
    myScene: function () {
      this.scene = new THREE.Scene();
      var light = new THREE.AmbientLight(0xffffff);
      var width = window.innerWidth;
      var height = window.innerHeight;
      this.camera = new THREE.PerspectiveCamera(50, width/height, 1, 5000);
      this.camera.position.x = -600;
      this.camera.position.y = -600;
      this.camera.position.z = 1000 + 1200;
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(width, height);
      document.getElementById("galaxy-container").appendChild(this.renderer.domElement);
      this.clock = new THREE.Clock();
      this.clock.start();

      //this.controls = new OrbitControls(this.camera, this.renderer.domElement);

      var sLight = new THREE.SpotLight(0xffffff);
      sLight.position.set(-100, 100, 100);
      this.scene.add(sLight);

      var aLight = new THREE.AmbientLight(0xffffff);
      this.scene.add(aLight);
      //David code
      var directionalLight = new THREE.DirectionalLight("#fff", 2);
      directionalLight.position.set(0, 50, -20);
      this.scene.add(directionalLight);
      //End David code

      const loader = new THREE.TextureLoader();
      const texture = loader.load(require("../assets/galaxySphere.png"));

      this.uniforms = {
        pointTexture: { type: "t", value: texture },
        uCameraPos: { type: "3f", value: new THREE.Vector3(0, 0, 1000) },
      };

      this.galaxyMat = new THREE.ShaderMaterial({
        uniforms:       this.uniforms,
        vertexShader:   this.galaxyVertex,
        fragmentShader: this.galaxyFragment,
        transparent:    true,
        depthTest:      false,
        blending:       THREE.AdditiveBlending
      });

      var variance = 2.5 * (Math.random() + Math.random() + Math.random()) / 3.0;
      var arms = this.count === 0 ? 7 : Math.floor(Math.random() * 4) + 3;
      var twist = 0.6 + 1.5 * (Math.random() + Math.random() + Math.random() + Math.random() + Math.random());
      var pinch = 0.7 + 1.5 * (Math.random() + Math.random() + Math.random() + Math.random()) / 4.0;

      var clouds = 500 * arms;
      var stars = 4000;

      var vertices = new Float32Array((clouds + stars) * 3);
      var colors = new Float32Array((clouds + stars) * 3);
      var alphas = new Float32Array((clouds + stars) * 1);
      var sizes = new Float32Array((clouds + stars) * 1);

      var r1 = 1.0;
      var g1 = 1.0;
      var b1 = 0.8;

      var r2 = 0.65;
      var g2 = 0.85;
      var b2 = 1.0;

      for (let i = 0; i < clouds; ++i) {
        var f = (clouds - i) / clouds;
        var g = i / clouds;
        var a = (i % arms) / arms * 2.0 * 3.19149 + g * twist + variance * ((Math.random() + Math.random() + Math.random()) * 0.4 / 3.0 - 0.2);
        var r = Math.pow(g, pinch) * 700;
        var x = Math.cos(a) * r;
        var y = Math.sin(a) * r;
        var z = 0.0;

        vertices[i * 3 + 0] = x;
        vertices[i * 3 + 1] = y;
        vertices[i * 3 + 2] = z;

        var c = Math.pow(f, 0.8);
        colors[i * 3 + 0] = c * r1 + (1.0 - c) * r2;
        colors[i * 3 + 1] = c * g1 + (1.0 - c) * g2;
        colors[i * 3 + 2] = c * b1 + (1.0 - c) * b2;

        var s = Math.pow(512.0, Math.pow(f * Math.random(), 0.3));
        alphas[i] = Math.random() * (400.0 - s) / 5000.0 * Math.pow(g, 0.49);
        sizes[i] = s;
      }

      for (let i = clouds; i < clouds + stars; ++i) {
        var f = (clouds + stars - i) / (clouds + stars);
        var g = i / (clouds + stars);
        //var a = Math.random() * 3.14159 * 2.0;
        // var r = f * 700;
        var x = Math.random() * 4000.0 - 2000.0;
        var y = Math.random() * 4000.0 - 2000.0;
        var z = Math.random() * 4000.0 - 2000.0;
        if (f < 0.2) {
          var a = Math.random() * 3.14159 * 2.0;
          var r = 5.0 + Math.pow(f, 1.5) / Math.pow(0.2, 1.5) * 700;
          var x = Math.cos(a) * r;
          var y = Math.sin(a) * r;
          var z = Math.random() * g * g * Math.sqrt(r) - 0.5 * Math.sqrt(r);
        }

        vertices[i * 3 + 0] = x;
        vertices[i * 3 + 1] = y;
        vertices[i * 3 + 2] = z;

        var c = Math.pow(f, 0.8);
        colors[i * 3 + 0] = 1.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 1.0;

        var s = Math.pow(512.0, Math.pow(f * Math.random(), 0.3));
        alphas[i] = 0.2 + Math.random() * 0.8;
        sizes[i] = Math.random() * Math.random() * 8.0;
      }

      this.galaxyGeo = new THREE.BufferGeometry();
      this.galaxyGeo.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
      this.galaxyGeo.addAttribute('color', new THREE.BufferAttribute(colors, 3));
      this.galaxyGeo.addAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
      this.galaxyGeo.addAttribute('size', new THREE.BufferAttribute(sizes, 1));

      this.particles = new THREE.Points(this.galaxyGeo, this.galaxyMat);
      this.scene.add(this.particles);
    },
    animate: function () {
      requestAnimationFrame(this.animate);
      //this.controls.update();
      var t = this.clock.getElapsedTime();

      var a = (t * 0.1) % (Math.PI * 2.0);//2 * this.mouseX / this.windowHalfX;
      var b = Math.cos(t * 0.17);//2 * this.mouseY / this.windowHalfY;
      var x = 0.0;
      var y = 600;
      var z = 1000 + 1200 * b;
      var fixedX = 0;
      
      if (this.moveGalaxy) {
        this.camera.position.x = x * Math.cos(a) - y * Math.sin(a);
        this.camera.position.y = - x * Math.sin(a) + y * Math.cos(a);
        this.camera.position.z = z;
        fixedX = this.camera.position.x;
        this.fixedY = this.camera.position.y;
      }

      if (this.camera.position.y < 200) {
        fixedX = -595;
        this.fixedY = 200;
        this.moveGalaxy = false;
        this.camera.position.x = fixedX < -595 ? fixedX : x * Math.cos(a) - y * Math.sin(a);
        this.camera.position.y = this.fixedY < 200 ? fixedY : - x * Math.sin(a) + y * Math.cos(a);
        this.camera.position.y = - x * Math.sin(a) + y * Math.cos(a);
      }
      
      this.camera.lookAt(this.scene.position);
      this.camera.up = new THREE.Vector3(0, 0, 1);
      this.render();
    },
    render: function () {
      var t = this.clock.getElapsedTime();
      var meshRotation = 0.002;
      if (this.mouseDirection === "left") {
        meshRotation += 0.002;
      }
      if (this.mouseDirection === "right") {
        meshRotation -= 0.01;
      }
      var a = (t * 0.1) % (Math.PI * 2.0);//2 * this.mouseX / this.windowHalfX;
      var b = Math.cos(t * 0.17);//2 * this.mouseY / this.windowHalfY;
      var x = 0.0;
      var y = 600;
      let meshTranslate = (x * Math.sin(a) + y * Math.cos(a)) - this.fixedY;
      this.particles.rotation.z -= meshRotation;

      if (this.camera.position.y < 200 && this.fixedMesh) {
        if (meshTranslate > -590) {
          this.particles.position.setZ(meshTranslate);
        } else {
          this.fixedMesh = false;
          meshTranslate = -590;
        }
      }
      
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.physicallyCorrectLights = true;
      this.renderer.render(this.scene, this.camera);
    },
    onMouseMove: function (event) {
      this.mouse.x = (event.clientX - this.windowHalfX);
      this.mouse.y = (event.clientY - this.windowHalfX);
          
      if (event.pageX < this.oldx) {
        this.mouseDirection = "left";
      } else if (event.pageX > this.oldx) {
        this.mouseDirection = "right";
      }
        
      this.oldx = event.pageX;
    },
    onWindowResize: function () {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);

      this.render();
    },
  },
  mounted () {
    this.myScene();
    this.animate();
    document.addEventListener('mousemove', this.onMouseMove, false);
    window.addEventListener( 'resize', this.onWindowResize, false );
    setTimeout(() => {
      this.firstAnimation = true
    }, 100);
  }
}
</script>
<style scoped>
  #galaxy-container{
    position: absolute;
    z-index: 10000;
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
  .main-slide__video-container iframe{
    transition: 1.2s cubic-bezier(.79,.01,.15,.99);
    transform: translateY(130%) translateX(-130%) rotate3d(40, 50, -10, -40deg);
    opacity: 0;
  }
  .hooper-slide.is-active .animated .main-slide__video-container iframe{
    transform: translateY(0%) translateX(0%) rotate3d(40, 50, -10, 0deg);
    transition-delay: .8s;
    opacity: 1;
  }
  .explore-button__container{
    margin-right: auto;
    display: flex;
    transform: translateY(10px);
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    transition-delay: 0s;
    opacity: 0;
  }
  .hooper-slide.is-active .animated .explore-button__container{
    transform: translateY(0px);
    transition-delay: 1s;
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
    transform: translateY(150%) translateX(-336%) rotate3d(40, 50, -10,
    40deg
    );
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
