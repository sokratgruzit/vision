<template>
  <div>
    <div id="about-container"></div>
  </div>
</template>

<script>
  import * as THREE from 'three';
  import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
  import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
  import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
  const TWEEN = require('@tweenjs/tween.js');
  export default {
    name: 'About',
    data () {
      return {
        scene: null,
        logo: null,
        camera: null,
        renderer: null,
        time: 0,
        raycaster: new THREE.Raycaster(),
        mouse: new THREE.Vector2(),
        isDragging: false,
        direction: "",
        directionX: "",
        oldX: 0,
        oldY: 0
      }
    },
    methods: {
      myScene: function () {
        var container = document.getElementById('about-container');
        this.scene = new THREE.Scene();

        var width = window.innerWidth;
        var height = window.innerHeight;

        this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 5000);
        this.camera.position.z = 2500;
        this.camera.position.y = 600;

        var sLight = new THREE.PointLight(0xff00ff);
        sLight.position.set(-100, 100, 100);
        this.scene.add(sLight);
        var aLight = new THREE.DirectionalLight(0xffffff);
        aLight.position.set( 0, 0, 1 );
        this.scene.add(aLight);

        var sphereGeo1 = new THREE.SphereBufferGeometry(200, 40, 40);
        var sphereMat1 = new THREE.MeshLambertMaterial({
          color: 0xffff00,
          wireframe: true
        });
        this.logo = new THREE.Mesh(sphereGeo1, sphereMat1);
        this.scene.add(this.logo);

        THREE.Mesh.prototype.raycast = acceleratedRaycast;
        THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
        THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        container.appendChild(this.renderer.domElement);
      },
      animate: function() {
        TWEEN.update();
        requestAnimationFrame(this.animate);
        this.render();
      },
      render: function () {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.raycaster.firstHitOnly = true;
        this.renderer.render(this.scene, this.camera);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.physicallyCorrectLights = true
      },
      onWindowResize: function() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
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

        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
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
    },
  }
</script>
<style scoped>
</style>
