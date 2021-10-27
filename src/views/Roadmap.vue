<template>
  <div class="main-roadmap" :class="filterVisible ? 'filterActive' : ''">
    <div id="roadmap-container" v-touch:swipe="swipeHandler" v-touch:longtap="swipeHandler"></div>
    <div id="filters-container" class="filters" :class="[$store.state.navigation ? 'activeNav' : '']">
      <div class="clearFilter" id="clear-filter" @click="closeFilters" :class="closeFilter ? 'active' : ''">
        <span></span>
        <span></span>
      </div>
      <div id="filterToogle">
        <span id="list-itemf0" class="filter-item">Filter</span>
        <span id="list-itemf1" class="filter-item">Inception</span>
        <span id="list-itemf2" class="filter-item">Year 2021</span>
        <span id="list-itemf3" class="filter-item">Year 2022</span>
        <span id="list-itemf4" class="filter-item">Year 2023</span>
        <span id="list-itemf5" class="filter-item">Year 2024</span>
      </div>
    </div>
    <div data-v-1afa4326="" class="roadmap__socials">
      <a data-v-1afa4326="" href="https://twitter.com/COREMultichain" target="_blank"><svg data-v-1afa4326="" width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path data-v-1afa4326="" d="M20 2.79875C19.2563 3.125 18.4637 3.34125 17.6375 3.44625C18.4875 2.93875 19.1363 2.14125 19.4412 1.18C18.6488 1.6525 17.7738 1.98625 16.8412 2.1725C16.0887 1.37125 15.0162 0.875 13.8462 0.875C11.5763 0.875 9.74875 2.7175 9.74875 4.97625C9.74875 5.30125 9.77625 5.61375 9.84375 5.91125C6.435 5.745 3.41875 4.11125 1.3925 1.6225C1.03875 2.23625 0.83125 2.93875 0.83125 3.695C0.83125 5.115 1.5625 6.37375 2.6525 7.1025C1.99375 7.09 1.3475 6.89875 0.8 6.5975C0.8 6.61 0.8 6.62625 0.8 6.6425C0.8 8.635 2.22125 10.29 4.085 10.6712C3.75125 10.7625 3.3875 10.8062 3.01 10.8062C2.7475 10.8062 2.4825 10.7913 2.23375 10.7362C2.765 12.36 4.2725 13.5538 6.065 13.5925C4.67 14.6838 2.89875 15.3412 0.98125 15.3412C0.645 15.3412 0.3225 15.3263 0 15.285C1.81625 16.4563 3.96875 17.125 6.29 17.125C13.835 17.125 17.96 10.875 17.96 5.4575C17.96 5.27625 17.9538 5.10125 17.945 4.9275C18.7588 4.35 19.4425 3.62875 20 2.79875Z" fill="white"></path></svg></a>
      <a data-v-1afa4326="" href="https://t.me/coreblockchain" target="_blank"><svg data-v-1afa4326="" width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path data-v-1afa4326="" d="M6.278 9.12066L6.01333 12.8433C6.392 12.8433 6.556 12.6807 6.75266 12.4853L8.528 10.7887L12.2067 13.4827C12.8813 13.8587 13.3567 13.6607 13.5387 12.862L15.9533 1.54732L15.954 1.54666C16.168 0.549324 15.5933 0.159324 14.936 0.403991L0.742663 5.83799C-0.226003 6.21399 -0.211337 6.75399 0.577996 6.99866L4.20666 8.12732L12.6353 2.85332C13.032 2.59066 13.3927 2.73599 13.096 2.99866L6.278 9.12066Z" fill="white"></path></svg></a>
      <a data-v-1afa4326="" href="https://www.linkedin.com/company/coremultichain/" target="_blank"><svg data-v-1afa4326="" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g data-v-1afa4326=""><path data-v-1afa4326="" d="M19.9951 19.9999V19.999H20.0001V12.664C20.0001 9.07569 19.2276 6.31152 15.0326 6.31152C13.0159 6.31152 11.6626 7.41819 11.1101 8.46736H11.0517V6.64652H7.07422V19.999H11.2159V13.3874C11.2159 11.6465 11.5459 9.9632 13.7017 9.9632C15.8259 9.9632 15.8576 11.9499 15.8576 13.499V19.9999H19.9951Z" fill="white"></path><path data-v-1afa4326="" d="M0.330139 6.64746H4.47681V20H0.330139V6.64746Z" fill="white"></path><path data-v-1afa4326="" d="M2.40167 0C1.07583 0 0 1.07583 0 2.40167C0 3.7275 1.07583 4.82583 2.40167 4.82583C3.7275 4.82583 4.80333 3.7275 4.80333 2.40167C4.8025 1.07583 3.72667 0 2.40167 0V0Z" fill="white"></path></g><defs data-v-1afa4326=""><clipPath data-v-1afa4326="" id="clip0"><rect data-v-1afa4326="" width="20" height="20" fill="white"></rect></clipPath></defs></svg></a>
      <a data-v-1afa4326="" href="https://github.com/CORE-Blockchain" target="_blank"><svg data-v-1afa4326="" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path data-v-1afa4326="" d="M9.99875 0C4.4775 0 0 4.59056 0 10.2534C0 14.7827 2.865 18.6252 6.84 19.9822C7.34 20.0767 7.5225 19.7601 7.5225 19.4882C7.5225 19.2444 7.51375 18.5997 7.50875 17.7444C4.7275 18.3635 4.14 16.3695 4.14 16.3695C3.68625 15.1849 3.03 14.8695 3.03 14.8695C2.12125 14.2338 3.0975 14.2466 3.0975 14.2466C4.10125 14.3193 4.62875 15.3036 4.62875 15.3036C5.52125 16.8699 6.97 16.418 7.54 16.155C7.63 15.4925 7.88875 15.0406 8.175 14.784C5.955 14.5249 3.62 13.6453 3.62 9.71728C3.62 8.59773 4.01 7.68242 4.65 6.96499C4.54625 6.70584 4.20375 5.66288 4.7475 4.25227C4.7475 4.25227 5.5875 3.97653 7.4975 5.30289C8.295 5.07566 9.15 4.96204 10.0013 4.95821C10.85 4.96332 11.7062 5.07566 12.505 5.30417C14.4137 3.97781 15.2525 4.25355 15.2525 4.25355C15.7975 5.66544 15.455 6.70712 15.3525 6.96627C15.9937 7.6837 16.38 8.599 16.38 9.71856C16.38 13.6568 14.0425 14.5236 11.815 14.7776C12.1737 15.0942 12.4937 15.7197 12.4937 16.6759C12.4937 18.0469 12.4812 19.1524 12.4812 19.4882C12.4812 19.7626 12.6613 20.0818 13.1687 19.9809C17.1375 18.6227 20 14.7815 20 10.2534C20 4.59056 15.5225 0 9.99875 0Z" fill="white"></path></svg></a>
    </div>
    <div class="roadmap-hepler__container" :class="help !== null ? 'active' : ''">
      <div class="roadmap-hepler__outer">
        <div class="roadmap-hepler" :key="0" :class="help == 1 ? 'active' : ''">
          <div class="roadmap-hepler__drag">
            <div class="roadmap-hepler__drag-line"></div>
            <svg class="roadmap-hepler__drag-icon" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 416.031 416.031" style="enable-background:new 0 0 512 512" xml:space="preserve">
              <g>
              <path xmlns="http://www.w3.org/2000/svg" d="M221.605,0h-31.913C123.743,0,72.083,53.745,72.083,122.356v171.306c0,68.618,51.66,122.369,117.609,122.369h31.913  c67.46,0,122.343-54.894,122.343-122.369V122.356C343.948,54.889,289.065,0,221.605,0z M206.781,64.12h2.469c3.859,0,7,3.14,7,7  v49.833c0,3.86-3.141,7-7,7h-2.469c-3.859,0-7-3.14-7-7V71.12C199.781,67.26,202.922,64.12,206.781,64.12z M327.948,293.662  c0,58.652-47.705,106.369-106.343,106.369h-31.913c-56.978,0-101.609-46.723-101.609-106.369V122.356  C88.083,62.718,132.715,16,189.692,16h10.225v33.167c-9.34,2.927-16.136,11.661-16.136,21.954v49.833  c0,10.292,6.796,19.027,16.136,21.953v41.166c0,4.418,3.582,8,8,8s8-3.582,8-8v-41.108c9.441-2.865,16.333-11.647,16.333-22.011  V71.12c0-10.364-6.892-19.146-16.333-22.012V16h5.688c58.638,0,106.343,47.711,106.343,106.356V293.662z" fill="#ffffff" data-original="#000000" style=""/>
              </g>
            </svg>
          </div>
          <div class="roadmap-hepler__drag-ttl">
            DRAG OR SCROLL <br>TO NAVIGATE
          </div>
        </div>
        <div class="roadmap-hepler" :key="1" :class="help == 2 ? 'active' : ''">
          <div class="roadmap-hepler__drag">
            <div class="roadmap-hepler__drag-line"></div>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 128 128" style="enable-background:new 0 0 512 512" xml:space="preserve" class="roadmap-hepler__click-icon"><g><g xmlns="http://www.w3.org/2000/svg"><path d="M64,0a64,64,0,1,0,64,64A64.073,64.073,0,0,0,64,0Zm60.5,64C124.5,71,99.653,78.8,64,78.8c-5.018,0-9.812-.159-14.362-.444-.285-4.551-.445-9.345-.445-14.363C49.193,28.344,57,3.5,64,3.5A60.569,60.569,0,0,1,124.5,64ZM57.4,3.864c-5.818,7.29-9.561,24.028-11.015,42.5-3.681.286-7.279.659-10.7,1.12a1.75,1.75,0,0,0,.231,3.484,1.878,1.878,0,0,0,.235-.015c3.2-.431,6.555-.783,9.99-1.059-.291,4.666-.441,9.407-.441,14.1s.15,9.446.441,14.115C20.322,76.057,3.5,69.758,3.5,64A60.582,60.582,0,0,1,57.4,3.864ZM3.867,70.6c7.292,5.82,24.037,9.563,42.513,11.016,1.453,18.477,5.2,35.221,11.016,42.513A60.6,60.6,0,0,1,3.867,70.6ZM64,124.5c-5.761,0-12.059-16.822-14.114-42.634,4.669.292,9.413.441,14.114.441s9.438-.149,14.1-.44c-.289,3.585-.66,7.082-1.116,10.4a1.749,1.749,0,0,0,1.5,1.972,1.784,1.784,0,0,0,.241.016,1.748,1.748,0,0,0,1.731-1.511c.488-3.548.881-7.289,1.18-11.126,18.47-1.454,35.208-5.2,42.5-11.015A60.582,60.582,0,0,1,64,124.5Z" fill="#ffffff" data-original="#000000" style=""/><path d="M12.586,56.411a1.756,1.756,0,0,0,.635-.12A78.43,78.43,0,0,1,24.474,53a1.75,1.75,0,0,0-.76-3.417,82.072,82.072,0,0,0-11.763,3.448,1.751,1.751,0,0,0,.635,3.382Z" fill="#ffffff" data-original="#000000" style=""/><path d="M107.043,53.843a70.6,70.6,0,0,1,7.737,2.448,1.75,1.75,0,0,0,1.268-3.262,73.814,73.814,0,0,0-8.126-2.574,1.75,1.75,0,0,0-.879,3.388Z" fill="#ffffff" data-original="#000000" style=""/><path d="M58.089,47.507a1.75,1.75,0,0,0,1.749,1.72h.031c3.925-.068,7.977-.038,11.911.093h.06a1.75,1.75,0,0,0,.057-3.5c-3.992-.133-8.1-.163-12.088-.094A1.75,1.75,0,0,0,58.089,47.507Z" fill="#ffffff" data-original="#000000" style=""/><path d="M83.661,50.04c4.1.366,8.07.85,11.794,1.438a1.727,1.727,0,0,0,.275.022A1.75,1.75,0,0,0,96,48.021c-3.8-.6-7.85-1.094-12.03-1.467a1.75,1.75,0,1,0-.311,3.486Z" fill="#ffffff" data-original="#000000" style=""/><path d="M78.691,56.637c.077,2.412.116,4.888.116,7.36q0,2.3-.044,4.549a1.75,1.75,0,0,0,1.715,1.784h.036a1.751,1.751,0,0,0,1.749-1.716q.043-2.288.044-4.617c0-2.508-.039-5.022-.118-7.472a1.75,1.75,0,0,0-3.5.112Z" fill="#ffffff" data-original="#000000" style=""/><path d="M77,102.608a1.751,1.751,0,0,0-2.093,1.321,77.439,77.439,0,0,1-3.2,10.848,1.75,1.75,0,1,0,3.262,1.268A80.9,80.9,0,0,0,78.322,104.7,1.75,1.75,0,0,0,77,102.608Z" fill="#ffffff" data-original="#000000" style=""/><path d="M76.144,30.275c.486,2.791.914,5.756,1.272,8.811a1.749,1.749,0,0,0,1.736,1.546,1.792,1.792,0,0,0,.206-.012,1.751,1.751,0,0,0,1.535-1.942c-.367-3.119-.8-6.148-1.3-9a1.75,1.75,0,1,0-3.448.6Z" fill="#ffffff" data-original="#000000" style=""/><path d="M74.318,21.6a1.751,1.751,0,0,0,3.395-.855,75.356,75.356,0,0,0-2.745-8.794,1.75,1.75,0,0,0-3.262,1.269A71.646,71.646,0,0,1,74.318,21.6Z" fill="#ffffff" data-original="#000000" style=""/></g></g></svg>
          </div>
          <div class="roadmap-hepler__drag-ttl">
            CLICK ON SPHERES <br>TO DISCOVER
          </div>
        </div>
      </div>
    </div>
    <router-link to="/about" class="roadmap__about">About</router-link>
  </div>
