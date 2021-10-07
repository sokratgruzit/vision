<template>
  <div class="about-main__container">
    <div id="about-container"></div>
    <div class="about__content" :class="firstAnimation ? 'animated' : ''">
      <div class="about__content-floor">
        <h1 class="about__content-ttl">
          Multi Chain PoS Network <br>
          focused on Interoperability,<br>
          Scalability and Usability.
        </h1>
        <div class="about__content-txt">
          It utilizes AI Enabled Proof of Stake Algorithm, Multi Layered Consensus
          Model and Voting Based Governance. It would attain higher level of Scalability using Advanced Sharding along with Pipelining and Chunking and Parallel Transaction Processing.
          <br>
          <br>
          These technologies have made it possible for the CORE network to be infinitely scalable and to achieve significantly higher throughput and efficiency.
        </div>
      </div>
      <div class="about__content-floor">
        <h2 class="about__content-ttl">The <span>CMCX</span> Token</h2>
        <div class="about__content-txt">
          The CMCX token is native to the CORE platform and allows users to transact with other users on the blockchain, as well as pay for all of the utility fees in the ecosystem. It can be used for governance, staking, transactions, smart contracts and validator rewards on the platform.
        </div>
        <div class="about__content-btns">
          <a href="https://cmcx.io/login" target="_blank" class="about__content-btn colored">
            Sign In
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g>
                <path d="M14 0.999999C14 0.447714 13.5523 -8.61581e-07 13 -1.11446e-06L4 -3.13672e-07C3.44772 -6.50847e-07 3 0.447715 3 0.999999C3 1.55228 3.44772 2 4 2L12 2L12 10C12 10.5523 12.4477 11 13 11C13.5523 11 14 10.5523 14 10L14 0.999999ZM1.70711 13.7071L13.7071 1.70711L12.2929 0.292893L0.292893 12.2929L1.70711 13.7071Z" fill="white"/>
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="14" height="14" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </a>
          <a href="https://cmcx.io/register" target="_blank" class="about__content-btn uncolored">
            Register
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g>
                <path d="M14 0.999999C14 0.447714 13.5523 -8.61581e-07 13 -1.11446e-06L4 -3.13672e-07C3.44772 -6.50847e-07 3 0.447715 3 0.999999C3 1.55228 3.44772 2 4 2L12 2L12 10C12 10.5523 12.4477 11 13 11C13.5523 11 14 10.5523 14 10L14 0.999999ZM1.70711 13.7071L13.7071 1.70711L12.2929 0.292893L0.292893 12.2929L1.70711 13.7071Z" fill="white"/>
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="14" height="14" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </a>
          <div class="mdl">or</div>
          <a href="https://www.coremultichain.com/" target="_blank" class="about__content-link">
            <span>Explore CORE</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g>
                <path d="M14 0.999999C14 0.447714 13.5523 -8.61581e-07 13 -1.11446e-06L4 -3.13672e-07C3.44772 -6.50847e-07 3 0.447715 3 0.999999C3 1.55228 3.44772 2 4 2L12 2L12 10C12 10.5523 12.4477 11 13 11C13.5523 11 14 10.5523 14 10L14 0.999999ZM1.70711 13.7071L13.7071 1.70711L12.2929 0.292893L0.292893 12.2929L1.70711 13.7071Z" fill="white"/>
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="14" height="14" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </a>
        </div>
      </div>
    </div>
    <img :src="require(`@/assets/img/bg_about.jpeg`)" alt="about__bg" class="about__bg">
  </div>
</template>

