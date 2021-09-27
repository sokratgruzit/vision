<template>
    <div class="roadmap-inner__slider">
      <div id="slider-container"></div>
      <div class="roadmap-text__container">
        <div class="roadmap-text__main-ttl">
          {{roadmapData[activeYear].title}}
        </div>
        <div class="roadmap-text__block" v-for="roadtext in roadmapData[activeYear].inner" :class="activeStat == roadtext.id ? 'active' : ''">
          <div class="roadmap-text__block-inner">
            <h2 class="roadmap-text__ttl">{{roadtext.title}}</h2>
            <div class="roadmap-text__text">
              <div class="roadmap-text__li" v-for="list in roadtext.list">{{list}}</div>
            </div>
          </div>
        </div>
      </div>
      <router-link to="/roadmap" class="to_roadmap">Roadmap</router-link>
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
    arrow_vertex,
    part_vertex
  } from '../assets/shaders/vertex.js';
  import {
    slider_fragment,
    arrow_fragment,
    part_fragment
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
        leftTarget: false,
        rightTarget: false,
        slideCount: 0,
        colors: [
          new THREE.Color(0xFFB36D),
          new THREE.Color(0xFF81E3),
          new THREE.Color(0x5CFFC4),
          new THREE.Color(0xF3F657)
        ],
        activeStat: 1,
        activeYear: 0,
        roadmapData: [
          {
            id: 1,
            title: 2021,
            inner:[
              {
                id: 1,
                title:'q1',
                list: ["Website Launch","CORE Paper","Request for Proposals (R1)","Seed Founders On-Boarding","CMCX Token Offering"]
              },
              {
                id: 2,
                title:'q2',
                list: ["CORE Community Initiatives Program Launch (CCIP)","Technical Committee Formation","Research and Development Team Voting Event","Request for Proposals (R2)","Proof of Concept (PoC) Version 0.1","CMCX Token Exchange Offering (IEO)"]
              },
              {
                id: 3,
                title:'q3',
                list: ["CORE Hackathon 2021","CORE MVP","Code Fully Open Source","White-paper update"]
              },
              {
                id: 4,
                title:'q4',
                list: ["Private test-net launch","Native CORE Wallet","Origo Layer Testing","PivotChains Testing"]
              }
            ]
          },
          {
            id: 2,
            title: 2022,
            inner:[
              {
                id: 1,
                title:'q1',
                list: ["Public test-net launch","Catena Layer Testing","Consensus & Sharding Optimizations","CORE Universal Explorer","PolyChains Testing","Cross-Chain Communication Protocol","Aura Layer Testing","Staking launch"]
              },
              {
                id: 2,
                title:'q2',
                list: ["CORE Main-net Launch","Apeirogon Framework Release","Development Toolkit","CORE Hackathon 2022","CORE VM Beta Release","Smart Contracts"]
              },
              {
                id: 3,
                title:'q3',
                list: ["Trustless Bridge","Voting system","Storage Sharing Protocol","Fast State Sync and Re-sharding","Cryptography Engine","Consensus Engine"]
              },
              {
                id: 4,
                title:'q4',
                list: ["On-Chain Governance","IPFS Integration","Web3.js Integration","Randomizer Engine"]
              }
            ]
          },
          {
            id: 3,
            title: 2023,
            inner:[
              {
                id: 1,
                title:'q1',
                list: ["Universal blockchain Access API","Off-Chain Data Access (CORE Oracles)","CORE Global Bridge","State Engine"]
              },
              {
                id: 2,
                title:'q2',
                list: ["CORE Name Service","DeFI Tools for Developers","CORE Hackathon 2023","Tokenizer Engine"]
              },
              {
                id: 3,
                title:'q3',
                list: ["CORE OS Beta","Synthetic Gate","Cross-Chain Smart Contracts"]
              },
              {
                id: 4,
                title:'q4',
                list: ["Core Mesh testing","TPPL Public Access","State Sync Engine","Blockchain Distribution Network (BDN)"]
              }
            ]
          },
        ],
        particles: null
      }
    },
    methods: {
      sliderScene: function() {
        var container = document.getElementById('slider-container');

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 5000);

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

        this.createSliderButtons();
        this.createSliderImage();
        this.createBubleParticles();

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x878FFF, 0.2);
        container.appendChild(this.renderer.domElement);

        this.renderScene = new RenderPass(this.scene, this.camera);

				this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
				this.bloomPass.threshold = this.params.bloomThreshold;
				this.bloomPass.strength = this.params.bloomStrength;
				this.bloomPass.radius = this.params.bloomRadius;

				this.composer = new EffectComposer(this.renderer);
				this.composer.addPass(this.renderScene);
				this.composer.addPass(this.bloomPass);

        new TWEEN.Tween(this.particles.position)
        .to({ z: 0 }, 3000)
        .easing(TWEEN.Easing.Quintic.In)
        .start();

        setTimeout(() => {
          new TWEEN.Tween(this.camera.position)
          .to({ z: 400 }, 3000)
          .easing(TWEEN.Easing.Quintic.Out)
          .start();
        }, 2000);
      },
      createSliderImage: function() {
        if (window.innerWidth >=768) {
          this.sliderGeo = new THREE.PlaneBufferGeometry(
            this.windowHalfX * 0.5,
            this.windowHalfX * 0.5,
            this.windowHalfX * 0.5,
            this.windowHalfX * 0.5
          );
        } else {
          this.sliderGeo = new THREE.PlaneBufferGeometry(
            this.windowHalfX * 1,
            this.windowHalfX * 1,
            this.windowHalfX * 1,
            this.windowHalfX * 1
          );
        }

        const loader = new THREE.TextureLoader();

        let texture = loader.load(require("../assets/2021_Q1.png"));
        let texture1 = loader.load(require("../assets/2021_Q2.png"));
        let texture2 = loader.load(require("../assets/2021_Q3.png"));
        let texture3 = loader.load(require("../assets/2021_Q4.png"));
        let texture4 = loader.load(require("../assets/2022_Q1.png"));
        let texture5 = loader.load(require("../assets/2022_Q2.png"));
        let texture6 = loader.load(require("../assets/2022_Q3.png"));
        let texture7 = loader.load(require("../assets/2022_Q4.png"));
        let texture8 = loader.load(require("../assets/2021_Q1.png"));
        let texture9 = loader.load(require("../assets/2021_Q2.png"));
        let texture10 = loader.load(require("../assets/2021_Q3.png"));
        let texture11 = loader.load(require("../assets/2021_Q4.png"));

        this.uniforms = {
          tex: { type: "t", value: texture },
          tex1: { type: "t", value: texture1 },
          tex2: { type: "t", value: texture2 },
          tex3: { type: "t", value: texture3 },
          tex4: { type: "t", value: texture4 },
          tex5: { type: "t", value: texture5 },
          tex6: { type: "t", value: texture6 },
          tex7: { type: "t", value: texture7 },
          tex8: { type: "t", value: texture8 },
          tex9: { type: "t", value: texture9 },
          tex10: { type: "t", value: texture10 },
          tex11: { type: "t", value: texture11 },
          time: { type: "f", value: 0.0 },
          progress: { type: "f", value: 0.0 },
          distortion: { type: "f", value: 0.0 }
        };

        this.sliderMat = new THREE.ShaderMaterial({
          uniforms: this.uniforms,
          vertexShader: this.roadmapVertex,
          fragmentShader: this.roadmapFragment
        });

        this.sliderMesh = new THREE.Points(this.sliderGeo, this.sliderMat);
        //this.sliderMesh.position.y = -1000;
        //this.sliderMesh.position.z = -500;
        this.sliderMesh.position.set(-this.windowHalfX * 0.35, -this.windowHalfY * 0.1, 0);
        this.scene.add(this.sliderMesh);
      },
      createSliderButtons: function () {
        this.leftGeo = new THREE.SphereBufferGeometry(150, 50, 50);
        this.rightGeo = new THREE.SphereBufferGeometry(150, 50, 50);

        const loader = new THREE.TextureLoader();
        const leftTex = loader.load(require("../assets/wave_color.png"));
        const rightTex = loader.load(require("../assets/fire.jpg"));

        this.leftUniforms = {
          tex: { type: "t", value: leftTex },
          time: { type: "f", value: 0.0 },
          distortion: { type: "f", value: 0.0 },
        };

        this.rightUniforms = {
          tex: { type: "t", value: rightTex },
          time: { type: "f", value: 0.0 },
          distortion: { type: "f", value: 0.0 },
        };

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

        const subLeftGeo = new THREE.SphereBufferGeometry(100, 32, 32);
        const subLeftMat = new THREE.MeshLambertMaterial({
          color: 0x878FFF,
          transparent: true,
          opacity: 0.25
        });
        const subLeftMesh = new THREE.Mesh(subLeftGeo, subLeftMat);

        const subRightGeo = new THREE.SphereBufferGeometry(100, 32, 32);
        const subRightMat = new THREE.MeshLambertMaterial({
          color: 0xFFB36D,
          transparent: true,
          opacity: 0.25
        });
        const subRightMesh = new THREE.Mesh(subRightGeo, subRightMat);

        this.leftMesh = new THREE.Points(this.leftGeo, this.leftMat);
        this.rightMesh = new THREE.Points(this.rightGeo, this.rightMat);

        this.leftMesh.position.set(-window.innerWidth * 0.9, 0, -450);
        this.rightMesh.position.set(window.innerWidth * 0.9, 0, -450);
        //this.leftMesh.scale.set(0, 0, 0);
        //this.rightMesh.scale.set(0, 0, 0);

        this.scene.add(this.leftMesh);
        this.leftMesh.add(subLeftMesh);

        this.scene.add(this.rightMesh);
        this.rightMesh.add(subRightMesh);
      },
      createBubleParticles: function () {
        const partLoader = new THREE.TextureLoader();
        const partTexture = partLoader.load(require("../assets/circle2.png"));

        this.partUniforms = {
          pointTexture: { type: "t", value: partTexture },
          uCameraPos: { type: "3f", value: new THREE.Vector3(0, 0, 1000) },
        };

        this.partMat = new THREE.ShaderMaterial({
          uniforms:       this.partUniforms,
          vertexShader:   part_vertex,
          fragmentShader: part_fragment,
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
        this.particles.position.z = -7000;
        this.scene.add(this.particles);
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
        .to({ strength: 0.7 }, 2000)
        .easing(TWEEN.Easing.Cubic.In);

        var B = new TWEEN.Tween(this.bloomPass)
        .to({ strength: 0 }, 2000)
        .easing(TWEEN.Easing.Cubic.Out);

        A.chain(B);
        A.start();
      },
      animate: function () {
        this.time += 0.05;
        const theTime = performance.now() * 0.001;
        this.uniforms.time.value = this.time;
        this.leftUniforms.time.value = this.time;
        this.rightUniforms.time.value = this.time;
        this.sliderMesh.rotation.y = Math.sin(this.time) / 50;
        this.leftMesh.rotateX(Math.sin(this.time / 2) / 30);
        this.leftMesh.rotateY(Math.sin(this.time / 2) / 30);
        this.leftMesh.rotateZ(Math.sin(this.time / 2) / 30);

        this.rightMesh.rotateX(-Math.sin(this.time / 2) / 30);
        this.rightMesh.rotateY(-Math.sin(this.time / 2) / 30);
        this.rightMesh.rotateZ(-Math.sin(this.time / 2) / 30);

        let partZSin = Math.sin(theTime);
        this.particles.position.z = this.particles.position.z / 1.1 + partZSin / 2;
        this.particles.position.y = this.particles.position.y / 1.1 + partZSin / 2;
        this.particles.position.x = this.particles.position.x / 1.1 + partZSin / 2;

        if (this.$store.state.stopRoadmapInner == false){
          requestAnimationFrame(this.animate);
        }

        TWEEN.update();
        this.render();
      },
      render: function () {
        if (this.$store.state.stopRoadmapInner == false) {
          this.renderer.render(this.scene, this.camera);
          this.renderer.setPixelRatio(window.devicePixelRatio);
          this.raycaster.setFromCamera(this.mouse, this.camera);
          this.raycaster.firstHitOnly = true;
          this.composer.render();
        }
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
        if(this.$store.state.stopRoadmapInner == true){
          return false
        }
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
        } else {
          this.leftTarget = false;
          new TWEEN.Tween(this.leftUniforms.distortion)
          .to({ value: 0 }, 500)
          .easing(TWEEN.Easing.Cubic.InOut)
          .start();
        }

        if (int2.length > 0) {
          this.rightTarget = true;
          new TWEEN.Tween(this.rightUniforms.distortion)
          .to({ value: 0.5 }, 500)
          .easing(TWEEN.Easing.Cubic.InOut)
          .start();
        } else {
          this.rightTarget = false;
          new TWEEN.Tween(this.rightUniforms.distortion)
          .to({ value: 0 }, 500)
          .easing(TWEEN.Easing.Cubic.InOut)
          .start();
        }
      },
      updateUiData: function () {
        let int = this.raycaster.intersectObjects([this.scene.children[3].children[0]]);
        let int2 = this.raycaster.intersectObjects([this.scene.children[4].children[0]]);

        if (this.leftTarget) {
          this.slideCount--;
          if(this.activeStat === 1){
            this.activeStat = this.roadmapData[this.activeYear].inner.length + 1;
          }else{
            this.activeStat --;
          }
        }
        if (this.rightTarget) {
          this.slideCount++;
          if(this.activeStat === this.roadmapData[this.activeYear].inner.length){
            this.activeStat = 1
          }else{
            this.activeStat ++;
          }
        }
        if (this.slideCount < 0) {
          this.slideCount = 11;
        }
        if (this.slideCount > 11) {
          this.slideCount = 0;
        }
        if (int.length > 0 || int2.length > 0) {
          this.disposeImage(this.slideCount);
        }
      },
      wheelScroll: function(event) {
        new TWEEN.Tween(this.particles.position)
        .to({ z: -5000 }, 1500)
        .easing(TWEEN.Easing.Quintic.In)
        .start();

        new TWEEN.Tween(this.camera.position)
        .to({ z: 0 }, 1500)
        .easing(TWEEN.Easing.Quintic.Out)
        .start();

        setTimeout(() => {
          this.$router.push({ name: 'Roadmap'});
        }, 1500);
      },
      handleScroll (event) {

      },
      updateCarousel (payload) {
        // this.$store.commit('changeSlide', payload.currentSlide);
        // this.$store.commit('setChangeSlide', true);
      }
    },
    mounted () {
      this.$store.commit('setRoadmapInnerRoute', true);
      let test;
      if(this.$route.params.id >= 6 && this.$route.params.id < 11){
        this.activeYear = 1;
      }
      if(this.$route.params.id >= 11){
        this.activeYear = 2;
      }
      if(this.$route.params.id == 1 || this.$route.params.id == 2 || this.$route.params.id == 6 || this.$route.params.id == 7 || this.$route.params.id == 11 || this.$route.params.id == 12){
        this.activeStat = 1
      }
      if(this.$route.params.id == 3 || this.$route.params.id == 8 || this.$route.params.id == 13){
        this.activeStat = 2
      }
      if(this.$route.params.id == 4 || this.$route.params.id == 9 || this.$route.params.id == 14){
        this.activeStat = 3
      }
      if(this.$route.params.id == 5 || this.$route.params.id == 10 || this.$route.params.id == 15){
        this.activeStat = 4
      }
      this.sliderScene();
      this.animate();
      document.addEventListener('click', this.updateUiData);
      window.addEventListener('pointermove', this.onPointerMove);
      document.addEventListener('wheel', this.wheelScroll, false);
      this.$store.commit('stopRoadmapInner', false);
    },
    beforeDestroy () {
      document.removeEventListener('click', this.updateUiData);
      window.removeEventListener('pointermove', this.onPointerMove);
      document.removeEventListener('wheel', this.wheelScroll, false);
      this.raycaster = null;
      this.$store.commit('stopRoadmapInner', true)
      this.scene.remove(this.scene.children[0]);
      this.renderer = null;
    },
    watch: {
      '$store.state.stopRoadmapInner': function () {
        if (this.$store.state.stopRoadmapInner == false) {
          this.animate();
        }else{
          this.renderer = null;
        }
      }
    }
  }
