<template>
  <div class="statistic__wrapper">
    <div id="statistic-container"></div>
  </div>
</template>

<script>
  import * as THREE from 'three';
  import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
  import { TessellateModifier } from 'three/examples/jsm/modifiers/TessellateModifier.js';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import {
    target_vertex,
    wave_vertex
  } from '../assets/shaders/vertex.js';
  import {
    target_fragment,
    wave_fragment
  } from '../assets/shaders/fragment.js';
  const TWEEN = require('@tweenjs/tween.js');
  export default {
    name: 'Statistic',
    data () {
      return {
        scene: null,
        cube: null,
        camera: null,
        renderer: null,
        clock: null,
        sphereMesh1: null
      }
    },
    methods: {
      myScene: function () {
        var container = document.getElementById('statistic-container');
        this.scene = new THREE.Scene();

        var light = new THREE.AmbientLight(0xffffff);
        var width = window.innerWidth;
        var height = window.innerHeight;
        
        this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
        this.camera.position.z = 1000;
        this.camera.lookAt(this.scene.position);
        
        var sLight = new THREE.SpotLight(0xffffff);
        sLight.position.set(-100, 100, 100);
        this.scene.add(sLight);
        var aLight = new THREE.AmbientLight( 0xffffff );
        this.scene.add(aLight);

        var sphereGeo1 = new THREE.SphereGeometry(200, 20, 20);
        var sphereMat1 = new THREE.MeshBasicMaterial ({
          color: 0xa2a7a9,
          wireframe: true
        });
        this.sphereMesh1 = new THREE.Mesh(sphereGeo1, sphereMat1);
        //this.sphereMesh1.position.z = -100;
        this.scene.add(this.sphereMesh1);

        var geometry = new THREE.PlaneGeometry( 1000, 1000, 1, 1 );
        var material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
        var floor = new THREE.Mesh( geometry, material );
        floor.material.side = THREE.DoubleSide;
        floor.rotation.x = 90;
        this.scene.add( floor ); 
        console.log(this.scene)

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize( width, height );
        container.appendChild(this.renderer.domElement);
      },
      animate: function() {
        requestAnimationFrame(this.animate);
        this.render();
      },
      render: function () {
        this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
        this.camera.position.y += (- this.mouseY - this.camera.position.y) * 0.05;
       
        this.renderer.render(this.scene, this.camera);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.physicallyCorrectLights = true;
      },
      onWindowResize: function() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.render();
      },
      mounted() {
        console.log('fuck')
        this.myScene();
        this.animate();
        window.addEventListener('resize', this.onWindowResize, false);
      },
    }
  }
</script>
<style scoped>
  .statistic__wrapper {
    position: fixed;
    z-index: 10000;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    width: 100%;
    height: 100vh;
  }
  #statistic-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
