<template>
  <div>
    <div id="about-container"></div>
  </div>
</template>

<script>
  import * as THREE from 'three';
  import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
  import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
  import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
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
        renderScene: null,
        bloomPass: null,
				params: {
          exposure: 1,
          bloomStrength: 0,
          bloomThreshold: 0,
          bloomRadius: 0
        },
				composer: null,
        uniforms: null
      }
    },
    methods: {
      myScene: function () {
        var container = document.getElementById('about-container');
        this.scene = new THREE.Scene();

        var width = window.innerWidth;
        var height = window.innerHeight;

        this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 5000);
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
          resolution: { type: "v4", value: new THREE.Vector4() },
          color: { value: new THREE.Color( 0xffffff ) },
					alphaTest: { value: 0.9 }
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

        THREE.Mesh.prototype.raycast = acceleratedRaycast;
        THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
        THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        container.appendChild(this.renderer.domElement);

        this.renderScene = new RenderPass(this.scene, this.camera);

				this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
				this.bloomPass.threshold = this.params.bloomThreshold;
				this.bloomPass.strength = this.params.bloomStrength;
				this.bloomPass.radius = this.params.bloomRadius;

				this.composer = new EffectComposer(this.renderer);
				this.composer.addPass(this.renderScene);
				this.composer.addPass(this.bloomPass);

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
        this.composer.render();
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

        let int = this.raycaster.intersectObjects([this.scene.children[3]]);
        int = int.length > 0 ? int[0] : false;

        if (int) {
          new TWEEN.Tween(this.uniforms.distortion)
          .to({ value: 0.5 }, 500)
          .easing(TWEEN.Easing.Cubic.InOut)
          .start();

          new TWEEN.Tween(this.bloomPass)
          .to({ strength: 1 }, 500)
          .easing(TWEEN.Easing.Cubic.In)
          .start();
        } else {
          new TWEEN.Tween(this.uniforms.distortion)
          .to({ value: 0 }, 500)
          .easing(TWEEN.Easing.Cubic.InOut)
          .start();

          new TWEEN.Tween(this.bloomPass)
          .to({ strength: 0 }, 500)
          .easing(TWEEN.Easing.Cubic.In)
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
    },
  }
</script>
<style scoped>
</style>
