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
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  const TWEEN = require('@tweenjs/tween.js');
  import {
    slider_vertex,
    arrow_vertex
  } from '../assets/shaders/vertex.js';
  import {
    slider_fragment,
    arrow_fragment
  } from '../assets/shaders/fragment.js';
  export default {
    name: 'StoryScene',
    data () {
      return {
        activeSlide: 0,
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
        curveMesh: null,
        colors: [
          new THREE.Color(0xFFB36D),
          new THREE.Color(0xFF81E3),
          new THREE.Color(0x5CFFC4),
          new THREE.Color(0xF3F657)
        ],
        lineGeometry0: null,
        glowM0: null
      }
    },
    methods: {
      sliderScene: function() {
        var container = document.getElementById('story-container');
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 5000);
        this.camera.position.z = 1000;

        this.scene = new THREE.Scene();
        this.camera.lookAt(this.scene.position);

        THREE.Mesh.prototype.raycast = acceleratedRaycast;
        THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
        THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;

        var sLight = new THREE.SpotLight(0xffffff);
        this.scene.add(sLight);

        var aLight = new THREE.AmbientLight(0xffffff);
        this.scene.add(aLight);

        var directionalLight = new THREE.DirectionalLight("#fff", 2);
        directionalLight.position.set(0, 50, -20);
        this.scene.add(directionalLight);

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

        //Lighted curves
        const lineMaterial = new THREE.LineBasicMaterial({
          transparent: true,
          opacity: 0.2,
          color: this.colors[0]
        });

        const spline0 = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-1500, 500, 0),
          new THREE.Vector3(-500, 200, 0),
          new THREE.Vector3(0, 800, 0),
          new THREE.Vector3(500, 500, 0),
          new THREE.Vector3(1500, 800, 0)
        ]);

        var splinePoints0 = spline0.getPoints(4000);

        const glowG0 = new THREE.TubeGeometry(spline0, 4000, 15, 8, false);

        this.glowM = new THREE.MeshBasicMaterial({
          color: this.colors[0],
          opacity: 0.1,
          transparent: true,
          depthTest: false
        });

        const glowMesh0 = new THREE.Mesh(glowG0, this.glowM);

        this.lineGeometry0 = new THREE.BufferGeometry().setFromPoints(splinePoints0);
        const lineMesh0 = new THREE.Line(this.lineGeometry0, lineMaterial);
        lineMesh0.add(glowMesh0);
        lineMesh0.position.y = -900;
        this.scene.add(lineMesh0);
        //End Lighted curves
      },
      animate: function () {
        this.time += 0.05;

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
      window.addEventListener('pointermove', this.onPointerMove);
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
