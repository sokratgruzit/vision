<template>
  <div class="roadmap__container">
    <div id="roadmap-container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
      uniforms: null
    }
  },
  methods: {
    roadmapScene: function() {
      var container = document.getElementById('roadmap-container');

      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1500);
      
      //this.camera.position.y = 300;
      this.camera.position.z = 150;

      this.scene = new THREE.Scene();

      this.roadmapGeo = new THREE.PlaneBufferGeometry(2000*1.5, 100*1.5, 2000, 100);
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
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.update();

      container.appendChild(this.renderer.domElement);
    },
    animate: function () {
      var pos = this.roadmapGeo.attributes.position;
      var vec3 = new THREE.Vector3(); // for re-use
      var magnitude = 5;
      var waveSize = 12;

      const theTime = performance.now() * .001;
      for (var i = 0, l = pos.count; i < l; i++) {
        vec3.fromBufferAttribute(pos, i);
        var z = Math.sin(vec3.length() /- waveSize + (theTime)) * magnitude;
        var y = Math.sin(vec3.length() /- waveSize + (theTime)) * magnitude;
        pos.setZ(i, z);
      }

      pos.needsUpdate = true;
      requestAnimationFrame(this.animate);
      this.controls.update();
      this.render();
    },
    render: function () {
      //this.camera.position.x += (this.mouseX - this.camera.position.x) * .05;
      //this.camera.position.y += (-this.mouseY - this.camera.position.y) * .05;
      this.camera.lookAt(this.scene.position);

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
    onPointerMove: function (event) {
      if (event.isPrimary === false) return;

      this.mouseX = event.clientX - this.windowHalfX;
      this.mouseY = event.clientY - this.windowHalfY;
    }
  },
  mounted () {
    this.roadmapScene();
    this.animate();
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