</script>
<style>
  .to_roadmap{
    position: absolute;
    bottom: 30px;
    right: 80px;
    z-index: 11;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
  }
  .to_roadmap:after{
    content: '';
    height: 1px;
    width: 100%;
    bottom: 0px;
    background: #fff;
    left: 0px;
    position: absolute;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
  }
  .to_roadmap:hover{
    color: rgba(255, 113, 82, 1);
  }
  .to_roadmap:hover::after{
    transform: scaleX(0);
  }
  .home-slider .hooper{
    z-index: 2;
  }
  .home-slider{
    height: 100vh;
    width: 100%;
  }
  .roadmap-text__main-ttl{
    text-align: left;
    font-size: 70px;
    line-height: 70px;
    color: #FF7152;
    margin-top: 10px;
    display: none;
  }
  .roadmap-text__block{
    position: absolute;
    height: calc(100% - 70px);
    width: 100%;
    bottom: 0px;
    right: 0px;
    pointer-events: none;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    opacity: 0;
    transform: translateY(10px);
    display: none;
  }
  .roadmap-text__block.active{
    pointer-events: all;
    opacity: 1;
    transform: translateY(0px);
    transition-delay: .6s;
  }
  .roadmap-text__text{
    text-align: left;
    color: rgba(171, 176, 188, 1);
    padding-bottom: 100px;
  }
  .roadmap-text__ttl{
    text-align: left;
    font-size: 35px;
    line-height: 45px;
    color: #fff;
    margin-bottom: 10px;
    margin-top: 15px;
    text-transform: uppercase;
  }
  .roadmap-text__block-inner{
    display: flex;
    flex-direction: column;
    padding-right: 30px;
  }
  .roadmap-text__container{
    position: absolute;
    width: 40%;
    right: 80px;
    height: calc(100% - 138px);
    z-index: 10;
    bottom: 0px;
  }
  .roadmap-text__li{
    padding-left: 25px;
    color: hsla(0,0%,100%,.5);
    font-size: 15px;
    line-height: 24px;
    position: relative;
  }
  .roadmap-text__li:after{
    content: "";
    position: absolute;
    top: 12px;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background: #0500ff;
    left: 0px;
  }
  .roadmap-inner__slider{
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 2;
  }
  /*Ipad Pro*/
  @media (max-width: 1300px){
    .roadmap-text__ttl{
      font-size: 35px;
      line-height: 40px;
    }
    .roadmap-text__text{
      font-size: 14px;
      line-height: 18px;
    }
  }
  /*Ipad 768*/
  @media (max-width: 1023px){
    .roadmap-main{
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .roadmap-text__container{
      right: 45px;
      width: calc(100% - 90px);
      height: 50%;
    }
    .slider-container{
      position: fixed;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      z-index: 2;
    }
    .to_roadmap{
      right: 40px;
    }
  }
  /*Mobile*/
  @media (max-width: 767px){
    .roadmap-text__container{
      right: 15px;
      width: calc(100% - 30px);
    }
    .roadmap-text__text{
      padding-bottom: 50px;
    }
    .roadmap-text__block-inner{
      padding-right: 15px;
    }
    .roadmap-text__ttl{
      margin-bottom: 15px;
    }
    .roadmap-inner__slider{
      overflow-y: auto ;
      -webkit-overflow-scrolling: touch;
      display: flex;
      flex-direction: column;
    }
    .to_roadmap{
      position: relative;
      right: 0px;
      margin-top: 50px;
      margin-left: 15px;
      margin-right: auto;
    }
  }
</style>
