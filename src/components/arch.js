//render func
if (this.badgeScenes.length > 0) {
  for (let i = 0; i < this.badgeScenes.length; i++) {
    const badgeCont = document.getElementById('badges-container');
    const rect = badgeCont.getBoundingClientRect();
    console.log(this.b)
    if (this.badgeMesh.scale.x < 1) {
      this.badgeMesh.scale.x += 0.01;
      this.badgeMesh.scale.y += 0.01;
      this.badgeMesh.scale.z += 0.01;
    } else {
      this.badgeMesh.rotation.y += 0.01;
    }

    if (rect.bottom < 0 || rect.top > this.renderer.domElement.clientHeight ||
    rect.right < 0 || rect.left > this.renderer.domElement.clientWidth) {
      return; // it's off screen
    }

    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    const left = rect.left;
    const bottom = this.renderer.domElement.clientHeight - rect.bottom;

    this.renderer.clearDepth();

    if (this.badgeScenes.length > 0) {
      this.renderer.setViewport(left, bottom, width, height);
      this.renderer.setScissor(left, bottom, width, height);
      this.renderer.render(this.badgeScene, this.badgeCamera);
    }
  }
}

//this.renderer.autoClear = false;
      //this.renderer.clear();
      //this.renderer.setScissorTest(true);
//restart scene
let badgeTextures = [
  require("../assets/badge_star.png"),
  require("../assets/badge_star2.png"),
];

let bIndex = 0;

if (this.level == 2) {
  bIndex = 1;
} else if (this.level == 3) {
  bIndex = 2;
}

for (let i = 0; i < bIndex; i++) {
  this.badgeScene = new THREE.Scene();
  this.badgeGeo = new THREE.CylinderGeometry(1, 1, 0.1, 25);
  this.badgeCamera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 1, 100);
  this.badgeCamera.position.set(0,0,5);
  this.badgeCamera.lookAt(this.badgeScene.position);

  const badgeLoader = new THREE.TextureLoader();
  const badgeTex = badgeLoader.load(badgeTextures[i]);

  this.badgeMat = new THREE.MeshBasicMaterial({
    roughness: 0.5,
    metalness: 1,
    flatShading: true,
    map: badgeTex
  });

  this.badgeMesh = new THREE.Mesh(this.badgeGeo, this.badgeMat);
  this.badgeMesh.rotation.z = Math.PI / 2;
  this.badgeMesh.rotation.y = Math.PI / 2;
  this.badgeMesh.scale.x = 0;
  this.badgeMesh.scale.y = 0;
  this.badgeMesh.scale.z = 0;

  this.badgeScene.add(this.badgeMesh);
  this.badgeScene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444));

  const blight = new THREE.DirectionalLight(0xffffff, 0.5);
  blight.position.set(1, 1, 1);
  this.badgeScene.add(blight);
  this.badgeScenes.push(this.badgeScene);
}