</template>

<script>
import * as THREE from 'three';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { TessellateModifier } from 'three/examples/jsm/modifiers/TessellateModifier.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
const TWEEN = require('@tweenjs/tween.js');
import {
  roadmap_vertex,
  part_vertex,
  glow_vertex,
  buble_vertex
} from '../assets/shaders/vertex.js';
import {
  roadmap_fragment,
  part_fragment,
  glow_fragment,
  buble_fragment
} from '../assets/shaders/fragment.js';
export default {
  name: 'Roadmap',
  data () {
    return {
      scene: null,
      camera: null,
      controls: null,
      roadmapGeo: null,
      roadmapMat: null,
      roadmapMesh: null,
      roadmapUniforms: null,
      raycaster: new THREE.Raycaster(),
      mouse: new THREE.Vector2(),
      renderer: null,
      mouseX: 0,
      mouseY: 0,
      windowHalfX: window.innerWidth / 2,
      windowHalfY: window.innerHeight / 2,
      uniforms: null,
      isPointerDown: false,
      direction: "",
      directionX: "",
      oldX: 0,
      oldY: 0,
      partMat: null,
      partGeo: null,
      particles: null,
      roadmapVertex: roadmap_vertex,
      roadmapFragment: roadmap_fragment,
      partVertex: part_vertex,
      partFragment: part_fragment,
      labelRenderer: new CSS2DRenderer(),
      yearMesh: null,
      bubleMesh: null,
      meshBubles: 17,
      colors: [
        new THREE.Color(0xFF7152),
        new THREE.Color(0xF59337),
        new THREE.Color(0xE10FEC),
        new THREE.Color(0x5910C5),
        new THREE.Color(0x3F057E),
        new THREE.Color(0xffffff)
      ],
      yD: [17, 57, 2, 37, 22, -7, -7, 47, 2, 27, 55, 17, 17, 17, 17, 55, 7],
      xD: [-693, -602, -500, -407, -297, -197, -97, -57, 0, 52, 102, 202, 302, 402, 502, 602, 703],
      itemSize: 0,
      itemAlpha: 0,
      filterVisible: false,
      bubleData: [
        {
          title: 'Inception',
          category: false
        },
        {
          title: '2021',
          category: false
        },
        {
          title: 'Q3',
          category: 'Category3'
        },
        {
          title: 'Q4',
          category: 'Category4'
        },
        {
          title: '2022',
          category: false
        },
        {
          title: 'Q1',
          category: 'Category1'
        },
        {
          title: 'Q2',
          category: 'Category2'
        },
        {
          title: 'Q3',
          category: 'Category3'
        },
        {
          title: 'Q4',
          category: 'Category4'
        },
        {
          title: '2023',
          category: false
        },
        {
          title: 'Q1',
          category: 'Category1'
        },
        {
          title: 'Q2',
          category: 'Category2'
        },
        {
          title: 'Q3',
          category: 'Category3'
        },
        {
          title: 'Q4',
          category: 'Category4'
        },
        {
          title: '2024',
          category: false
        },
        {
          title: 'Q1',
          category: 'Category1'
        },
        {
          title: 'Q2',
          category: 'Category2'
        }
      ],
      help: null,
      closeFilter: false,
      clock: new THREE.Clock(),
      alphas: null,
      lineAlphas: null,
      INTERSECTED: null,
      holdRoadmapPath: false,
      anim: false,
      lineDelta: 0,
      bloomPass: null,
      composer: null,
      renderScene: null,
      params: {
        exposure: 0,
        bloomStrength: 0.3,
        bloomThreshold: 0,
        bloomRadius: 0
      },
    }
  },
  methods: {
    helper: function() {
      setTimeout(() => {
        this.help = 1;
      },6000);
      setTimeout(() => {
        this.help = 2;
      },9000);
      setTimeout(() => {
        this.help = null;
      },12000);
    },
    roadmapScene: function() {
      var container = document.getElementById('roadmap-container');

      this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
      this.labelRenderer.domElement.style.position = 'absolute';
      this.labelRenderer.domElement.style.bottom = '0px';
      this.labelRenderer.domElement.style.pointerEvents = 'none';

      container.appendChild(this.labelRenderer.domElement);

      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1500);
      this.camera.position.z = 100;

      this.scene = new THREE.Scene();

      var sLight = new THREE.SpotLight(0xffffff);
      this.scene.add(sLight);

      var aLight = new THREE.AmbientLight(0xffffff);
      this.scene.add(aLight);

      var directionalLight = new THREE.DirectionalLight("#fff", 2);
      directionalLight.position.set(0, 50, -20);
      this.scene.add(directionalLight);

      THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
      THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
      THREE.Mesh.prototype.raycast = acceleratedRaycast;

      this.createRoadmapBody();
      this.createBubleParticles();
      this.createRoadmapTimePoints();
      this.loadFilter();

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setClearColor(0x000113, 1);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableZoom = true;
      this.controls.enableRotate = false;
      this.controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
      this.controls.mouseButtons.RIGHT = THREE.MOUSE.DOLLY;
      this.controls.screenSpacePanning = false;
      this.controls.enableDamping = true;

      this.renderScene = new RenderPass(this.scene, this.camera);

      this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
      this.bloomPass.threshold = this.params.bloomThreshold;
      this.bloomPass.strength = this.params.bloomStrength;
      this.bloomPass.radius = this.params.bloomRadius;
      this.bloomPass.exposure = this.params.exposure;

      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(this.renderScene);
      this.composer.addPass(this.bloomPass);

      if (this.$store.state.roadmapInnerRoute) {
        this.moveRoadmapFromSlider();
      } else {
        this.moveRoadmapToStart();
      }

      container.appendChild(this.renderer.domElement);
    },
    createRoadmapBody: function() {
      this.roadmapGeo = new THREE.PlaneBufferGeometry(1000*1.5, 80*1.5, 600, 80);

      let numVertices = this.roadmapGeo.attributes.position.count;
      this.alphas = new Float32Array(numVertices * 1); // 1 values per vertex
      this.lineAlphas = new Float32Array(numVertices * 1); // 1 values per vertex
      let step = 1;

      for(var i = 0; i < numVertices; i++) {
        this.alphas[i] = Math.random() * (1 - 0.5) + 0.5;

        this.lineAlphas[i] = step;
        step = step - step / numVertices;
      }
     
      this.roadmapGeo.setAttribute('alpha', new THREE.BufferAttribute(this.alphas, 1));
      this.roadmapGeo.setAttribute('alpha2', new THREE.BufferAttribute(this.lineAlphas, 1));

      this.roadmapUniforms = {
        time: { type: "f", value: 0.0 },
        uColor: { value: new THREE.Color(0x5E68FF) },
        curveColor: { value: this.colors[0] },
        lines: { value: new THREE.Color(0x5E68FF) },
        pointColor1: { value: new THREE.Color(0x5159FF) },
        pointColor2: { value: new THREE.Color(0x5159FF) },
        pointColor3: { value: new THREE.Color(0x444EFF) },
        pointColor4: { value: new THREE.Color(0x444EFF) },
        pointColor5: { value: new THREE.Color(0x444EFF) },
        displayCurve: { value: false },
        fadeOut: { value: false }
      };

      this.roadmapMat = new THREE.ShaderMaterial({
        uniforms: this.roadmapUniforms,
        vertexShader: this.roadmapVertex,
        fragmentShader: this.roadmapFragment,
        transparent: true,
        depthTest: false,
        depthWrite: false
      });

      this.roadmapMesh = new THREE.Points(this.roadmapGeo, this.roadmapMat);
      this.roadmapMesh.receiveShadow = true;
      this.roadmapMesh.rotateX(90);
      this.scene.add(this.roadmapMesh);
    },
    createRoadmapTimePoints: function () {
      for (let i = 0; i < this.meshBubles; ++i) {
        const toolDiv = document.createElement('div');
        const toolTitle = document.createElement('div');
        toolDiv.id = 'buble-tooltip' + i;
        toolDiv.className = 'buble-tooltip';

        if (i == 0 || i == 1 || i == 4 || i == 9 || i == 14) {
          toolDiv.className = 'active';
        }

        toolDiv.appendChild(toolTitle);
        toolTitle.textContent = this.bubleData[i].title;
        if(this.bubleData[i].category){
          const toolSubTitle = document.createElement('span');
          toolSubTitle.textContent = this.bubleData[i].category;
          toolDiv.appendChild(toolSubTitle);
        }

        const bubleTooltip = new CSS2DObject(toolDiv);
        let lGeo = new THREE.SphereBufferGeometry(10, 30, 30);
        let lMat = new THREE.MeshBasicMaterial({
          color: this.colors[0],
          transparent: true,
          opacity: 0
        });
        this.bubleMesh = new THREE.Mesh(lGeo, lMat);
        this.bubleMesh.add(bubleTooltip);

        this.bubleMesh.position.setY(this.yD[i]);
        this.bubleMesh.position.setX(this.xD[i]);
        this.roadmapMesh.add(this.bubleMesh);
      }
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
        vertexShader:   this.partVertex,
        fragmentShader: this.partFragment,
        transparent:    true,
        depthTest:      false,
        blending:       THREE.AdditiveBlending
      });

      var variance = 2.5 * (Math.random() + Math.random() + Math.random()) / 3.0;
      var stars = 5000;

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

        alphas[i] = 1;
        sizes[i] = (Math.random() * Math.random() * 5.0);
      }

      this.partGeo = new THREE.BufferGeometry();
      this.partGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      this.partGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      this.partGeo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
      this.partGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      this.particles = new THREE.Points(this.partGeo, this.partMat);
      this.scene.add(this.particles);
    },
    loadFilter: function () {
      setTimeout(() => {
        let filter = document.getElementById('filters-container');

        if (filter !== null) {
          filter.classList.add('active');
        }
      }, 5000);
    },
    moveRoadmapFromSlider: function () {
      this.particles.position.z = -5000;
      this.camera.position.z = 0;

      new TWEEN.Tween(this.camera.position)
      .to({ z: 100 }, 2000)
      .easing(TWEEN.Easing.Quintic.Out)
      .start();

      new TWEEN.Tween(this.particles.position)
      .to({ z: 0 }, 2000)
      .easing(TWEEN.Easing.Quintic.Out)
      .start();
    },
    moveRoadmapToStart: function () {
      this.roadmapMesh.rotateZ(0.2);
      this.roadmapMesh.position.set(0, 0, 0);

      setTimeout(() => {
        new TWEEN.Tween(this.roadmapMesh.position)
        .to({ x: 600, y: 0, z: 0 }, 4000)
        .easing(TWEEN.Easing.Quintic.Out)
        .start();

        new TWEEN.Tween(this.roadmapMesh.rotation)
        .to({ z: 0 }, 4000)
        .easing(TWEEN.Easing.Quintic.Out)
        .start();
      }, 1000);
    },
    animate: function () {
      const theTime = performance.now() * 0.001;
      const delta = 5 * this.clock.getDelta();

      this.roadmapMat.uniforms.time.value = theTime / 15;

      let partZSin = Math.sin(theTime);
      this.particles.position.z = this.particles.position.z / 1.1 + partZSin / 2;
      this.particles.position.y = this.particles.position.y / 1.1 + partZSin / 2;
      this.particles.position.x = this.particles.position.x / 1.1 + partZSin / 2;
      this.particles.rotation.y += 0.003;
      this.particles.rotation.z += 0.001;

      if (this.$store.state.stopRoadmap == false){
        requestAnimationFrame(this.animate);
      }
      this.controls.update();
      TWEEN.update();
      this.render();
    },
    render: function () {
      if (this.$store.state.stopRoadmap == false) {
        //this.renderer.render(this.scene, this.camera);
        this.labelRenderer.render(this.scene, this.camera);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.composer.render();

        this.alphas = this.roadmapGeo.attributes.alpha;
        this.lineAlphas = this.roadmapGeo.attributes.alpha2;
        var count = this.alphas.count;

        for(var i = 0; i < count; i++) {
          this.alphas.array[i] *= 0.95;
          this.lineAlphas.array[i] *=0.985;
          
          if (this.lineAlphas.array[i] < 0.05) {
            this.lineAlphas.array[i] = 1;
          }

          if (this.alphas.array[i] < 0.2) { 
            if (this.anim) {
              this.alphas.array[i] = 0;
            } else {
              this.alphas.array[i] = 1.0;
            }
          }
        }

        this.alphas.needsUpdate = true; // important!
        this.lineAlphas.needsUpdate = true; // important!

        this.renderer.setPixelRatio(window.devicePixelRatio);
      }
    },
    route: function (id) {
      for (let i = 0; i < 17; i++) {
        let int = this.raycaster.intersectObjects([this.scene.children[3].children[i]]);
        if (int.length > 0) {
          var iMesh = int[0].object;
          var tooltipClass = iMesh.children[0].children[0];
          this.anim = true;
          this.roadmapUniforms.fadeOut.value = true;

          new TWEEN.Tween(this.camera.position)
          .to({ z: 5 }, 500)
          .easing(TWEEN.Easing.Linear.None)
          .onComplete(() => {
            if (i !== 0) {
              this.$router.push({ name: 'roadmapInner', params: { id: i }});
            } else {
              this.$router.push({ name: 'roadmapInner', params: { id: 1 }});
            }
          })
          .start();

          new TWEEN.Tween(this.particles.position)
          .to({ z: -5000 }, 500)
          .easing(TWEEN.Easing.Linear.None)
          .start();
        }
      }
    },
    closeFilters() {
      this.closeFilter = false;
      this.filterLine = false;
    },
    filterClick: function (e) {
      this.filterVisible = !this.filterVisible;
      let el = document.getElementById('list-itemf0');

      if (event.target.id === 'clear-filter') {
        el.innerHTML = 'Filter';
        el.style['color'] = '#FFFFFF';
        this.closeFilter = false;
        this.holdRoadmapPath = false;
      }

      if (e.target.id == 'list-itemf1') {
        el.innerHTML = 'Inception';
        el.style['color'] = '#FF7152';
        this.closeFilter = true;
        this.roadmapMat.uniforms.displayCurve.value = true;
        this.holdRoadmapPath = true;
        this.roadmapUniforms.curveColor.value = this.colors[0];
      }

      if (e.target.id == 'list-itemf2') {
        el.innerHTML = 'Year 2021';
        el.style['color'] = '#F59337';
        this.closeFilter = true;
        this.roadmapMat.uniforms.displayCurve.value = true;
        this.holdRoadmapPath = true;
        this.roadmapUniforms.curveColor.value = this.colors[1];
      }

      if (e.target.id == 'list-itemf3') {
        el.innerHTML = 'Year 2022';
        el.style['color'] = '#E10FEC';
        this.closeFilter = true;
        this.roadmapMat.uniforms.displayCurve.value = true;
        this.holdRoadmapPath = true;
        this.roadmapUniforms.curveColor.value = this.colors[2];
      }

      if (e.target.id == 'list-itemf4') {
        el.innerHTML = 'Year 2023';
        el.style['color'] = '#5910C5';
        this.closeFilter = true;
        this.roadmapMat.uniforms.displayCurve.value = true;
        this.holdRoadmapPath = true;
        this.roadmapUniforms.curveColor.value = this.colors[3];
      }

      if (e.target.id == 'list-itemf5') {
        el.innerHTML = 'Year 2024';
        el.style['color'] = '#3F057E';
        this.closeFilter = true;
        this.roadmapMat.uniforms.displayCurve.value = true;
        this.holdRoadmapPath = true;
        this.roadmapUniforms.curveColor.value = this.colors[4];
      }
    },
    onWindowResize: function () {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
      this.render();
    },
    onPointerDown: function (event) {
      if (event.isPrimary === false) return;
      this.isPointerDown = true;
    },
    onPointerUp: function () {
      if (event.isPrimary === false) return;
      this.isPointerDown = false;
    },
    onPointerMove: function (event) {
      if (event.isPrimary === false) return;
      if(this.$store.state.stopRoadmap == true){
        return false
      }

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

      this.particles.rotation.y = this.mouseX * 0.0001;
      this.particles.rotation.x = this.mouseY * 0.0001;

      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

      this.mouseX = event.clientX - this.windowHalfX;
      this.mouseY = event.clientY - this.windowHalfY;

      if (this.scene.children[3] === undefined) {
        return false;
      } else {
        let int = this.raycaster.intersectObjects(this.scene.children[3].children);
        
        if (int.length > 0) {
          if (this.INTERSECTED != int[0].object) {
            this.roadmapMat.uniforms.displayCurve.value = true;
            let intId = int[0].object.children[0].element.id;

            if (!this.holdRoadmapPath) {
              if (intId === 'buble-tooltip0') {
                this.roadmapUniforms.curveColor.value = this.colors[0];
              } 
              if (intId === 'buble-tooltip1' || intId === 'buble-tooltip2' || intId === 'buble-tooltip3') {
                this.roadmapUniforms.curveColor.value = this.colors[1];
              } 
              if (intId === 'buble-tooltip4' || intId === 'buble-tooltip5' || intId === 'buble-tooltip6' || intId === 'buble-tooltip7' || intId === 'buble-tooltip8' ) {
                this.roadmapUniforms.curveColor.value = this.colors[2];
              } 
              if (intId === 'buble-tooltip9' || intId === 'buble-tooltip10' || intId === 'buble-tooltip11' || intId === 'buble-tooltip12' || intId === 'buble-tooltip13') {
                this.roadmapUniforms.curveColor.value = this.colors[3];
              } 
              if (intId === 'buble-tooltip14' || intId === 'buble-tooltip15' || intId === 'buble-tooltip16') {
                this.roadmapUniforms.curveColor.value = this.colors[4];
              }
            }
          }

          if (this.roadmapMesh.position.z == 0) {
            new TWEEN.Tween(this.roadmapMesh.position)
            .to({ z: 8 }, 400)
            .easing(TWEEN.Easing.Linear.None)
            .start();
          }
        } else {
          if (!this.holdRoadmapPath) {
            this.roadmapMat.uniforms.displayCurve.value = false;
          }
          
          if (this.roadmapMesh.position.z == 8) {
            new TWEEN.Tween(this.roadmapMesh.position)
            .to({ z: 0 }, 700)
            .easing(TWEEN.Easing.Linear.None)
            .start();
          }
        }
      }
    },
    swipeHandler (direction, event) {
      if(window.innerWidth < 1023){
        if (direction == 'left' && this.roadmapMesh.position.x > -600) {
          this.roadmapMesh.position.x = this.roadmapMesh.position.x - 7;
          new TWEEN.Tween(this.camera.rotation)
          .to({ y: -0.6 }, 400)
          .easing(TWEEN.Easing.Linear.None)
          .start();

          setTimeout(() => {
            new TWEEN.Tween(this.camera.rotation)
            .to({ y: 0 }, 1500)
            .easing(TWEEN.Easing.Linear.None)
            .start();
          }, 400);
        }
        if (direction == 'right'  && this.roadmapMesh.position.x < 600) {
          this.roadmapMesh.position.x = this.roadmapMesh.position.x + 7;
          new TWEEN.Tween(this.camera.rotation)
          .to({ y: -0.6 }, 400)
          .easing(TWEEN.Easing.Linear.None)
          .start();

          setTimeout(() => {
            new TWEEN.Tween(this.camera.rotation)
            .to({ y: 0 }, 1500)
            .easing(TWEEN.Easing.Linear.None)
            .start();
          }, 400);
        }
        if (this.roadmapMesh.position.x > 1400) {
          setTimeout(() => {
            new TWEEN.Tween(this.roadmapMesh.position)
              .to({ x: 1400 }, 1000)
              .easing(TWEEN.Easing.Quintic.Out)
              .start();
          },1000)
        }

        if (this.roadmapMesh.position.x < -1400) {
          setTimeout(() => {
            new TWEEN.Tween(this.roadmapMesh.position)
              .to({ x: -1300 }, 1000)
              .easing(TWEEN.Easing.Quintic.Out)
              .start();
          }, 1000)
        }
      }
    }
  },
  mounted () {
    let clearFilter = document.getElementById('clear-filter');
    let filter0 = document.getElementById('list-itemf0');
    let filter1 = document.getElementById('list-itemf1');
    let filter2 = document.getElementById('list-itemf2');
    let filter3 = document.getElementById('list-itemf3');
    let filter4 = document.getElementById('list-itemf4');
    let filter5 = document.getElementById('list-itemf5');

    this.helper();
    const promise = new Promise((resolve, reject) => {
      resolve (this.roadmapScene())
    });
    promise.then((value) => {
      this.animate();
    });
    this.$store.commit('stopRoadmap', false);
    document.addEventListener('mouseup', this.onPointerUp, false);
    document.addEventListener('mousedown', this.onPointerDown, false);
    document.addEventListener('mousedown', this.route, false);
    clearFilter.addEventListener('click', this.filterClick, false);
    filter0.addEventListener('click', this.filterClick, false);
    filter1.addEventListener('click', this.filterClick, false);
    filter2.addEventListener('click', this.filterClick, false);
    filter3.addEventListener('click', this.filterClick, false);
    filter4.addEventListener('click', this.filterClick, false);
    filter5.addEventListener('click', this.filterClick, false);
    window.addEventListener('resize', this.onWindowResize, false);
    window.addEventListener('pointermove', this.onPointerMove);
  },
  beforeDestroy () {
    document.removeEventListener('mouseup', this.onPointerUp, false);
    document.removeEventListener('mousedown', this.onPointerDown, false);
    document.removeEventListener('mousedown', this.route,false);

    window.removeEventListener('resize', this.onWindowResize, false);
    window.removeEventListener('mousedown', this.onPointerMove);
    this.loadFilter = null;
    //this.raycaster = null;
    //this.renderer = null;
    this.$store.commit('stopRoadmap', true);
    this.$store.commit('setRoadmapInnerRoute', false);

    while(this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
  },
  watch: {
    '$store.state.stopRoadmap': function () {
      if (this.$store.state.stopRoadmap == false) {
        this.animate();
      }
    },
    '$store.state.scrollOffset': function () {
      this.roadmapMesh.position.x = 600 - this.$store.state.scrollOffset
    }
  }
}
</script>
<style>
  #roadmap-container{
    position: relative;
    z-index: 1;
  }
  .roadmap-scroll{
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    overflow: auto;
  }
  .roadmap-scroll__inner{
    position: relative;
    display: flex;
    /*background: white;*/
    width: 100%;
    height: 140vw;
    z-index: 1000000000;
    pointer-events: none;
  }
  .clearFilter span{
    height: 1px;
    width: 100%;
    background: #fff;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    pointer-events: none;
  }
  .clearFilter:hover span{
    background: rgba(255, 113, 82, 1);
  }
  .clearFilter span:nth-child(1) {
    transform: rotate(
      0deg
    ) translateY(7px) translateX(0px);
  }
  .clearFilter span:nth-child(2) {
    transform: rotate(
      0deg
    ) translateY(-7px) translateX(0px);
  }
  .clearFilter.active span:nth-child(1){
    transform: rotate(45deg) translateY(5px) translateX(5px);
  }
  .clearFilter.active span:nth-child(2){
    transform: rotate(-45deg) translateY(-5px) translateX(5px)
  }
  .clearFilter{
    position: absolute;
    right: 10px;
    width: 15px;
    height: 15px;
    z-index: 30;
    top: 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    opacity: 0;
    pointer-events: none;
  }
  .clearFilter.active{
    opacity: 1;
    pointer-events: all;
  }
  .roadmap__about{
    position: absolute;
    bottom: 30px;
    right: 80px;
    z-index: 11;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
  }
  .roadmap__about:after{
    content: '';
    height: 1px;
    width: 100%;
    bottom: 0px;
    background: #fff;
    left: 0px;
    position: absolute;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
  }
  .roadmap__about:hover{
    color: rgba(255, 113, 82, 1);
  }
  .roadmap__about:hover::after{
    transform: scaleX(0);
  }
  .filter-item {
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    cursor: pointer;
    position: relative;
    z-index: 10;
    padding: 3px 0px;
  }
  .filter-item:not(#list-itemf0){
    transform: translateY(10px);
    opacity: 0;
  }
  .main-roadmap.filterActive .filter-item{
    transform: translateY(0px)!important;
    opacity: 1!important;
    transition-delay: .6s;
  }
  #list-itemf0{
    display: flex!important;
  }
  #filters-container {
    width: 150px;
    z-index: 300;
    position: absolute;
    top: 45px;
    right: 120px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 5px 10px;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    opacity: 0;
  }
  #filters-container.active{
    opacity: 1;
  }
  #filters-container:after{
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 0;
    background-color: #1B1D33;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    transform: scaleY(0);
    transform-origin: top;
    transition-delay: .6s;
  }
  .main-roadmap.filterActive #filters-container:after{
    transform: scaleY(1);
    transition-delay: 0s;
  }
  #list-itemf1:hover{
    color: #FF7152;
  }
  #list-itemf2:hover{
    color: #F59337;
  }
  #list-itemf3:hover{
    color: #E10FEC;
  }
  #list-itemf4:hover{
    color: #5910C5;
  }
  #list-itemf5:hover{
    color: #3F057E;
  }
  #filterToogle{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-height: 34px;
    overflow: hidden;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    transition-delay: .6s;
  }
  .main-roadmap.filterActive #filterToogle{
    max-height: 500px;
    transition-delay: 0s;
  }
  #year-2021,
  #year-2022,
  #year-2023,
  #year-2024 {
    cursor: pointer;
    z-index: 250;
    position: absolute;
  }
  #filters-container.activeNav{
    opacity: 0!important;
    pointer-events: none;
  }
  .buble-tooltip{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .buble-tooltip div{
    transition: .2s cubic-bezier(.79,.01,.15,.99)!important;
    opacity: 0;
    transition-delay: .2s;
    transform: translateY(10px);
  }
  .buble-tooltip.active div{
    opacity: 1;
    transition-delay: .5s;
    transform: translateY(0px);
  }
  .buble-tooltip span {
    font-size: 13px;
    line-height: 18px;
    transition: .2s cubic-bezier(.79,.01,.15,.99)!important;
    opacity: 0;
    transform: translateY(10px);
    transition-delay: .1s;
  }
  .buble-tooltip.active span{
    opacity: 1;
    transition-delay: .6s;
    transform: translateY(0px);
  }
  .roadmap__container{
    position: relative;
    height: 100vh;
    width: 100%;
  }
  .year-select{
    cursor: pointer!important;
    z-index: 1000000!important;
  }
  .roadmap__socials{
    position: absolute;
    bottom: 30px;
    left: 80px;
    z-index: 11;
    display: flex;
    align-items: center;
  }
  .roadmap__socials a{
    margin-right: 15px;
    display: flex;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
  }
  .roadmap__socials a:hover{
    opacity: .5;
  }
  /*Ipad 768*/
  @media (max-width: 1023px){
    #filters-container{
      right: 85px;
    }
  }
  /*Mobile*/
  @media (max-width: 767px){
    .filter-item{
      height: 35px!important;
      font-size: 14px;
    }
    #filters-container{
      right: auto;
      left: 15px;
      top: 100px;
    }
    .main-roadmap{
      position: fixed;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      z-index: 2;
    }
  }
</style>
