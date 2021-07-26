<template>
  <div class="roadmap__container">
    <div id="roadmap-container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
const TWEEN = require('@tweenjs/tween.js');

export default {
  name: 'Home',
  components: {
  },
  data () {
    return {
      scene: null,
      camera: null,
      roadmapGeo: null,
      roadmapMat: null,
      roadmapMesh: null,
      renderer: null,
      roadmapMesh: null,
      mouseX: 0, 
      mouseY: 0,
      windowHalfX: window.innerWidth / 2,
      windowHalfY: window.innerHeight / 2,
      positions: null,
      controls: null,
      uniforms: null,
      isPointerDown: false,
      direction: "",
      oldY: 0,
      count: 0
    }
  },
  methods: {
    roadmapScene: function() {
      var container = document.getElementById('roadmap-container');

      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1500);
      
      //this.camera.position.y = 300;
      this.camera.position.z = 150;

      this.scene = new THREE.Scene();

      this.roadmapGeo = new THREE.PlaneBufferGeometry(2000*1.5, 80*1.5, 2000, 80);
      const loader = new THREE.TextureLoader();
      const texture = loader.load(require("../assets/wave_color.png"));

      this.uniforms = {
        tex: { type: "t", value: texture },
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

      this.roadmapMat = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPosition;
          uniform sampler2D tex;

          void main() {
            vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
            gl_PointSize = 2.;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform sampler2D tex;
          uniform vec4 resolution;
          varying vec2 vUv;
          varying vec3 vPosition;
          
          void main() {
            vec4 tt = texture2D(tex, vUv);
            gl_FragColor = vec4(vUv,0.,1.);
            gl_FragColor = tt;
          }
        `
      });

      var sLight = new THREE.SpotLight(0xffffff);
      sLight.position.set(-100, 100, 100);
      this.scene.add(sLight);

      var aLight = new THREE.AmbientLight(0xffffff);
      this.scene.add(aLight);
      
      this.roadmapMesh = new THREE.Points(this.roadmapGeo, this.roadmapMat);
      this.roadmapMesh.rotateX(90);
      this.scene.add(this.roadmapMesh);
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.moveRoadmapToStart();

      container.appendChild(this.renderer.domElement);
    },
    moveRoadmapToStart: function () {
      new TWEEN.Tween(this.roadmapMesh.position)
      .to({ x: 1100 }, 3000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();
    },
    animate: function () {
      let center = new THREE.Vector3(0,0,0);
      const theTime = performance.now() * .001;
      var pos = this.roadmapGeo.attributes.position;
      var vec3 = new THREE.Vector3(); 
      var magnitude = 5;
      var waveSize = 12;
      var rotationAngle = 0.07;

      if (this.isPointerDown) {
        this.camera.position.x += (this.mouseX * 4 - this.camera.position.x) * 0.005;
        if (this.camera.position.x < -300 || this.camera.position.x > 2500) {
          this.isPointerDown = false;
        }

        if (this.camera.position.x < -200) {
          new TWEEN.Tween(this.camera.position)
          .to({ x: -200 }, 3000)
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();
        }

        if (this.camera.position.x > 2350) {
          new TWEEN.Tween(this.camera.position)
          .to({ x: 2350 }, 3000)
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();
        }

        if (this.direction === "up" && this.roadmapMesh.rotation.x < 2.1) {
          this.roadmapMesh.rotateX(+rotationAngle);
        } 

        if (this.direction === "down" && this.roadmapMesh.rotation.x > 1.8) {
          this.roadmapMesh.rotateX(-rotationAngle);
        }
      }

      for (var i = 0, l = pos.count; i < l; i++) {
        vec3.fromBufferAttribute(pos, i);
        vec3.sub(center);
        var z = Math.sin(vec3.length() /- waveSize + (theTime)) * magnitude;
        pos.setZ(i, z);
      }

      pos.needsUpdate = true;

      /*let iSin = 0;
      for (let ix = 0, l = pos.count; ix < l; ix++) {
        for (let iy = 0, h = pos.count; iy < h; iy++) {
          pos[iSin + 1] = (Math.sin((ix + this.count) * 0.1) * 150) + (Math.sin((iy + this.count) * 0.3) * 150);

          iSin += 3;
        }
      }
      this.roadmapMesh.geometry.attributes.position.needsUpdate = true;
      this.count += 0.1;*/

      requestAnimationFrame(this.animate);
      TWEEN.update();
      this.render();
    },
    render: function () {
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.render(this.scene, this.camera);
    },
    onWindowResize: function () {
      this.windowHalfX = window.innerWidth / 2;
      this.windowHalfY = window.innerHeight / 2;

      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.render();
    },
    onPointerDown: function (event) {
      if (event.isPrimary === false) return;
      this.isPointerDown = true;
    },
    onPointerUp: function () {
      if (event.isPrimary === false) return;
      this.isPointerDown = false;

      new TWEEN.Tween(this.roadmapMesh.rotation)
      .to({ x: 2 }, 3000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();
    },
    onPointerMove: function (event) {
      if (event.isPrimary === false) return;

      if (event.pageY < this.oldY) {
        this.direction = "up";
      } else if (event.pageY > this.oldY) {
        this.direction = "down";
      }

      this.oldY = event.pageY;

      this.mouseX = event.clientX - this.windowHalfX;
      this.mouseY = event.clientY - this.windowHalfY;
    }
  },
  mounted () {
    this.roadmapScene();
    this.animate();
    document.addEventListener('mouseup', this.onPointerUp, false);
    document.addEventListener('mousedown', this.onPointerDown, false);
    window.addEventListener('resize', this.onWindowResize, false);
    window.addEventListener('pointermove', this.onPointerMove);
  }
}
</script>
<style scoped>
  .roadmap__container{
    position: relative;
    height: 100vh;
    width: 100%;
  }
</style>