<script>
  import * as THREE from 'three';
  import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
  import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
  const TWEEN = require('@tweenjs/tween.js');
  import {
    logo_vertex
  } from '../assets/shaders/vertex.js';
  import {
    logo_fragment
  } from '../assets/shaders/fragment.js';

  export default {
    name: 'About',
    data () {
      return {
        scene: null,
        logo: null,
        sphere: null,
        camera: null,
        renderer: null,
        time: 0,
        raycaster: new THREE.Raycaster(),
        mouse: new THREE.Vector2(),
        isDragging: false,
        direction: "",
        directionX: "",
        oldX: 0,
        oldY: 0,
        uniforms: null,
        firstAnimation: false,
        width: 700,
        height: 700
      }
    },
    methods: {
      myScene: function () {
        var container = document.getElementById('about-container');
        this.scene = new THREE.Scene();

        this.width = container === null ? this.width : container.offsetWidth;
        this.height = container === null ? this.height : container.offsetWidth;

        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 5000);
        this.camera.position.z = 1000;
        this.camera.position.y = -1000;

        var sLight = new THREE.PointLight(0xff00ff);
        sLight.position.set(-100, 100, 100);
        this.scene.add(sLight);
        var aLight = new THREE.DirectionalLight(0xffffff);
        aLight.position.set( 0, 0, 1 );
        this.scene.add(aLight);

        let sphereGeo = new THREE.SphereBufferGeometry(200, 32, 32);
				sphereGeo.deleteAttribute('normal');
				sphereGeo.deleteAttribute('uv');

				const positionAttribute = sphereGeo.getAttribute('position');

        const colors = [];
				const sizes = [];

				const color = new THREE.Color();

				for (let i = 0, l = positionAttribute.count; i < l; i++) {
					color.setHSL( 0.01 + 0.1 * ( i / l ), 1.0, 0.5 );
					color.toArray( colors, i * 3 );

					sizes[ i ] = 20 * 0.5;
				}

				const geometry = new THREE.BufferGeometry();
				geometry.setAttribute('position', positionAttribute);
				geometry.setAttribute('customColor', new THREE.Float32BufferAttribute(colors, 3));
				geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

        let loader = new THREE.TextureLoader();
        this.uniforms = {
          tex: { type: "t", value: loader.load(require("../assets/circle2.png")) },
          time: { type: "f", value: 0.0 },
          distortion: { type: "f", value: 0.0 },
          color: { value: new THREE.Color( 0xffffff ) },
					alphaTest: { value: 0.9 }
        };

				const material = new THREE.ShaderMaterial({
					uniforms: this.uniforms,
					vertexShader: logo_vertex,
					fragmentShader: logo_fragment
				});

				this.sphere = new THREE.Points(geometry, material);
				this.scene.add(this.sphere);
        const loader2 = new THREE.TextureLoader();
        const logoObj = loader2.load(require("../assets/logo.jpg"));
        var logoGeo = new THREE.CylinderGeometry(80, 80, 10, 50);
        var logoMat = new THREE.MeshPhongMaterial({
          map: logoObj
        });
        this.logo = new THREE.Mesh(logoGeo, logoMat);
        this.logo.rotation.x = 1;
        this.logo.rotation.y = 1.5;
        this.scene.add(this.logo);
        /*if(window.innerWidth >= 1024){
          this.scene.scale.set(1.4,1.4,1.4)
        }else{
          this.scene.scale.set(0.7,0.7,0.7)
        }*/
        console.log(this.scene);

        THREE.Mesh.prototype.raycast = acceleratedRaycast;
        THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
        THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.width, this.height);
        container.appendChild(this.renderer.domElement);

        new TWEEN.Tween(this.camera.position)
        .to({ y: 0, z: 500 }, 7000)
        .easing(TWEEN.Easing.Quintic.Out)
        .start();
      },
      animate: function() {
        this.sphere.rotation.y += 0.001;
        this.sphere.rotation.x += 0.0005;
        this.logo.rotation.x -= 0.005;
        this.logo.rotation.y += 0.005;

        this.time += 0.05;
        this.uniforms.time.value = this.time;

        TWEEN.update();
        requestAnimationFrame(this.animate);
        this.render();
      },
      render: function () {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.raycaster.firstHitOnly = true;
        this.renderer.render(this.scene, this.camera);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.physicallyCorrectLights = true;
      },
      onWindowResize: function() {
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
        this.render();
      },
      onMouseDown: function() {
        this.isDragging = true;
      },
      onMouseUp: function() {
        this.isDragging = false;
      },
      onMouseMove: function (event) {
        if (event.pageY < this.oldY) {
          this.direction = "up";
        } else if (event.pageY > this.oldY) {
          this.direction = "down";
        } else if (event.pageX < this.oldX) {
          this.directionX = "left";
        } else if (event.pageX > this.oldX) {
          this.directionX = "right";
        }

        this.oldY = event.pageY;
        this.oldX = event.pageX;

        this.mouse.x = ( event.clientX / this.width ) * 2 - 1;
        this.mouse.y = - ( event.clientY / this.height ) * 2 + 1;

        let int = this.raycaster.intersectObjects([this.scene.children[3]]);
        int = int.length > 0 ? int[0] : false;

        if (int) {
          new TWEEN.Tween(this.uniforms.distortion)
          .to({ value: 0.5 }, 500)
          .easing(TWEEN.Easing.Cubic.InOut)
          .start();
        } else {
          new TWEEN.Tween(this.uniforms.distortion)
          .to({ value: 0 }, 500)
          .easing(TWEEN.Easing.Cubic.InOut)
          .start();
        }
      },
      wheelScroll: function (event) {

      }
    },
    mounted () {
      this.myScene();
      this.animate();
      window.addEventListener('resize', this.onWindowResize, false);
      window.addEventListener('mousedown', this.onMouseDown, false);
      window.addEventListener('mouseup', this.onMouseUp, false);
      window.addEventListener('pointermove', this.onMouseMove);
      document.addEventListener('wheel', this.wheelScroll, false);
      setTimeout(() => {
        this.firstAnimation = true
      },300);
    },
  }
