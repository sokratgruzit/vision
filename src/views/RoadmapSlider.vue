<template>
  <div class="home-slider">
    <div id="slider-container"></div>
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
    slider_vertex,
    arrow_vertex
  } from '../assets/shaders/vertex.js';
  import {
    slider_fragment,
    arrow_fragment
  } from '../assets/shaders/fragment.js';
  export default {
    name: 'RoadmapSlide',
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
        arrowVertex: arrow_vertex,
        arrowFragment: arrow_fragment,
        time: 0,
        renderScene: null,
        bloomPass: null,
        leftBloom: null,
				params: {
          exposure: 1,
          bloomStrength: 0,
          bloomThreshold: 0,
          bloomRadius: 0
        },
				composer: null,
        rightMat: null,
        rightGeo: null,
        rightMesh: null,
        rightUniforms: null,
        leftMat: null,
        leftGeo: null,
        leftMesh: null,
        leftUniforms: null,
        curveMesh: null,
        curveMesh2: null,
        cureveMesh3: null,
        leftTarget: false,
        rightTarget: false,
        slideCount: 0,
        colors: [
          new THREE.Color(0xFFB36D),
          new THREE.Color(0xFF81E3),
          new THREE.Color(0x5CFFC4),
          new THREE.Color(0xF3F657)
        ],
        lineGeometry0: null,
        lineGeometry1: null,
        lineGeometry2: null,
        lineGeometry3: null,
        glowM0: null,
        glowM1: null,
        glowM2: null,
        glowM3: null
      }
    },
    methods: {
      sliderScene: function() {
        var container = document.getElementById('slider-container');
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 5000);
        this.camera.position.z = 1000;

        this.scene = new THREE.Scene();
        this.camera.lookAt(this.scene.position);
        this.leftGeo = new THREE.SphereBufferGeometry(100, 50, 50);
        this.rightGeo = new THREE.SphereBufferGeometry(100, 50, 50);
        this.sliderGeo = new THREE.PlaneBufferGeometry(480*1.5, 240*1.5, 480, 240);

        THREE.Mesh.prototype.raycast = acceleratedRaycast;
        THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
        THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;

        const loader = new THREE.TextureLoader();

        let texture = loader.load(require("../assets/btc.jpg"));
        let texture1 = loader.load(require("../assets/eth.jpg"));
        let texture2 = loader.load(require("../assets/lite.jpg"));
        let texture3 = loader.load(require("../assets/tron.jpg"));

        const leftTex = loader.load(require("../assets/wave_color.png"));
        const rightTex = loader.load(require("../assets/fire.jpg"));

        this.uniforms = {
          tex: { type: "t", value: texture },
          tex1: { type: "t", value: texture1 },
          tex2: { type: "t", value: texture2 },
          tex3: { type: "t", value: texture3 },
          time: { type: "f", value: 0.0 },
          progress: { type: "f", value: 0.0 },
          distortion: { type: "f", value: 0.0 },
          resolution: { type: "v4", value: new THREE.Vector4() }
        };

        this.leftUniforms = {
          tex: { type: "t", value: leftTex },
          time: { type: "f", value: 0.0 },
          distortion: { type: "f", value: 0.0 },
          resolution: { type: "v4", value: new THREE.Vector4() }
        };

        this.rightUniforms = {
          tex: { type: "t", value: rightTex },
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

        this.leftUniforms.resolution.value.x = window.innerWidth;
        this.leftUniforms.resolution.value.y = window.innerHeight;
        this.leftUniforms.resolution.value.z = asp1;
        this.leftUniforms.resolution.value.w = asp2;

        this.rightUniforms.resolution.value.x = window.innerWidth;
        this.rightUniforms.resolution.value.y = window.innerHeight;
        this.rightUniforms.resolution.value.z = asp1;
        this.rightUniforms.resolution.value.w = asp2;

        this.sliderMat = new THREE.ShaderMaterial({
          uniforms: this.uniforms,
          vertexShader: this.roadmapVertex,
          fragmentShader: this.roadmapFragment
        });

        this.leftMat = new THREE.ShaderMaterial({
          uniforms: this.leftUniforms,
          vertexShader: this.arrowVertex,
          fragmentShader: this.arrowFragment
        });

        this.rightMat = new THREE.ShaderMaterial({
          uniforms: this.rightUniforms,
          vertexShader: this.arrowVertex,
          fragmentShader: this.arrowFragment
        });

        const subLeftGeo = new THREE.SphereBufferGeometry(70, 32, 32);
        const subLeftMat = new THREE.MeshBasicMaterial({
          color: 0x878FFF,
          transparent: true,
          opacity: 0.25
        });
        const subLeftMesh = new THREE.Mesh(subLeftGeo, subLeftMat);

        const subRightGeo = new THREE.SphereBufferGeometry(70, 32, 32);
        const subRightMat = new THREE.MeshBasicMaterial({
          color: 0xFFB36D,
          transparent: true,
          opacity: 0.25
        });
        const subRightMesh = new THREE.Mesh(subRightGeo, subRightMat);

        var sLight = new THREE.SpotLight(0xffffff);
        this.scene.add(sLight);

        var aLight = new THREE.AmbientLight(0xffffff);
        this.scene.add(aLight);

        var directionalLight = new THREE.DirectionalLight("#fff", 2);
        directionalLight.position.set(0, 50, -20);
        this.scene.add(directionalLight);

        this.sliderMesh = new THREE.Points(this.sliderGeo, this.sliderMat);
        this.leftMesh = new THREE.Points(this.leftGeo, this.leftMat);
        this.leftMesh.position.set(-850, 0, 0);
        this.scene.add(this.leftMesh);
        this.leftMesh.add(subLeftMesh);

        this.rightMesh = new THREE.Points(this.rightGeo, this.rightMat);
        this.rightMesh.position.set(850, 0, 0);
        this.scene.add(this.rightMesh);
        this.rightMesh.add(subRightMesh);

        this.scene.add(this.sliderMesh);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);

        this.renderScene = new RenderPass(this.scene, this.camera);

				this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
				this.bloomPass.threshold = this.params.bloomThreshold;
				this.bloomPass.strength = this.params.bloomStrength;
				this.bloomPass.radius = this.params.bloomRadius;

        this.leftBloom = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
				this.leftBloom.threshold = this.params.bloomThreshold;
				this.leftBloom.strength = this.params.bloomStrength;
				this.leftBloom.radius = this.params.bloomRadius;

				this.composer = new EffectComposer(this.renderer);
				this.composer.addPass(this.renderScene);
				this.composer.addPass(this.bloomPass);
        this.composer.addPass(this.leftBloom);

        //Lighted curves
        const lineMaterial = new THREE.LineBasicMaterial({
          transparent: true,
          opacity: 0.5,
          color: this.colors[0]
        });

        const spline0 = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-1500, 500, 0),
          new THREE.Vector3(-500, 200, 0),
          new THREE.Vector3(0, 800, 0),
          new THREE.Vector3(500, 500, 0),
          new THREE.Vector3(1500, 800, 0)
        ]);

        const spline1 = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-1500, 0, 0),
          new THREE.Vector3(-500, -100, 0),
          new THREE.Vector3(0, -400, 0),
          new THREE.Vector3(500, 250, 0),
          new THREE.Vector3(1500, -300, 0)
        ]);

        const spline2 = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-1500, 0, 0),
          new THREE.Vector3(-500, 100, 0),
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(500, -100, 0),
          new THREE.Vector3(1500, 0, 0)
        ]);

        var splinePoints0 = spline0.getPoints(4000);
        var splinePoints1 = spline1.getPoints(4000);
        var splinePoints2 = spline2.getPoints(4000);

        const glowG0 = new THREE.TubeGeometry(spline0, 4000, 5, 8, false);
        const glowG1 = new THREE.TubeGeometry(spline1, 4000, 5, 8, false);
        const glowG2 = new THREE.TubeGeometry(spline2, 4000, 5, 8, false);

        this.glowM = new THREE.MeshBasicMaterial({
          color: this.colors[0],
          opacity: 0.25,
          transparent: true,
          depthTest: false
        });

        const glowMesh0 = new THREE.Mesh(glowG0, this.glowM);
        const glowMesh1 = new THREE.Mesh(glowG1, this.glowM);
        const glowMesh2 = new THREE.Mesh(glowG2, this.glowM);

        this.lineGeometry0 = new THREE.BufferGeometry().setFromPoints(splinePoints0);
        const lineMesh0 = new THREE.Line(this.lineGeometry0, lineMaterial);
        lineMesh0.add(glowMesh0);
        lineMesh0.position.y = -900;
        this.scene.add(lineMesh0);

        this.lineGeometry1 = new THREE.BufferGeometry().setFromPoints(splinePoints1);
        const lineMesh1 = new THREE.Line(this.lineGeometry1, lineMaterial);
        lineMesh1.add(glowMesh1);
        lineMesh1.position.y = -400;
        this.scene.add(lineMesh1);

        this.lineGeometry2 = new THREE.BufferGeometry().setFromPoints(splinePoints2);
        const lineMesh2 = new THREE.Line(this.lineGeometry2, lineMaterial);
        lineMesh2.add(glowMesh2);
        lineMesh2.position.y = -400;
        this.scene.add(lineMesh2);
        //End Lighted curves
      },
      disposeImage: function (direction) {
        var cA = new TWEEN.Tween(this.uniforms.distortion)
        .to({ value: 3 }, 2000)
        .easing(TWEEN.Easing.Cubic.InOut);

        var cB = new TWEEN.Tween(this.uniforms.distortion)
        .to({ value: 0 }, 2000)
        .easing(TWEEN.Easing.Cubic.InOut);

        cA.chain(cB);
        cA.start();

        setTimeout(() => {
          this.uniforms.progress.value = direction;
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
        this.leftUniforms.time.value = this.time;
        this.rightUniforms.time.value = this.time;
        this.sliderMesh.rotation.y = Math.sin(this.time) / 8;
        this.leftMesh.rotateX(Math.sin(this.time / 2) / 30);
        this.leftMesh.rotateY(Math.sin(this.time / 2) / 30);
        this.leftMesh.rotateZ(Math.sin(this.time / 2) / 30);

        this.rightMesh.rotateX(-Math.sin(this.time / 2) / 30);
        this.rightMesh.rotateY(-Math.sin(this.time / 2) / 30);
        this.rightMesh.rotateZ(-Math.sin(this.time / 2) / 30);
        this.scene.children[6].children[0].scale.setZ(Math.sin(this.time * 20));

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

        let int = this.raycaster.intersectObjects([this.scene.children[3].children[0]]);
        let int2 = this.raycaster.intersectObjects([this.scene.children[4].children[0]]);
        
        if (int.length > 0) {
          this.leftTarget = true;
          new TWEEN.Tween(this.leftUniforms.distortion)
          .to({ value: 0.5 }, 500)
          .easing(TWEEN.Easing.Cubic.InOut)
          .start();

          new TWEEN.Tween(this.leftBloom)
          .to({ strength: 1 }, 500)
          .easing(TWEEN.Easing.Cubic.In)
          .start();
        } else {
          this.leftTarget = false;
          new TWEEN.Tween(this.leftUniforms.distortion)
          .to({ value: 0 }, 500)
          .easing(TWEEN.Easing.Cubic.InOut)
          .start();

          new TWEEN.Tween(this.leftBloom)
          .to({ strength: 0 }, 500)
          .easing(TWEEN.Easing.Cubic.In)
          .start();
        }

        if (int2.length > 0) {
          this.rightTarget = true;
          new TWEEN.Tween(this.rightUniforms.distortion)
          .to({ value: 0.5 }, 500)
          .easing(TWEEN.Easing.Cubic.InOut)
          .start();

          new TWEEN.Tween(this.bloomPass)
          .to({ strength: 1 }, 500)
          .easing(TWEEN.Easing.Cubic.In)
          .start();
        } else {
          this.rightTarget = false;
          new TWEEN.Tween(this.rightUniforms.distortion)
          .to({ value: 0 }, 500)
          .easing(TWEEN.Easing.Cubic.InOut)
          .start();

          new TWEEN.Tween(this.bloomPass)
          .to({ strength: 0 }, 500)
          .easing(TWEEN.Easing.Cubic.In)
          .start();
        }
      },
      updateUiData: function () {
        if (this.leftTarget) {
          this.slideCount--;
        }
        if (this.rightTarget) {
          this.slideCount++;
        }
        if (this.slideCount < 0) {
          this.slideCount = 3;
        }
        if (this.slideCount > 3) {
          this.slideCount = 0;
        }
        this.disposeImage(this.slideCount);
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
      document.addEventListener('click', this.updateUiData);
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
