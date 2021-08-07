<template>
  <div class="home-slider">
    <div id="slider-container"></div>
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
  import { Hooper, Slide } from 'hooper';
  import 'hooper/dist/hooper.css';
  import * as THREE from 'three';
  import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
  import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
  const TWEEN = require('@tweenjs/tween.js');
  import {
    slider_vertex
  } from '../assets/shaders/vertex.js';
  import {
    slider_fragment
  } from '../assets/shaders/fragment.js';
  export default {
    name: 'RoadmapSlide',
    components: {
      Hooper,
      Slide,
    },
    data () {
      return {
        activeSlide: 0,
        scene: null,
        camera: null,
        sliderGeo: null,
        sliderMat: null,
        sliderMesh: null,
        raycaster: new THREE.Raycaster(),
        mouse: new THREE.Vector2(),
        renderer: null,
        mouseX: 0,
        mouseY: 0,
        windowHalfX: window.innerWidth / 2,
        windowHalfY: window.innerHeight / 2,
        uniforms: null,
        roadmapVertex: slider_vertex,
        roadmapFragment: slider_fragment,
        time: 0,
        renderScene: null,
        bloomPass: null,
				params: {
          exposure: 1,
          bloomStrength: 0,
          bloomThreshold: 0,
          bloomRadius: 0
        },
				composer: null
      }
    },
    methods: {
      sliderScene: function() {
        var container = document.getElementById('slider-container');
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 5000);
        this.camera.position.z = 1000;

        this.scene = new THREE.Scene();
        this.sliderGeo = new THREE.PlaneBufferGeometry(820*1.5, 480*1.5, 820, 480);

        const loader = new THREE.TextureLoader();
        const texture = loader.load(require("../assets/btc.jpg"));
        const texture1 = loader.load(require("../assets/eth.jpg"));

        this.uniforms = {
          tex: { type: "t", value: texture },
          tex1: { type: "t", value: texture1 },
          time: { type: "f", value: 0.0 },
          progress: { type: "f", value: 0.0 },
          distortion: { type: "f", value: 0.0 },
          resolution: { type: "v4", value: new THREE.Vector4() }
        };

        let asp1, asp2;
        if (window.innerHeight / window.innerWidth > this.imageAspect) {
          asp1 = (window.innerWidth / window.innerHeight) * this.imageAspect;
          asp2 = 1;
        } else {
          asp1 = 1;
          asp2 = (window.innerHeight / window.innerWidth) / this.imageAspect;
        }

        this.uniforms.resolution.value.x = window.innerWidth;
        this.uniforms.resolution.value.y = window.innerHeight;
        this.uniforms.resolution.value.z = asp1;
        this.uniforms.resolution.value.w = asp2;

        this.sliderMat = new THREE.ShaderMaterial({
          uniforms: this.uniforms,
          vertexShader: this.roadmapVertex,
          fragmentShader: this.roadmapFragment
        });

        var sLight = new THREE.SpotLight(0xffffff);
        this.scene.add(sLight);

        var aLight = new THREE.AmbientLight(0xffffff);
        this.scene.add(aLight);

        var directionalLight = new THREE.DirectionalLight("#fff", 2);
        directionalLight.position.set(0, 50, -20);
        this.scene.add(directionalLight);

        this.sliderMesh = new THREE.Points(this.sliderGeo, this.sliderMat);
        this.scene.add(this.sliderMesh);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);

        this.renderScene = new RenderPass(this.scene, this.camera);

				this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
				this.bloomPass.threshold = this.params.bloomThreshold;
				this.bloomPass.strength = this.params.bloomStrength;
				this.bloomPass.radius = this.params.bloomRadius;

				this.composer = new EffectComposer( this.renderer );
				this.composer.addPass( this.renderScene );
				this.composer.addPass( this.bloomPass );
        // this.disposeImage();
      },
      disposeImage: function () {
        var cA = new TWEEN.Tween(this.uniforms.distortion)
        .to({ value: 3 }, 2000)
        .easing(TWEEN.Easing.Cubic.InOut);

        var cB = new TWEEN.Tween(this.uniforms.distortion)
        .to({ value: 0 }, 2000)
        .easing(TWEEN.Easing.Cubic.InOut);

        cA.chain(cB);
        cA.start();

        setTimeout(() => {
          this.uniforms.progress.value = 1;
        }, 1500);

        var A = new TWEEN.Tween(this.bloomPass)
        .to({ strength: 7 }, 2000)
        .easing(TWEEN.Easing.Cubic.In);

        var B = new TWEEN.Tween(this.bloomPass)
        .to({ strength: 0 }, 2000)
        .easing(TWEEN.Easing.Cubic.Out);

        A.chain(B);
        A.start();
      },
      animate: function () {
        this.time += 0.05;
        this.uniforms.time.value = this.time;
        //this.uniforms.distortion.value = 0;

        requestAnimationFrame(this.animate);

        TWEEN.update();
        this.render();
      },
      render: function () {
        //this.renderer.render(this.scene, this.camera);
        //this.renderer.setPixelRatio(window.devicePixelRatio);
        this.composer.render();
      },
      onWindowResize: function () {
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);

        this.render();
      },
      handleScroll (event) {
        console.log('hii')
      },
      updateCarousel (payload) {
        // this.$store.commit('changeSlide', payload.currentSlide);
        // this.$store.commit('setChangeSlide', true);
      }
    },
    mounted () {
      this.sliderScene();
      this.animate();
      document.addEventListener('click', this.disposeImage);
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