</script>
<style>
  .about__bg{
    position: absolute;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  .about-main__container{
    display: flex;
    position: relative;
  }
  #about-container{
    width: 40%;
    height: 100%;
    position: relative;
    z-index: 10000;
  }
  .about__content{
    width: 60%;
    position: relative;
    z-index: 10;
    padding-top: 210px;
    padding-right: 80px;
  }
  .about__content-floor{
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 120px;
  }
  .about__content-ttl{
    font-size: 50px;
    line-height: 64px;
    text-align: left;
    margin-bottom: 40px;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    opacity: 0;
    transform: translateY(10px);
  }
  .about__content-ttl span{
    font-size: inherit;
    line-height: inherit;
    color: #FF7152;
  }
  .about__content-txt{
    text-align: left;
    font-size: 20px;
    line-height: 30px;
    color: #ABB0BC;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    opacity: 0;
    transform: translateY(10px);
  }
  .about__content-btns{
    display: flex;
    align-items: center;
    margin-top: 80px;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    opacity: 0;
    transform: translateY(10px);
    transition-delay: .4s;
  }
  .about__content-floor:first-child .about__content-txt{
    transition-delay: .1s;
  }
  .about__content-floor:last-child .about__content-ttl{
    transition-delay: .2s;
  }
  .about__content-floor:last-child .about__content-txt{
    transition-delay: .3s;
  }
  .about__content.animated .about__content-ttl,.about__content.animated .about__content-txt,.about__content.animated .about__content-btns{
    opacity: 1;
    transform: translateY(0px);
  }
  .about__content-btn{
    font-size: 22px;
    height: 70px;
    display: flex;
    align-items: center;
    padding: 0px 50px;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    border: 2px solid #FF7152;
  }
  .about__content-btn:first-child{
    margin-right: 20px;
  }
  .about__content-btn.uncolored:hover,.about__content-btn.colored{
    background: #FF7152;
  }
  .about__content-btn.colored:hover{
    background: transparent;
  }
  .about__content-btn svg,.about__content-link svg{
    margin-left: 10px;
  }
  .about__content-btns .mdl{
    font-size: 15px;
    opacity: .5;
    margin: 0px 40px;
  }
  .about__content-link span{
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    text-decoration: underline;
  }
  .about__content-link:hover span{
    color: #FF7152;
    text-decoration-color: transparent;
  }
  .about__content-link path{
    transition: .6s cubic-bezier(.79,.01,.15,.99);
  }
  .about__content-link:hover path{
    fill: #FF7152;
  }
  /*#about-container canvas{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 130px;
    left: 0px;
    transform: translateX(-45%);
  }*/
  /*Ipad Pro*/
  @media (max-width: 1300px){
    .about__content-ttl{
      font-size: 40px;
      line-height: 54px;
    }
    .about__content-floor{
      padding-bottom: 60px;
    }
    .about__content-btn{
      height: 42px;
      padding: 0px 26px;
      font-size: 16px;
    }
    .about__content-btns .mdl{
      margin: 0px 20px;
    }
    .about__content-btn svg, .about__content-link svg{
      transform: scale(.8);
    }
  }
  /*Ipad 768*/
  @media (max-width: 1023px){
    #about-container{
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
    }
    /*#about-container canvas{
      transform: translateX(0%) translateY(-50%);
    }*/
    .about__content{
      width: 100%;
      padding-left: 40px;
      padding-right: 40px;
    }
  }
  /*Mobile*/
  @media (max-width: 767px){
    .about-main__container{
      position: fixed;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    .about__content{
      padding-top: 110px;
      padding-left: 15px;
      padding-right: 15px;
    }
    .about__content-ttl {
      font-size: 24px;
      line-height: 34px;
      margin-bottom: 20px;
    }
    .about__content-txt{
      font-size: 18px;
      line-height: 28px;
    }
    .about__content-btns{
      flex-direction: column;
    }
    .about__content-btn{
      width: 140px;
    }
    .about__content-btn:first-child{
      margin-right: 0px;
      margin-bottom: 15px;
    }
    .about__content-btns .mdl {
      margin: 15px 0px;
    }
    .about__content-btn{
      padding: 0px;
      justify-content: center;
    }
  }
</style>