animate: function () {
  if (this.$store.state.playGame == false){
    requestAnimationFrame(this.animate);
  }
  console.log(this.$store.state.currentSlide)
  // this.requestAnimation;
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
  if (this.mouseDirection === "left" && !this.fixedMesh) {
    meshRotation += 0.002;
  }
  if (this.mouseDirection === "right" && !this.fixedMesh) {
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
}

//Waves plane


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
      SEPARATION: 60, 
      AMOUNTX: 350, 
      AMOUNTY: 15,
      roadmapMesh: null,
      count: 0,
      mouseX: 0, 
      mouseY: 0,
      windowHalfX: window.innerWidth / 2,
      windowHalfY: window.innerHeight / 2,
      positions: null,
      scales: null,
      controls: null
    }
  },
  methods: {
    roadmapScene: function() {
      var container = document.getElementById('roadmap-container');

      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
      
      this.camera.position.y = 300;
      this.camera.position.z = 2000;

      this.scene = new THREE.Scene();
      
      const numParticles = this.AMOUNTX * this.AMOUNTY;

      const positions = new Float32Array(numParticles * 3);
      const scales = new Float32Array(numParticles);

      let i = 0, j = 0;
      for (let ix = 0; ix < this.AMOUNTX; ix++) {
        for (let iy = 0; iy < this.AMOUNTY; iy++) {
          positions[i] = ix * this.SEPARATION - ((this.AMOUNTX * this.SEPARATION) / 2); 
          positions[i + 1] = 0; // y
          positions[i + 2] = iy * this.SEPARATION - ((this.AMOUNTY * this.SEPARATION) / 2); 

          scales[j] = 1;

          i += 3;
          j++;
        }
      }

      this.roadmapGeo = new THREE.BufferGeometry();
      this.roadmapGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      this.roadmapGeo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
      
      this.roadmapMat = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(0x878fff) },
        },
        vertexShader: `
          attribute float scale;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
            gl_PointSize = scale * ( 300.0 / - mvPosition.z );
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          void main() {
            if (length( gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
            gl_FragColor = vec4(color, 1.0);
          }
        `
      });
      
      this.roadmapMesh = new THREE.Points(this.roadmapGeo, this.roadmapMat);
      this.scene.add(this.roadmapMesh);
      this.renderer = new THREE.WebGLRenderer({antialias: true});
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      //this.controls.minPolarAngle = 0;
		  //this.controls.maxPolarAngle = 0.5;
      this.controls.minAzimuthAngle = 0;
		  this.controls.maxAzimuthAngle = 0;
      this.controls.update();

      container.appendChild(this.renderer.domElement);
    },
    animate: function () {
      requestAnimationFrame(this.animate);
      this.controls.update();
      this.render();
    },
    render: function () {
      //this.camera.position.x += (this.mouseX - this.camera.position.x) * .05;
      //this.camera.position.y += (-this.mouseY - this.camera.position.y) * .05;
      this.camera.lookAt(this.scene.position);

      const positions = this.roadmapMesh.geometry.attributes.position.array;
      const scales = this.roadmapMesh.geometry.attributes.scale.array;

      let i = 0, j = 0;
      for (let ix = 0; ix < this.AMOUNTX; ix++) {
        for (let iy = 0; iy < this.AMOUNTY; iy++) {
          positions[i + 1] = (Math.sin((ix + this.count) * 0.1) * 150) + (Math.sin((iy + this.count) * 0.3) * 150);
          scales[j] = (Math.sin((ix + this.count) * 0.3) + 1) * 5 + (Math.sin((iy + this.count) * 0.5) + 1) * 5;

          i += 3;
          j++;
        }
      }

      this.roadmapMesh.geometry.attributes.position.needsUpdate = true;
      this.roadmapMesh.geometry.attributes.scale.needsUpdate = true;

      this.count += 0.1;
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

"#define GLSLIFY 1// 
uniform mat4 modelViewMatrix;\n// 
uniform mat4 projectionMatrix;\n// 
attribute vec3 position;
attribute vec2 fboUV;
varying float vColor;\n
varying float vAlpha;
uniform sampler2D texturePosition;\n
uniform float opacity;\n
uniform float sizeBase;\n
uniform float sizeExtra;
highp float random_1_0(vec2 co)\n{\n    
  highp float a = 12.9898;\n    
  highp float b = 78.233;\n    
  highp float c = 43758.5453;\n    
  highp float dt= dot(co.xy ,vec2(a,b));\n    
  highp float sn= mod(dt,3.14);\n    
  
  return fract(sin(sn) * c);\n}
  void main() {\n    
    vec3 pos = texture2D( texturePosition, fboUV ).xyz;    
    float r = (1.0 - cos(smoothstep(500.0, 300.0, pos.x) * 3.141592654)) * 0.5;\n    
    pos.yz *= r;    pos.x = clamp(pos.x, -500.0, 500.0);    
    vColor = random_1_0(fboUV + vec2(23.0, 31.22));    
    gl_Position = projectionMatrix * viewMatrix  * vec4( pos, 1.0 );    
    vAlpha = smoothstep(-500.0 + 200.0 * random_1_0(fboUV + 1.0), -200.0, pos.x) * 
    clamp(1000.0 / gl_Position.z, 0.0, 1.0) * opacity;    
    gl_PointSize = (sizeBase + random_1_0(fboUV) * sizeExtra) * 
    (500.0 / gl_Position.z);
  }\n",


