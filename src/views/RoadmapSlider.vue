<template>
    <div class="roadmap-inner__slider">
      <div id="slider-container"></div>
      <div id="prev-slider-btn">
        <span>{{roadmapData[prevBtnYear].title}}</span>
        <div>
          <span>{{roadmapData[prevBtnYear].inner[prevBtnInner].title}}</span>
        </div>
      </div>
      <div id="next-slider-btn">
        <span>{{roadmapData[nextBtnYear].title}}</span>
        <div>
          <span>{{roadmapData[nextBtnYear].inner[nextBtnInner].title}}</span>
        </div>
      </div>
      <div class="roadmap-text__container" :class="activeSlider ? 'active' : ''">
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
      <div data-v-1afa4326="" class="roadmap__socials">
        <a data-v-1afa4326="" href="https://twitter.com/COREMultichain" target="_blank"><svg data-v-1afa4326="" width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path data-v-1afa4326="" d="M20 2.79875C19.2563 3.125 18.4637 3.34125 17.6375 3.44625C18.4875 2.93875 19.1363 2.14125 19.4412 1.18C18.6488 1.6525 17.7738 1.98625 16.8412 2.1725C16.0887 1.37125 15.0162 0.875 13.8462 0.875C11.5763 0.875 9.74875 2.7175 9.74875 4.97625C9.74875 5.30125 9.77625 5.61375 9.84375 5.91125C6.435 5.745 3.41875 4.11125 1.3925 1.6225C1.03875 2.23625 0.83125 2.93875 0.83125 3.695C0.83125 5.115 1.5625 6.37375 2.6525 7.1025C1.99375 7.09 1.3475 6.89875 0.8 6.5975C0.8 6.61 0.8 6.62625 0.8 6.6425C0.8 8.635 2.22125 10.29 4.085 10.6712C3.75125 10.7625 3.3875 10.8062 3.01 10.8062C2.7475 10.8062 2.4825 10.7913 2.23375 10.7362C2.765 12.36 4.2725 13.5538 6.065 13.5925C4.67 14.6838 2.89875 15.3412 0.98125 15.3412C0.645 15.3412 0.3225 15.3263 0 15.285C1.81625 16.4563 3.96875 17.125 6.29 17.125C13.835 17.125 17.96 10.875 17.96 5.4575C17.96 5.27625 17.9538 5.10125 17.945 4.9275C18.7588 4.35 19.4425 3.62875 20 2.79875Z" fill="white"></path></svg></a>
        <a data-v-1afa4326="" href="https://t.me/coreblockchain" target="_blank"><svg data-v-1afa4326="" width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path data-v-1afa4326="" d="M6.278 9.12066L6.01333 12.8433C6.392 12.8433 6.556 12.6807 6.75266 12.4853L8.528 10.7887L12.2067 13.4827C12.8813 13.8587 13.3567 13.6607 13.5387 12.862L15.9533 1.54732L15.954 1.54666C16.168 0.549324 15.5933 0.159324 14.936 0.403991L0.742663 5.83799C-0.226003 6.21399 -0.211337 6.75399 0.577996 6.99866L4.20666 8.12732L12.6353 2.85332C13.032 2.59066 13.3927 2.73599 13.096 2.99866L6.278 9.12066Z" fill="white"></path></svg></a>
        <a data-v-1afa4326="" href="https://www.linkedin.com/company/coremultichain/" target="_blank"><svg data-v-1afa4326="" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g data-v-1afa4326=""><path data-v-1afa4326="" d="M19.9951 19.9999V19.999H20.0001V12.664C20.0001 9.07569 19.2276 6.31152 15.0326 6.31152C13.0159 6.31152 11.6626 7.41819 11.1101 8.46736H11.0517V6.64652H7.07422V19.999H11.2159V13.3874C11.2159 11.6465 11.5459 9.9632 13.7017 9.9632C15.8259 9.9632 15.8576 11.9499 15.8576 13.499V19.9999H19.9951Z" fill="white"></path><path data-v-1afa4326="" d="M0.330139 6.64746H4.47681V20H0.330139V6.64746Z" fill="white"></path><path data-v-1afa4326="" d="M2.40167 0C1.07583 0 0 1.07583 0 2.40167C0 3.7275 1.07583 4.82583 2.40167 4.82583C3.7275 4.82583 4.80333 3.7275 4.80333 2.40167C4.8025 1.07583 3.72667 0 2.40167 0V0Z" fill="white"></path></g><defs data-v-1afa4326=""><clipPath data-v-1afa4326="" id="clip0"><rect data-v-1afa4326="" width="20" height="20" fill="white"></rect></clipPath></defs></svg></a>
        <a data-v-1afa4326="" href="https://github.com/CORE-Blockchain" target="_blank"><svg data-v-1afa4326="" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path data-v-1afa4326="" d="M9.99875 0C4.4775 0 0 4.59056 0 10.2534C0 14.7827 2.865 18.6252 6.84 19.9822C7.34 20.0767 7.5225 19.7601 7.5225 19.4882C7.5225 19.2444 7.51375 18.5997 7.50875 17.7444C4.7275 18.3635 4.14 16.3695 4.14 16.3695C3.68625 15.1849 3.03 14.8695 3.03 14.8695C2.12125 14.2338 3.0975 14.2466 3.0975 14.2466C4.10125 14.3193 4.62875 15.3036 4.62875 15.3036C5.52125 16.8699 6.97 16.418 7.54 16.155C7.63 15.4925 7.88875 15.0406 8.175 14.784C5.955 14.5249 3.62 13.6453 3.62 9.71728C3.62 8.59773 4.01 7.68242 4.65 6.96499C4.54625 6.70584 4.20375 5.66288 4.7475 4.25227C4.7475 4.25227 5.5875 3.97653 7.4975 5.30289C8.295 5.07566 9.15 4.96204 10.0013 4.95821C10.85 4.96332 11.7062 5.07566 12.505 5.30417C14.4137 3.97781 15.2525 4.25355 15.2525 4.25355C15.7975 5.66544 15.455 6.70712 15.3525 6.96627C15.9937 7.6837 16.38 8.599 16.38 9.71856C16.38 13.6568 14.0425 14.5236 11.815 14.7776C12.1737 15.0942 12.4937 15.7197 12.4937 16.6759C12.4937 18.0469 12.4812 19.1524 12.4812 19.4882C12.4812 19.7626 12.6613 20.0818 13.1687 19.9809C17.1375 18.6227 20 14.7815 20 10.2534C20 4.59056 15.5225 0 9.99875 0Z" fill="white"></path></svg></a>
      </div>
      <router-link to="/about" class="roadmap__about">About</router-link>
      <div class="roadmap-hepler__container" :class="help !== null ? 'active' : ''">
        <div class="roadmap-hepler__outer">
          <div class="roadmap-hepler" :key="0" :class="help == 1 ? 'active' : ''">
            <div class="roadmap-hepler__drag">
              <div class="roadmap-hepler__drag-line"></div>
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 512.568 512.568" style="enable-background:new 0 0 512 512" xml:space="preserve" class="roadmap-hepler__scrollup-icon"><g>
                <path xmlns="http://www.w3.org/2000/svg" d="M254.284,325.284c-38.598,0-70-31.402-70-70s31.402-70,70-70s70,31.402,70,70S292.882,325.284,254.284,325.284z   M254.284,225.284c-16.542,0-30,13.458-30,30s13.458,30,30,30s30-13.458,30-30S270.826,225.284,254.284,225.284z M360.427,407.426  l-28.285-28.284L255.284,456l-73.857-73.858l-28.285,28.284l102.143,102.142L360.427,407.426z M360.427,105.142L255.284,0  L152.142,103.142l28.285,28.284l74.857-74.858l76.857,76.858L360.427,105.142z" fill="#ffffff" data-original="#000000" style="" class=""/>
                </g>
              </svg>
            </div>
            <div class="roadmap-hepler__drag-ttl">
              SCROLL TO<br>GO BACK
            </div>
          </div>
          <div class="roadmap-hepler" :key="1" :class="help == 2 ? 'active' : ''">
            <div class="roadmap-hepler__drag">
              <div class="roadmap-hepler__drag-line"></div>
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 128 128" style="enable-background:new 0 0 512 512" xml:space="preserve" class="roadmap-hepler__click-icon"><g><g xmlns="http://www.w3.org/2000/svg"><path d="M64,0a64,64,0,1,0,64,64A64.073,64.073,0,0,0,64,0Zm60.5,64C124.5,71,99.653,78.8,64,78.8c-5.018,0-9.812-.159-14.362-.444-.285-4.551-.445-9.345-.445-14.363C49.193,28.344,57,3.5,64,3.5A60.569,60.569,0,0,1,124.5,64ZM57.4,3.864c-5.818,7.29-9.561,24.028-11.015,42.5-3.681.286-7.279.659-10.7,1.12a1.75,1.75,0,0,0,.231,3.484,1.878,1.878,0,0,0,.235-.015c3.2-.431,6.555-.783,9.99-1.059-.291,4.666-.441,9.407-.441,14.1s.15,9.446.441,14.115C20.322,76.057,3.5,69.758,3.5,64A60.582,60.582,0,0,1,57.4,3.864ZM3.867,70.6c7.292,5.82,24.037,9.563,42.513,11.016,1.453,18.477,5.2,35.221,11.016,42.513A60.6,60.6,0,0,1,3.867,70.6ZM64,124.5c-5.761,0-12.059-16.822-14.114-42.634,4.669.292,9.413.441,14.114.441s9.438-.149,14.1-.44c-.289,3.585-.66,7.082-1.116,10.4a1.749,1.749,0,0,0,1.5,1.972,1.784,1.784,0,0,0,.241.016,1.748,1.748,0,0,0,1.731-1.511c.488-3.548.881-7.289,1.18-11.126,18.47-1.454,35.208-5.2,42.5-11.015A60.582,60.582,0,0,1,64,124.5Z" fill="#ffffff" data-original="#000000" style=""/><path d="M12.586,56.411a1.756,1.756,0,0,0,.635-.12A78.43,78.43,0,0,1,24.474,53a1.75,1.75,0,0,0-.76-3.417,82.072,82.072,0,0,0-11.763,3.448,1.751,1.751,0,0,0,.635,3.382Z" fill="#ffffff" data-original="#000000" style=""/><path d="M107.043,53.843a70.6,70.6,0,0,1,7.737,2.448,1.75,1.75,0,0,0,1.268-3.262,73.814,73.814,0,0,0-8.126-2.574,1.75,1.75,0,0,0-.879,3.388Z" fill="#ffffff" data-original="#000000" style=""/><path d="M58.089,47.507a1.75,1.75,0,0,0,1.749,1.72h.031c3.925-.068,7.977-.038,11.911.093h.06a1.75,1.75,0,0,0,.057-3.5c-3.992-.133-8.1-.163-12.088-.094A1.75,1.75,0,0,0,58.089,47.507Z" fill="#ffffff" data-original="#000000" style=""/><path d="M83.661,50.04c4.1.366,8.07.85,11.794,1.438a1.727,1.727,0,0,0,.275.022A1.75,1.75,0,0,0,96,48.021c-3.8-.6-7.85-1.094-12.03-1.467a1.75,1.75,0,1,0-.311,3.486Z" fill="#ffffff" data-original="#000000" style=""/><path d="M78.691,56.637c.077,2.412.116,4.888.116,7.36q0,2.3-.044,4.549a1.75,1.75,0,0,0,1.715,1.784h.036a1.751,1.751,0,0,0,1.749-1.716q.043-2.288.044-4.617c0-2.508-.039-5.022-.118-7.472a1.75,1.75,0,0,0-3.5.112Z" fill="#ffffff" data-original="#000000" style=""/><path d="M77,102.608a1.751,1.751,0,0,0-2.093,1.321,77.439,77.439,0,0,1-3.2,10.848,1.75,1.75,0,1,0,3.262,1.268A80.9,80.9,0,0,0,78.322,104.7,1.75,1.75,0,0,0,77,102.608Z" fill="#ffffff" data-original="#000000" style=""/><path d="M76.144,30.275c.486,2.791.914,5.756,1.272,8.811a1.749,1.749,0,0,0,1.736,1.546,1.792,1.792,0,0,0,.206-.012,1.751,1.751,0,0,0,1.535-1.942c-.367-3.119-.8-6.148-1.3-9a1.75,1.75,0,1,0-3.448.6Z" fill="#ffffff" data-original="#000000" style=""/><path d="M74.318,21.6a1.751,1.751,0,0,0,3.395-.855,75.356,75.356,0,0,0-2.745-8.794,1.75,1.75,0,0,0-3.262,1.269A71.646,71.646,0,0,1,74.318,21.6Z" fill="#ffffff" data-original="#000000" style=""/></g></g></svg>
            </div>
            <div class="roadmap-hepler__drag-ttl">
              CLICK ON SPHERES <br>TO SLIDE
            </div>
          </div>
        </div>
      </div>
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
  import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
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
        activeSlider:false,
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
                title:'q3',
                list: ["Website Launch","CORE Paper","Request for Proposals (R1)","Seed Founders On-Boarding","CMCX Token Offering"]
              },
              {
                id: 2,
                title:'q4',
                list: ["CORE Community Initiatives Program Launch (CCIP)","Technical Committee Formation","Research and Development Team Voting Event","Request for Proposals (R2)","Proof of Concept (PoC) Version 0.1","CMCX Token Exchange Offering (IEO)"]
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
                list: ["CORE Hackathon 2021","CORE MVP","CORE Gravity","White-paper update"]
              },
              {
                id: 2,
                title:'q2',
                list: ["Private test-net launch","Native CORE Wallet","Origo Layer Testing","PivotChains Testing"]
              },
              {
                id: 3,
                title:'q3',
                list: ["Public test-net launch","Catena Layer Testing","Consensus & Sharding Optimizations","CORE Universal Explorer","PolyChains Testing","Cross-Chain Communication Protocol","Aura Layer Testing","Staking launch"]
              },
              {
                id: 4,
                title:'q4',
                list: ["CORE Main-net Launch","Apeirogon Framework Release","Development Toolkit","CORE Hackathon 2022","CORE VM Beta Release","Smart Contracts"]
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
                list: ["Trustless Bridge","Voting system","Storage Sharing Protocol","Fast State Sync and Re-sharding","Cryptography Engine","Consensus Engine"]
              },
              {
                id: 2,
                title:'q2',
                list: ["On-Chain Governance","IPFS Integration","Web3.js Integration","Randomizer Engine"]
              },
              {
                id: 3,
                title:'q3',
                list: ["Universal blockchain Access API","Off-Chain Data Access (CORE Oracles)","CORE Global Bridge","State Engine"]
              },
              {
                id: 4,
                title:'q4',
                list: ["CORE Name Service","DeFI Tools for Developers","CORE Hackathon 2023","Tokenizer Engine"]
              },
            ]
          },
          {
            id: 4,
            title: 2024,
            inner:[
              {
                id: 1,
                title:'q1',
                list: ["CORE OS Beta","Synthetic Gate","Cross-Chain Smart Contracts"]
              },
              {
                id: 2,
                title:'q2',
                list: ["Core Mesh testing","TPPL Public Access","State Sync Engine","Blockchain Distribution Network (BDN)"]
              }
            ]
          },
        ],
        particles: null,
        help: null,
        prevBtnYear: 0,
        prevBtnInner: 0,
        nextBtnYear: 0,
        nextBtnInner: 0
      }
    },
    methods: {
      helper: function() {
        setTimeout(() => {
          this.help = 1;
        },3000);
        setTimeout(() => {
          this.help = 2;
        },6000);
        setTimeout(() => {
          this.help = null;
        },9000);
      },
      sliderScene: function() {
        var container = document.getElementById('slider-container');
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / 600, 0.01, 5000);
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

        let texture = loader.load(require("../assets/2021_Q3.png"));
        let texture1 = loader.load(require("../assets/2021_Q4.png"));
        let texture2 = loader.load(require("../assets/2022_Q1.png"));
        let texture3 = loader.load(require("../assets/2022_Q2.png"));
        let texture4 = loader.load(require("../assets/2022_Q3.png"));
        let texture5 = loader.load(require("../assets/2022_Q4.png"));
        let texture6 = loader.load(require("../assets/2023_Q1.png"));
        let texture7 = loader.load(require("../assets/2023_Q2.png"));
        let texture8 = loader.load(require("../assets/2023_Q3.png"));
        let texture9 = loader.load(require("../assets/2023_Q4.png"));
        let texture10 = loader.load(require("../assets/2024_Q1.png"));
        let texture11 = loader.load(require("../assets/2024_Q2.png"));

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
        this.sliderMesh.position.set(-this.windowHalfX * 0.35, -this.windowHalfY * 0.1, 0);
        this.scene.add(this.sliderMesh);
      },
      createSliderButtons: function () {
        this.leftGeo = new THREE.SphereBufferGeometry(100, 30, 30);
        this.rightGeo = new THREE.SphereBufferGeometry(100, 30, 30);

        const loader = new THREE.TextureLoader();
        const leftTex = loader.load(require("../assets/wave_color.png"));
        const rightTex = loader.load(require("../assets/right_button.png"));

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

        const subLeftGeo = new THREE.SphereBufferGeometry(60, 32, 32);
        const subLeftMat = new THREE.MeshLambertMaterial({
          color: 0x878FFF,
          transparent: true,
          opacity: 0.25
        });
        const subLeftMesh = new THREE.Mesh(subLeftGeo, subLeftMat);

        const subRightGeo = new THREE.SphereBufferGeometry(60, 32, 32);
        const subRightMat = new THREE.MeshLambertMaterial({
          color: 0xFFB36D,
          transparent: true,
          opacity: 0.25
        });
        const subRightMesh = new THREE.Mesh(subRightGeo, subRightMat);

        this.leftMesh = new THREE.Points(this.leftGeo, this.leftMat);
        this.rightMesh = new THREE.Points(this.rightGeo, this.rightMat);

        this.leftMesh.position.set(window.innerWidth / window.innerHeight - (window.innerWidth) * 0.9, 0, -450);
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

        this.camera.aspect = window.innerWidth / 600;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
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
          if (this.activeStat === 1 && this.activeYear === 0) {
            this.activeYear = 3;
            this.activeStat = this.roadmapData[this.activeYear].inner.length + 1;
          }
          if (this.activeStat === 1 && this.activeYear !== 0) {
            this.activeYear--;
            this.activeStat = this.roadmapData[this.activeYear].inner.length;
          } else {
            this.activeStat--;
          }
        }
        if (this.rightTarget) {
          this.slideCount++;
          if(this.activeStat === this.roadmapData[this.activeYear].inner.length && this.activeYear == 3){
            this.activeStat = 1
            this.activeYear = 0;
            return false;
          }
          if(this.activeStat === this.roadmapData[this.activeYear].inner.length && this.activeYear !== 3){
            this.activeStat = 1
            this.activeYear++;
          } else {
            this.activeStat++;
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

        this.syncButtons();
      },
      wheelScroll: function(event) {
        const goToRoadmap = () => {
          if(this.$router.history.current.name !== "Roadmap"){
            this.$router.push({ name: 'Roadmap'});
          }
        };
        this.activeSlider = false;
        new TWEEN.Tween(this.particles.position)
        .to({ z: -10000 }, 3000)
        .easing(TWEEN.Easing.Quintic.Out)
        .start();

        new TWEEN.Tween(this.camera.position)
        .to({ z: 0 }, 1500)
        .onComplete(function() {
          goToRoadmap();
        })
        .easing(TWEEN.Easing.Quintic.Out)
        .start();
      },
      handleScroll (event) {

      },
      updateCarousel (payload) {
        // this.$store.commit('changeSlide', payload.currentSlide);
        // this.$store.commit('setChangeSlide', true);
      },
      syncButtons: function () {
        if (this.activeYear === 0) {
          this.prevBtnYear = 0;
          this.nextBtnYear = 0;
          this.prevBtnInner = 0;
          this.nextBtnInner = 1;

          if (this.activeStat === 1) {
            this.prevBtnYear = 3;
            this.prevBtnInner = 1;
          }
          if (this.activeStat === 2) {
            this.nextBtnYear = 1;
          }
        }
        if (this.activeYear === 1) {
          this.prevBtnYear = 1;
          this.nextBtnYear = 1;

          if (this.activeStat === 1) {
            this.prevBtnYear = 0;
            this.prevBtnInner = 0;
            this.nextBtnInner = 1;
          }
          if (this.activeStat === 2) {
            this.prevBtnInner = 1;
            this.nextBtnInner = 2;
          }
          if (this.activeStat === 3) {
            this.prevBtnInner = 2;
            this.nextBtnInner = 3;
          }
          if (this.activeStat === 4) {
            this.nextBtnYear = 2;
            this.prevBtnInner = 3;
            this.nextBtnInner = 0;
          }
        }
        if (this.activeYear === 2) {
          this.prevBtnYear = 2;
          this.nextBtnYear = 2;

          if (this.activeStat === 1) {
            this.prevBtnYear = 1;
            this.prevBtnInner = 0;
            this.nextBtnInner = 1;
          }
          if (this.activeStat === 2) {
            this.prevBtnInner = 1;
            this.nextBtnInner = 2;
          }
          if (this.activeStat === 3) {
            this.prevBtnInner = 2;
            this.nextBtnInner = 3;
          }
          if (this.activeStat === 4) {
            this.nextBtnYear = 3;
            this.prevBtnInner = 3;
            this.nextBtnInner = 0;
          }
        }
        if (this.activeYear === 3) {
          this.prevBtnYear = 3;
          this.nextBtnYear = 3;

          if (this.activeStat === 1) {
            this.prevBtnYear = 2;
            this.prevBtnInner = 3;
            this.nextBtnInner = 0;
          }
          if (this.activeStat === 2) {
            this.nextBtnYear = 0;
            this.prevBtnInner = 0;
            this.nextBtnInner = 1;
          }
        }
      }
    },
    mounted () {
      setTimeout(() => {
        this.activeSlider = true;
      },2500)
      this.helper();
      this.$store.commit('setRoadmapInnerRoute', true);
      let test;
      if (this.$route.params.id >= 4 && this.$route.params.id < 9) {
        this.activeYear = 1;
      }
      if (this.$route.params.id >= 9 && this.$route.params.id < 14) {
        this.activeYear = 2;
      }
      if (this.$route.params.id >= 14) {
        this.activeYear = 3;
      }

      if (this.$route.params.id == 1 || this.$route.params.id == 2 || this.$route.params.id == 4 || this.$route.params.id == 5 || this.$route.params.id == 9 || this.$route.params.id == 10 || this.$route.params.id == 14 || this.$route.params.id == 15) {
        this.activeStat = 1
      }
      if (this.$route.params.id == 3 || this.$route.params.id == 6 || this.$route.params.id == 11 || this.$route.params.id == 16) {
        this.activeStat = 2
      }
      if (this.$route.params.id == 7 || this.$route.params.id == 12 || this.$route.params.id == 17) {
        this.activeStat = 3
      }
      if (this.$route.params.id == 8 || this.$route.params.id == 13) {
        this.activeStat = 4
      }
      this.syncButtons();
      this.sliderScene();
      this.animate();
      document.addEventListener('click', this.updateUiData);
      window.addEventListener('pointermove', this.onPointerMove);
      document.addEventListener('wheel', this.wheelScroll, false);
      window.addEventListener('resize', this.onWindowResize, false);
      this.$store.commit('stopRoadmapInner', false);
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.onWindowResize, false);
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
  #prev-slider-btn {
    position: absolute;
    top: 34%;
    left: 6%;
    display: flex;
  }
  #prev-slider-btn > span,#next-slider-btn > span{
    margin-right: 5px;
    color: #FF7152;
  }
  #prev-slider-btn div span, #next-slider-btn div span{
    text-transform: uppercase;
  }
  #next-slider-btn {
    position: absolute;
    top: 34%;
    right: 6%;
    display: flex;
  }
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
    margin-top: 50px;
  }
  .roadmap-text__block{
    position: absolute;
    height: calc(100% - 115px);
    width: 100%;
    bottom: 0px;
    right: 0px;
    pointer-events: none;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    opacity: 0;
    transform: translateY(10px);
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
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    transform: translateY(10px);
    opacity: 0;
  }
  .roadmap-text__container.active{
    transform: translateY(0px);
    opacity: 1;
    transition-delay: .6s;
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
