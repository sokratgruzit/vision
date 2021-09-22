<template>
  <div class="home-slider">
    <div id="story-container"></div>
  </div>
</template>

<script>
  import * as THREE from 'three';
  import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
  import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
  const TWEEN = require('@tweenjs/tween.js');
  import {
    globe_vertex
  } from '../assets/shaders/vertex.js';
  import {
    globe_fragment
  } from '../assets/shaders/fragment.js';
  export default {
    name: 'StoryScene',
    data () {
      return {
        scene: null,
        camera: null,
        raycaster: new THREE.Raycaster(),
        mouse: new THREE.Vector2(),
        renderer: null,
        mouseX: 0,
        mouseY: 0,
        windowHalfX: window.innerWidth / 2,
        windowHalfY: window.innerHeight / 2,
        time: 0,
        renderScene: null,
        bloomPass: null,
				params: {
          exposure: 1,
          bloomStrength: 0,
          bloomThreshold: 0,
          bloomRadius: 0
        },
				composer: null,
        colors: [
          new THREE.Color(0xFFB36D),
          new THREE.Color(0xFF81E3),
          new THREE.Color(0x5CFFC4),
          new THREE.Color(0xF3F657)
        ],
        mouseDown: false,
        mesh: null,
        tronBlocks: [],
        uniforms: null,
        globe: null
      }
    },
    methods: {
      storyScene: function() {
        var container = document.getElementById('story-container');
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
        //this.camera.position.set(0, -100, 250);
        this.camera.position.z = 180;

        this.scene = new THREE.Scene();

        THREE.Mesh.prototype.raycast = acceleratedRaycast;
        THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
        THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;

        var directionalLight = new THREE.DirectionalLight("#ff7152", 2);
        directionalLight.position.set(0, 50, 200);
        this.scene.add(directionalLight);

        var aLight = new THREE.AmbientLight("#ff7152");
        aLight.position.set(100, 100, 1000);
        this.scene.add(aLight);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);

        this.renderScene = new RenderPass(this.scene, this.camera);

				this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
				this.bloomPass.threshold = this.params.bloomThreshold;
				this.bloomPass.strength = this.params.bloomStrength;
				this.bloomPass.radius = this.params.bloomRadius;

				this.composer = new EffectComposer(this.renderer);
				this.composer.addPass(this.renderScene);
				this.composer.addPass(this.bloomPass);

        const material = new THREE.MeshLambertMaterial({
          wireframe: false,
          color: 0xff7152,
          transparent: true,
          opacity: 0.3
        });

        const geometry = new THREE.PlaneBufferGeometry(500, 500, 500, 500);
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -1;
        //this.scene.add(this.mesh);

        //this.createSpace();
        //this.animateSpace();

        const g = new THREE.SphereBufferGeometry(
          100,
          200,
          200
        );

        const loader = new THREE.TextureLoader();

        let texture = loader.load(require("../assets/world_map.png"));

        this.uniforms = {
          tex: { type: "t", value: texture },
          time: { type: "f", value: 0.0 },
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

        const m = new THREE.ShaderMaterial({
          uniforms: this.uniforms,
          vertexShader: globe_vertex,
          fragmentShader: globe_fragment
        });
        this.globe = new THREE.Points(g, m);
        this.scene.add(this.globe);
        this.globe.position.set(0, -100, 0);
      },
      createSpace: function () {
        let xStep = -100;
        let yStep = -200;
        for (let i = 0; i < 20; i++) {
          const material = new THREE.MeshLambertMaterial({
            wireframe: false,
            color: 0xff7152,
            transparent: true
          });

          const geometry = new THREE.BoxBufferGeometry(20, 20, 50);
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(xStep, yStep, -26);
          xStep = xStep + 20;

          if (i === 9) {
            yStep = yStep + 25;
            xStep = -100;
          }

          this.tronBlocks.push(mesh);
          this.mesh.add(this.tronBlocks[i]);
        }
      },
      animateSpace: function () {
        for (let i = 0; i < this.tronBlocks.length; i++) {
          let minTime = 10000;
          let maxTime = 15000;
          let maxRange = 5
          let delay = 0;

          switch (true) {
            case (i < 10):
              break;
            case (i < 20):
              maxRange = 15;
              delay = 5000;
              break;
            default:
              break;
          }

          setTimeout(() => {
            new TWEEN.Tween(this.tronBlocks[i].position)
            .to({ z: this.randomRange(-20, maxRange) }, this.randomRange(minTime, maxTime))
            .easing(TWEEN.Easing.Quintic.Out)
            .start();
          }, delay);
        }

        new TWEEN.Tween(this.camera.position)
        .to({ y: -100, z: 400 }, 5000)
        .easing(TWEEN.Easing.Quintic.Out)
        
      },
      randomRange: function (min, max) {  
        return Math.floor(
          Math.random() * (max - min) + min
        );
      },
      bloom: function (value) {
        new TWEEN.Tween(this.bloomPass)
        .to({ strength: value }, 500)
        .easing(TWEEN.Easing.Cubic.In)
        .start();
      },
      animate: function () {
        this.time += 0.05;
        this.globe.rotation.x += 0.001;
        this.globe.rotation.y += 0.001;

        requestAnimationFrame(this.animate);

        TWEEN.update();
        this.render();
      },
      render: function () {
        //this.renderer.render(this.scene, this.camera);
        //this.renderer.setPixelRatio(window.devicePixelRatio);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.raycaster.firstHitOnly = true;
        this.composer.render();
      },
      onWindowResize: function () {
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        //this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);

        this.render();
      },
      onPointerMove: function (event) {
        if (event.isPrimary === false) return;

        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      },
      onPointerDown: function () {
        this.mouseDown = true;
        this.bloom(0.5);
      },
      onPointerUp: function () {
        this.mouseDown = false;
        this.bloom(0);
      },
      handleScroll (event) {
        console.log('hii')
      }
    },
    mounted () {
      this.storyScene();
      this.animate();
      this.$store.commit('setHeader', false);
      //window.addEventListener('pointermove', this.onPointerMove);
      document.addEventListener('mouseup', this.onPointerUp, false);
      document.addEventListener('mousedown', this.onPointerDown, false);
    }
  }
</script>
<style>
  #map {
    width: 4312px;
    height: 2128px;
  }
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
