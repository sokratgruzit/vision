<template>
  <div>
    <div id="roadmap-container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
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
      raycaster: new THREE.Raycaster(),
      mouse: new THREE.Vector2(),
      renderer: null,
      raycaster: new THREE.Raycaster(),
      mouseX: 0,
      mouseY: 0,
      windowHalfX: window.innerWidth / 2,
      windowHalfY: window.innerHeight / 2,
      positions: null,
      controls: null,
      uniforms: null,
      lineUniforms: null,
      isPointerDown: false,
      direction: "",
      oldY: 0,
      count: 0,
      partMat: null,
      partGeo: null,
      particles: null,
      roadmapVertex: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform sampler2D tex;
        varying float noise;
        uniform float time;

        vec3 mod289(vec3 x)
        {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 mod289(vec4 x)
        {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 permute(vec4 x)
        {
          return mod289(((x*34.0)+1.0)*x);
        }

        vec4 taylorInvSqrt(vec4 r)
        {
          return 1.79284291400159 - 0.85373472095314 * r;
        }

        vec3 fade(vec3 t) {
          return t*t*t*(t*(t*6.0-15.0)+10.0);
        }

        // Classic Perlin noise, periodic variant
        float pnoise(vec3 P, vec3 rep)
        {
          vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
          vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
          Pi0 = mod289(Pi0);
          Pi1 = mod289(Pi1);
          vec3 Pf0 = fract(P); // Fractional part for interpolation
          vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
          vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
          vec4 iy = vec4(Pi0.yy, Pi1.yy);
          vec4 iz0 = Pi0.zzzz;
          vec4 iz1 = Pi1.zzzz;

          vec4 ixy = permute(permute(ix) + iy);
          vec4 ixy0 = permute(ixy + iz0);
          vec4 ixy1 = permute(ixy + iz1);

          vec4 gx0 = ixy0 * (1.0 / 7.0);
          vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
          gx0 = fract(gx0);
          vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
          vec4 sz0 = step(gz0, vec4(0.0));
          gx0 -= sz0 * (step(0.0, gx0) - 0.5);
          gy0 -= sz0 * (step(0.0, gy0) - 0.5);

          vec4 gx1 = ixy1 * (1.0 / 7.0);
          vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
          gx1 = fract(gx1);
          vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
          vec4 sz1 = step(gz1, vec4(0.0));
          gx1 -= sz1 * (step(0.0, gx1) - 0.5);
          gy1 -= sz1 * (step(0.0, gy1) - 0.5);

          vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
          vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
          vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
          vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
          vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
          vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
          vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
          vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

          vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
          g000 *= norm0.x;
          g010 *= norm0.y;
          g100 *= norm0.z;
          g110 *= norm0.w;
          vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
          g001 *= norm1.x;
          g011 *= norm1.y;
          g101 *= norm1.z;
          g111 *= norm1.w;

          float n000 = dot(g000, Pf0);
          float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
          float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
          float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
          float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
          float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
          float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
          float n111 = dot(g111, Pf1);

          vec3 fade_xyz = fade(Pf0);
          vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
          vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
          float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
          return 2.2 * n_xyz;
        }

        float turbulence( vec3 p ) {
          float w = 100.0;
          float t = -.5;
          for (float f = 1.0 ; f <= 10.0 ; f++ ){
            float power = pow( 2.0, f );
            t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
          }
          return t;
        }

        void main() {
          vUv = uv;

          noise = 10.0 *  -.10 * turbulence( .5 * normal + time );
          float b = 5.0 * pnoise( 0.05 * position + vec3( 2.0 * time ), vec3( 100.0 ) );
          float displacement = - noise + b * 2.2;
          vec3 newPosition = position + normal * displacement;
          vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.);
          gl_PointSize = .5;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      roadmapFragment: `
        uniform sampler2D tex;
        uniform vec4 resolution;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying float noise;

        void main() {
          vec3 color = vec3( vUv * ( 1. - 2. * noise ), 0.0 );
          vec4 tt = texture2D(tex, vUv);
          gl_FragColor = vec4(vUv,0.,1.);
          gl_FragColor = tt;
        }
      `,
      lineVertex: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform sampler2D tex;
        varying float noise;
        uniform float time;

        vec3 mod289(vec3 x)
        {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 mod289(vec4 x)
        {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 permute(vec4 x)
        {
          return mod289(((x*34.0)+1.0)*x);
        }

        vec4 taylorInvSqrt(vec4 r)
        {
          return 1.79284291400159 - 0.85373472095314 * r;
        }

        vec3 fade(vec3 t) {
          return t*t*t*(t*(t*6.0-15.0)+10.0);
        }

        // Classic Perlin noise, periodic variant
        float pnoise(vec3 P, vec3 rep)
        {
          vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
          vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
          Pi0 = mod289(Pi0);
          Pi1 = mod289(Pi1);
          vec3 Pf0 = fract(P); // Fractional part for interpolation
          vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
          vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
          vec4 iy = vec4(Pi0.yy, Pi1.yy);
          vec4 iz0 = Pi0.zzzz;
          vec4 iz1 = Pi1.zzzz;

          vec4 ixy = permute(permute(ix) + iy);
          vec4 ixy0 = permute(ixy + iz0);
          vec4 ixy1 = permute(ixy + iz1);

          vec4 gx0 = ixy0 * (1.0 / 7.0);
          vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
          gx0 = fract(gx0);
          vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
          vec4 sz0 = step(gz0, vec4(0.0));
          gx0 -= sz0 * (step(0.0, gx0) - 0.5);
          gy0 -= sz0 * (step(0.0, gy0) - 0.5);

          vec4 gx1 = ixy1 * (1.0 / 7.0);
          vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
          gx1 = fract(gx1);
          vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
          vec4 sz1 = step(gz1, vec4(0.0));
          gx1 -= sz1 * (step(0.0, gx1) - 0.5);
          gy1 -= sz1 * (step(0.0, gy1) - 0.5);

          vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
          vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
          vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
          vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
          vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
          vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
          vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
          vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

          vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
          g000 *= norm0.x;
          g010 *= norm0.y;
          g100 *= norm0.z;
          g110 *= norm0.w;
          vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
          g001 *= norm1.x;
          g011 *= norm1.y;
          g101 *= norm1.z;
          g111 *= norm1.w;

          float n000 = dot(g000, Pf0);
          float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
          float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
          float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
          float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
          float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
          float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
          float n111 = dot(g111, Pf1);

          vec3 fade_xyz = fade(Pf0);
          vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
          vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
          float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
          return 2.2 * n_xyz;
        }

        float turbulence( vec3 p ) {
            float w = 100.0;
            float t = -.5;
            for (float f = 1.0 ; f <= 10.0 ; f++ ){
              float power = pow( 2.0, f );
              t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
            }
            return t;
        }

        void main() {
          vUv = uv;

          noise = 10.0 *  -.10 * turbulence( .5 * normal + time );
          float b = 5.0 * pnoise( 0.05 * position + vec3( 2.0 * time ), vec3( 100.0 ) );
          float displacement = - noise + b * 2.2;
          vec3 newPosition = position + normal * displacement;
          vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.);
          gl_PointSize = 3.5;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      lineFragment: `
        uniform sampler2D tex;
        uniform vec4 resolution;
        uniform float opacity;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying float noise;

        void main() {
          //vec3 color = vec3( vUv * ( 5. - 2. * noise ), 0.0 );
          vec4 tt = texture2D(tex, vUv);
          gl_FragColor = vec4(vUv,0.,1.);
          gl_FragColor = tt * opacity;
        }
      `,
      partVertex: `
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
      partFragment: `
        varying vec3 vColor;
        uniform sampler2D pointTexture;
        varying float vAlpha;

        void main() {
          gl_FragColor = vec4(vColor, vAlpha);
          gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
        }
      `,
      meshPartMat: null,
      meshPartGeo: null,
      meshParticles: null,
      meshBubles: 16,
      yD: [0, 30, 10, 15, 5, 0, -10, -20, -15, 0, 10, 20, 15, 5, -10, -15],
      xD: [-1400, -1200, -1100, -900, -750, -450, -250, -100, 100, 250, 450, 750, 950, 1100, 1200, 1400],
      itemSize: 0,
      itemAlpha: 0,
      int0: null,
      int1: null,
      int2: null,
      int3: null,
      int4: null,
      int5: null,
      int6: null,
      int7: null,
      int8: null,
      int9: null,
      int10: null,
      int11: null,
      int12: null,
      int13: null,
      int14: null,
      int15: null
    }
  },
  methods: {
    roadmapScene: function() {
      var container = document.getElementById('roadmap-container');

      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1500);
      //this.camera.position.y = 300;
      this.camera.position.z = 150;

      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x878FFF, 10, 1000);
      this.roadmapGeo = new THREE.PlaneBufferGeometry(2000*1.5, 80*1.5, 2000, 80);

      const loader = new THREE.TextureLoader();
      const texture = loader.load(require("../assets/wave_color.png"));

      THREE.Mesh.prototype.raycast = acceleratedRaycast;

      this.uniforms = {
        tex: { type: "t", value: texture },
        time: { type: "f", value: 0.0 },
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
        vertexShader: this.roadmapVertex,
        fragmentShader: this.roadmapFragment
      });

      var sLight = new THREE.SpotLight(0xffffff);
      //sLight.position.set(-100, 100, 100);
      this.scene.add(sLight);

      var aLight = new THREE.AmbientLight(0xffffff);
      this.scene.add(aLight);

      var directionalLight = new THREE.DirectionalLight("#fff", 2);
      directionalLight.position.set(0, 50, -20);
      this.scene.add(directionalLight);

      this.roadmapMesh = new THREE.Points(this.roadmapGeo, this.roadmapMat);
      this.roadmapMesh.receiveShadow = true;
      this.roadmapMesh.rotateX(90);
      this.scene.add(this.roadmapMesh);

      const partLoader = new THREE.TextureLoader();
      const partTexture = partLoader.load(require("../assets/circle2.png"));

      this.partUniforms = {
        pointTexture: { type: "t", value: partTexture },
        uCameraPos: { type: "3f", value: new THREE.Vector3(0, 0, 1000) },
      };

      this.partMat = new THREE.ShaderMaterial({
        uniforms:       this.partUniforms,
        vertexShader:   this.partVertex,
        fragmentShader: this.partFragment,
        transparent:    true,
        depthTest:      false,
        blending:       THREE.AdditiveBlending
      });

      var variance = 2.5 * (Math.random() + Math.random() + Math.random()) / 3.0;
      var stars = 1000;

      var vertices = new Float32Array((stars) * 3);
      var colors = new Float32Array((stars) * 3);
      var alphas = new Float32Array((stars) * 1);
      var sizes = new Float32Array((stars) * 1);

      for (let i = 0; i < stars; ++i) {
        var f = (stars - i) / (stars);
        var g = i / (stars);

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

        colors[i * 3 + 0] = 1.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 1.0;

        alphas[i] = 0.05 + Math.random() * 0.01;
        sizes[i] = (Math.random() * Math.random() * 100.0) * 2;
      }

      this.partGeo = new THREE.BufferGeometry();
      this.partGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      this.partGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      this.partGeo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
      this.partGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      this.particles = new THREE.Points(this.partGeo, this.partMat);
      this.scene.add(this.particles);

      //Mesh particles
      THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
      THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
      THREE.Mesh.prototype.raycast = acceleratedRaycast;

      var meshBubles = 16;
      let yD = [0, 30, 10, 15, 5, 0, -10, -20, -15, 0, 10, 20, 15, 5, -10, -15];
      let xD = [-1400, -1200, -1100, -900, -750, -450, -250, -100, 100, 250, 450, 750, 950, 1100, 1200, 1400];

      for (let i = 0; i < meshBubles; ++i) {
        let bSize = 3;
        if (i == 0 || i == 1 || i == 6 || i == 11) {
          bSize = 10;
        }
        this.meshPartGeo = new THREE.SphereBufferGeometry(bSize, 32, 32);
        this.meshPartMat = new THREE.MeshBasicMaterial({
          color: 0xFFFFFF
        });


        const tooltipLineMat = new THREE.LineBasicMaterial({
          color: 0xffffff
        });
        const linePoints = [];
        linePoints.push(new THREE.Vector3(0, 0, 100));
        linePoints.push(new THREE.Vector3(0, 0, 0));

        const tooltipLineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        const tooltipLineMesh = new THREE.Line(tooltipLineGeo, tooltipLineMat, THREE.LineSegments);

        tooltipLineMesh.position.z = 100;
        tooltipLineMesh.scale.x = 0;
        tooltipLineMesh.scale.y = 0;
        tooltipLineMesh.scale.z = 0;


        this.meshParticles = new THREE.Mesh(this.meshPartGeo, this.meshPartMat);

        this.meshParticles.add(tooltipLineMesh);
        this.meshPartGeo.computeBoundsTree();
        this.meshParticles.position.setY(this.yD[i]);
        this.meshParticles.position.setX(this.xD[i]);
        this.roadmapMesh.add(this.meshParticles);
      }
      //End Mesh particles

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setClearColor(0x878FFF, 0.2);
      this.moveRoadmapToStart();

      //Create Horizontal Lines
      const lineLoader = new THREE.TextureLoader();
      const lineTexture = lineLoader.load(require("../assets/fire.jpg"));

      this.lineUniforms = {
        tex: { type: "t", value: lineTexture },
        opacity: { type: "c", value: 0.0 },
        time: { type: "f", value: 0.0 },
        resolution: { type: "v4", value: new THREE.Vector4() }
      };

      this.lineUniforms.resolution.value.x = window.innerWidth;
      this.lineUniforms.resolution.value.y = window.innerHeight;
      this.lineUniforms.resolution.value.z = asp1;
      this.lineUniforms.resolution.value.w = asp2;

      const lineMaterial = new THREE.ShaderMaterial({
        uniforms: this.lineUniforms,
        vertexShader: this.lineVertex,
        fragmentShader: this.lineFragment,
        transparent: true
      });

      const lineGeometry = new THREE.PlaneBufferGeometry(2000*1.5, 1, 2000, 1);
      const lineMesh = new THREE.Points(lineGeometry, lineMaterial);
      this.roadmapMesh.add(lineMesh);
      console.log(this.roadmapMesh.children[1])
      //End Create Horizontal Lines

      container.appendChild(this.renderer.domElement);
    },
    moveRoadmapToStart: function () {
      new TWEEN.Tween(this.roadmapMesh.position)
      .to({ x: 1100 }, 3000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();
    },
    showRoadmapPath: function (year, action) {
      const lineLoader = new THREE.TextureLoader();
      let lMesh = this.roadmapMesh.children[16].material.uniforms;
      let texture;

      if (year === '2021' && action === 'show') {
        texture = require("../assets/metal.jpg");
      }

      if (year === '2022' && action === 'show') {
        this.roadmapMesh.children[16].position.y = 25;
        texture = require("../assets/space.jpg");
      }

      if (year === '2023' && action === 'show') {
        this.roadmapMesh.children[16].position.y = -50;
        texture = require("../assets/fire.jpg");
      }

      let lineTexture = lineLoader.load(texture);
      if (action === 'show') {
        lMesh.tex.value = lineTexture;
      }

      this.roadmapMesh.children[16].material.uniformsNeedUpdate = true;

      new TWEEN.Tween(lMesh.opacity)
      .to({ value: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();
    },
    calcRoadmapPathPos: function (action) {
      //y = 30, x = 900;
      let lPos = this.roadmapMesh.children[16].geometry.attributes.position;
      let offset = 0;
      let yDelta = 0;
      for (let i = 0; i < lPos.array.length; i++) {
        if (lPos.array[offset] < this.xD[1]) {
          if (action === 'new') {
            lPos.array[offset + 1] = lPos.array[offset + 1] - yDelta;
          } else {
            lPos.array[offset + 1] = 0;
          }
        }
        offset += 3;
        yDelta -= 0.001;
      }
      lPos.needsUpdate = true;
    },
    animate: function () {
      const theTime = performance.now() * 0.001;

      this.roadmapMat.uniforms.time.value = theTime / 10;
      this.lineUniforms.time.value = theTime / 10;

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

        if (this.direction === "up" && this.roadmapMesh.rotation.x > 1.8) {
          this.roadmapMesh.rotation.x -= 0.01;
        }

        if (this.direction === "down" && this.roadmapMesh.rotation.x < 2.3) {
          this.roadmapMesh.rotation.x += 0.01;
        }
      }

      let partZSin = Math.sin(theTime);
      this.particles.position.z = this.particles.position.z / 1.1 + partZSin / 2;
      this.particles.position.y = this.particles.position.y / 1.1 + partZSin / 2;
      this.particles.position.x = this.particles.position.x / 1.1 + partZSin / 2;
      this.meshParticles.position.y = this.meshParticles.position.y / 1.1 + partZSin / 2;

      if (this.$store.state.stopRoadmap == false){
        requestAnimationFrame(this.animate);
      }
      TWEEN.update();
      this.render();
    },
    render: function () {
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.render(this.scene, this.camera);
    },
    wheelScroll: function(event) {
      if (event.isPrimary === false) return;

      this.mouseX = event.clientX - this.windowHalfX;

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

      this.camera.position.x += (this.mouseX * 100 - this.camera.position.x) * 0.005;
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

      this.particles.rotation.y = this.mouseX * 0.0001;
      this.particles.rotation.x = this.mouseY * 0.0001;

      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      this.raycaster.firstHitOnly = true;
      this.int0 = this.raycaster.intersectObjects([this.scene.children[3].children[0]]);
      this.int1 = this.raycaster.intersectObjects([this.scene.children[3].children[1]]);
      this.int2 = this.raycaster.intersectObjects([this.scene.children[3].children[2]]);
      this.int3 = this.raycaster.intersectObjects([this.scene.children[3].children[3]]);
      this.int4 = this.raycaster.intersectObjects([this.scene.children[3].children[4]]);
      this.int5 = this.raycaster.intersectObjects([this.scene.children[3].children[5]]);
      this.int6 = this.raycaster.intersectObjects([this.scene.children[3].children[6]]);
      this.int7 = this.raycaster.intersectObjects([this.scene.children[3].children[7]]);
      this.int8 = this.raycaster.intersectObjects([this.scene.children[3].children[8]]);
      this.int9 = this.raycaster.intersectObjects([this.scene.children[3].children[9]]);
      this.int10 = this.raycaster.intersectObjects([this.scene.children[3].children[10]]);
      this.int11 = this.raycaster.intersectObjects([this.scene.children[3].children[11]]);
      this.int12 = this.raycaster.intersectObjects([this.scene.children[3].children[12]]);
      this.int13 = this.raycaster.intersectObjects([this.scene.children[3].children[13]]);
      this.int14 = this.raycaster.intersectObjects([this.scene.children[3].children[14]]);
      this.int15 = this.raycaster.intersectObjects([this.scene.children[3].children[15]]);

      if (this.int0.length > 0) {
        new TWEEN.Tween(this.int0[0].object.scale)
        .to({ x: 1.2, y: 1.2, z: 1.2 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      } else {
        new TWEEN.Tween(this.scene.children[3].children[0].scale)
        .to({ x: 1, y: 1, z: 1 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }

      if (this.int1.length > 0) {
        this.calcRoadmapPathPos('new');
        new TWEEN.Tween(this.int1[0].object.scale)
        .to({ x: 1.2, y: 1.2, z: 1.2 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        this.showRoadmapPath(
          '2021',
          'show'
        );
        //this.runOnce = false;
      } else {
        this.calcRoadmapPathPos('default');
        new TWEEN.Tween(this.scene.children[3].children[1].scale)
        .to({ x: 1, y: 1, z: 1 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        this.showRoadmapPath(
          '2021',
          'hide'
        );
      }

      if (this.int2.length > 0) {
        new TWEEN.Tween(this.int2[0].object.scale)
        .to({ x: 1.2, y: 1.2, z: 1.2 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        this.showRoadmapPath(
          '2022',
          'show'
        );
      } else {
        new TWEEN.Tween(this.scene.children[3].children[2].scale)
        .to({ x: 1, y: 1, z: 1 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        this.showRoadmapPath(
          '2022',
          'hide'
        );
      }

      if (this.int3.length > 0) {
        new TWEEN.Tween(this.int3[0].object.scale)
        .to({ x: 1.2, y: 1.2, z: 1.2 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        this.showRoadmapPath(
          '2023',
          'show'
        );
      } else {
        new TWEEN.Tween(this.scene.children[3].children[3].scale)
        .to({ x: 1, y: 1, z: 1 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        this.showRoadmapPath(
          '2023',
          'hide'
        );
      }

      if (this.int4.length > 0) {
        new TWEEN.Tween(this.int4[0].object.scale)
        .to({ x: 1.2, y: 1.2, z: 1.2 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      } else {
        new TWEEN.Tween(this.scene.children[3].children[4].scale)
        .to({ x: 1, y: 1, z: 1 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }

      if (this.int5.length > 0) {
        new TWEEN.Tween(this.int5[0].object.scale)
        .to({ x: 1.2, y: 1.2, z: 1.2 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      } else {
        new TWEEN.Tween(this.scene.children[3].children[5].scale)
        .to({ x: 1, y: 1, z: 1 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }

      if (this.int6.length > 0) {
        new TWEEN.Tween(this.int6[0].object.scale)
        .to({ x: 1.2, y: 1.2, z: 1.2 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      } else {
        new TWEEN.Tween(this.scene.children[3].children[6].scale)
        .to({ x: 1, y: 1, z: 1 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }

      if (this.int7.length > 0) {
        new TWEEN.Tween(this.int7[0].object.scale)
        .to({ x: 1.2, y: 1.2, z: 1.2 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      } else {
        new TWEEN.Tween(this.scene.children[3].children[7].scale)
        .to({ x: 1, y: 1, z: 1 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }

      if (this.int8.length > 0) {
        new TWEEN.Tween(this.int8[0].object.scale)
        .to({ x: 1.2, y: 1.2, z: 1.2 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      } else {
        new TWEEN.Tween(this.scene.children[3].children[8].scale)
        .to({ x: 1, y: 1, z: 1 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }

      if (this.int9.length > 0) {
        new TWEEN.Tween(this.int9[0].object.scale)
        .to({ x: 1.2, y: 1.2, z: 1.2 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      } else {
        new TWEEN.Tween(this.scene.children[3].children[9].scale)
        .to({ x: 1, y: 1, z: 1 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }

      if (this.int10.length > 0) {
        new TWEEN.Tween(this.int10[0].object.scale)
        .to({ x: 1.2, y: 1.2, z: 1.2 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      } else {
        new TWEEN.Tween(this.scene.children[3].children[10].scale)
        .to({ x: 1, y: 1, z: 1 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }

      if (this.int11.length > 0) {
        new TWEEN.Tween(this.int11[0].object.scale)
        .to({ x: 1.2, y: 1.2, z: 1.2 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      } else {
        new TWEEN.Tween(this.scene.children[3].children[11].scale)
        .to({ x: 1, y: 1, z: 1 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }

      if (this.int12.length > 0) {
        new TWEEN.Tween(this.int12[0].object.scale)
        .to({ x: 1.2, y: 1.2, z: 1.2 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      } else {
        new TWEEN.Tween(this.scene.children[3].children[12].scale)
        .to({ x: 1, y: 1, z: 1 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }

      if (this.int13.length > 0) {
        new TWEEN.Tween(this.int13[0].object.scale)
        .to({ x: 1.2, y: 1.2, z: 1.2 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      } else {
        new TWEEN.Tween(this.scene.children[3].children[13].scale)
        .to({ x: 1, y: 1, z: 1 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }

      if (this.int14.length > 0) {
        new TWEEN.Tween(this.int14[0].object.scale)
        .to({ x: 1.2, y: 1.2, z: 1.2 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      } else {
        new TWEEN.Tween(this.scene.children[3].children[14].scale)
        .to({ x: 1, y: 1, z: 1 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }

      if (this.int15.length > 0) {
        new TWEEN.Tween(this.int15[0].object.scale)
        .to({ x: 1.2, y: 1.2, z: 1.2 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      } else {
        new TWEEN.Tween(this.scene.children[3].children[15].scale)
        .to({ x: 1, y: 1, z: 1 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }

      var pointSizes = this.particles.geometry.attributes.size;
      var pointAlphas = this.particles.geometry.attributes.alpha;

      if (this.direction === "up") {
        for (let i = 0; i < pointSizes.count; i++) {
          if (this.itemSize < 2) {
            pointSizes.array[i] += this.itemSize;
          }
        }
        for (let i = 0; i < pointAlphas.count / 2; i++) {
          pointAlphas.array[i] = 0.3;
        }
        if (this.itemSize < 2) {
          this.itemSize += 0.05;
        }
        if (this.itemAlpha > 0) {
          this.itemAlpha -= 0.00005;
        }
      }

      if (this.direction === "down") {
        for (let i = 0; i < pointSizes.count; i++) {
          if (this.itemSize > -0.2) {
            pointSizes.array[i] -= this.itemSize;
          }
        }
        for (let i = 0; i < pointAlphas.count / 2; i++) {
          if (this.itemAlpha < 0.5) {
            pointAlphas.array[i] += this.itemAlpha;
          }
        }
        if (this.itemSize > -0.2) {
          this.itemSize -= 0.05;
        }
        if (this.itemAlpha < 0.1) {
          this.itemAlpha += 0.00005;
        }
      }

      pointSizes.needsUpdate = true;
      pointAlphas.needsUpdate = true;

      this.mouseX = event.clientX - this.windowHalfX;
      this.mouseY = event.clientY - this.windowHalfY;
    }
  },
  mounted () {
    const promise = new Promise((resolve, reject) => {
      resolve (this.roadmapScene())
    });
    promise.then((value) => {
      this.animate()
    });
    this.$store.commit('stopRoadmap', false)
    document.getElementById('app').addEventListener('wheel', this.wheelScroll, false);
    document.addEventListener('mouseup', this.onPointerUp, false);
    document.addEventListener('mousedown', this.onPointerDown, false);
    window.addEventListener('resize', this.onWindowResize, false);
    window.addEventListener('pointermove', this.onPointerMove);
  },
  beforeDestroy () {
    this.$store.commit('stopRoadmap', true)
  },
  watch: {
    '$store.state.stopRoadmap': function () {
      if (this.$store.state.stopRoadmap == false) {
        this.animate();
      }
    }
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
