<template>
  <div class="main-roadmap">
    <div id="roadmap-container" v-touch:swipe="swipeHandler" v-touch:longtap="swipeHandler"></div>
    <div id="filters-container" class="filters" :class="$store.state.navigation ? 'activeNav' : ''">
      <div class="clearFilter" id="clear-filter" @click="closeFilters" :class="closeFilter ? 'active' : ''">
        <span></span>
        <span></span>
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
const TWEEN = require('@tweenjs/tween.js');
import {
  roadmap_vertex,
  part_vertex,
  glow_vertex
} from '../assets/shaders/vertex.js';
import {
  roadmap_fragment,
  part_fragment,
  glow_fragment
} from '../assets/shaders/fragment.js';

export default {
  name: 'Roadmap',
  components: {
  },
  data () {
    return {
      scene: null,
      camera: null,
      roadmapGeo: null,
      roadmapMat: null,
      roadmapMesh: null,
      roadmapHover: false,
      raycaster: new THREE.Raycaster(),
      filterLine: false,
      filterLineIndex: false,
      mouse: new THREE.Vector2(),
      renderer: null,
      mouseX: 0,
      mouseY: 0,
      windowHalfX: window.innerWidth / 2,
      windowHalfY: window.innerHeight / 2,
      positions: null,
      uniforms: null,
      isPointerDown: false,
      direction: "",
      directionX: "",
      oldX: 0,
      oldY: 0,
      count: 0,
      partMat: null,
      partGeo: null,
      particles: null,
      roadmapVertex: roadmap_vertex,
      roadmapFragment: roadmap_fragment,
      partVertex: part_vertex,
      partFragment: part_fragment,
      labelRenderer: new CSS2DRenderer(),
      meshPartMat: null,
      meshPartGeo: null,
      yearMesh: null,
      meshParticles: null,
      meshBubles: 16,
      colors: [
        new THREE.Color(0xFF7152),
        new THREE.Color(0xF59337),
        new THREE.Color(0xE10FEC),
        new THREE.Color(0x5910C5),
        new THREE.Color(0x3F057E)
      ],
      yD: [0, 40, -10, 25, 5, -40, -10, -20, 30, 0, 10, 20, 50, 5, -10, -10, 0, 40, -30],
      xD: [-700, -600, -500, -400, -300, -250, -200, -100, -50, 0, 50, 100, 200, 250, 300, 400, 500, 600, 700],
      itemSize: 0,
      itemAlpha: 0,
      lineGeometry0: null,
      lineGeometry1: null,
      lineGeometry2: null,
      lineGeometry3: null,
      lineGeometry4: null,
      glowM0: null,
      glowM1: null,
      glowM2: null,
      glowM3: null,
      glowM4: null,
      ringMesh: null,
      ringMesh1: null,
      ringMesh2: null,
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
      filterScenes: [],
      filterScene: null,
      filterCamera: null,
      filterGeo: null,
      filterMat: null,
      filterMesh: null,
      help: null,
      closeFilter: false
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

      if(window.innerWidth < 1023) {
        this.camera.position.z = 350;
      } else {
        this.camera.position.z = 150;
      }

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
      this.createRoadmapPaths();
      this.createFilter();

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setClearColor(0x878FFF, 0.2);

      if (this.$store.state.roadmapInnerRoute) {
        this.moveRoadmapFromSlider();
      } else {
        this.moveRoadmapToStart();
      }

      if(this.$store.state.stopRoadmap !== true) {
        this.loadFilter();
      }

      container.appendChild(this.renderer.domElement);
    },
    createRoadmapBody: function() {
      this.roadmapGeo = new THREE.PlaneBufferGeometry(1000*1.5, 80*1.5, 600, 80);

      const loader = new THREE.TextureLoader();
      const texture = loader.load(require("../assets/wave_color.png"));

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

      this.roadmapMesh = new THREE.Points(this.roadmapGeo, this.roadmapMat);
      this.roadmapMesh.receiveShadow = true;
      this.roadmapMesh.rotateX(90);
      this.scene.add(this.roadmapMesh);
    },
    createRoadmapTimePoints: function () {
      var meshBubles = 19;

      for (let i = 0; i < meshBubles; ++i) {
        let tooltipPosition = -30;
        const tooltipLineMat = new THREE.LineBasicMaterial({
          color: 0xffffff
        });

        const linePoints = [];
        linePoints.push(new THREE.Vector3(0, 0, 0));

        linePoints.push(new THREE.Vector3(0, 0, 200));

        var lineGeom = new THREE.BufferGeometry().setFromPoints(linePoints);
        // lineGeom.position.y = -50;
        var tooltipLineMesh = new THREE.Line(lineGeom, new THREE.ShaderMaterial({
          uniforms: {
            color: {
              value: new THREE.Color(0xffffff)
            },
            origin: {
              value: new THREE.Vector3()
            }
          },
          vertexShader: `
            varying vec3 vPos;
            void main()
            {
              vPos = position;
              vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
              gl_Position = projectionMatrix * modelViewPosition;
            }
          `,
          fragmentShader: `
              uniform vec3 origin;
              uniform vec3 color;
              varying vec3 vPos;
              float limitDistance = 20.0;
              void main() {
                float distance = clamp(length(vPos - origin), 0., limitDistance);
                float opacity = 1. - distance / limitDistance;
                gl_FragColor = vec4(color, opacity);
              }
          `,
          transparent: true
        }));
        // tooltipLineMesh.position.z = -15;
        tooltipLineMesh.position.z = -20;
        // console.log(tooltipLineMesh)

        const toolDiv = document.createElement('div');
        const toolTitle = document.createElement('div');
        toolDiv.id = 'buble-tooltip' + i;
        toolDiv.className = 'buble-tooltip';
        toolDiv.appendChild(toolTitle)
        toolTitle.textContent = this.bubleData[i].title;
        if(this.bubleData[i].category){
          const toolSubTitle = document.createElement('span');
          toolSubTitle.textContent = this.bubleData[i].category;
          toolDiv.appendChild(toolSubTitle);
        }

        const bubleTooltip = new CSS2DObject(toolDiv);

        let toolCircleGeo = new THREE.SphereBufferGeometry(0.8, 32, 32);
        let toolCircleMat = new THREE.MeshBasicMaterial({
          color: 0xffffff
        });
        let toolCircleMesh = new THREE.Mesh(toolCircleGeo, toolCircleMat);
        toolCircleMesh.position.z = -0;

        if (i == 0 || i == 1 || i == 6 || i == 11 || i == 16) {
          tooltipPosition = -25;

          this.meshPartGeo = new THREE.SphereBufferGeometry(4, 20, 20);
          this.meshPartMat = new THREE.MeshBasicMaterial({
            wireframe: false,
            transparent: true,
            opacity: 0
          });

          this.meshParticles = new THREE.Mesh(this.meshPartGeo, this.meshPartMat);

          tooltipLineMesh.add(bubleTooltip);
          tooltipLineMesh.add(toolCircleMesh);
          this.meshParticles.rotation.x = -0.4;
          this.meshParticles.add(tooltipLineMesh);

          let ring1Geo = new THREE.RingGeometry(12.8, 12.2, 32);
          let ring2Geo = new THREE.RingGeometry(7.4, 6.8, 32);
          let ring3Geo = new THREE.RingGeometry(3.1, 2.5, 32);
          let coreGeo = new THREE.RingGeometry(0.8, 0, 32);
          let ringMat0 = new THREE.MeshBasicMaterial({
            color: 0x878FFF,
            wireframe: false,
            transparent: true,
            depthTest: false,
            opacity: 0.2
          });
          let ringMat1 = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            depthTest: false,
            opacity: 0.5
          });
          let ringMat2 = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            depthTest: false,
            opacity: 0.8
          });
          let ringMat3 = new THREE.MeshBasicMaterial({
            color: 0xffffff,
          });
          let ringMesh1 = new THREE.Mesh(ring1Geo, ringMat0);
          let ringMesh2 = new THREE.Mesh(ring2Geo, ringMat1);
          let ringMesh3 = new THREE.Mesh(ring3Geo, ringMat2);
          let coreMesh = new THREE.Mesh(coreGeo, ringMat3);

          ringMesh1.rotation.x = 1.3;
          ringMesh2.rotation.x = 1.3;
          ringMesh3.rotation.x = 1.3;
          coreMesh.rotation.x = 1.3;

          this.meshParticles.add(ringMesh1);
          this.meshParticles.add(ringMesh2);
          this.meshParticles.add(ringMesh3);
          this.meshParticles.add(coreMesh);
        } else {
          this.meshPartGeo = new THREE.SphereBufferGeometry(6, 32, 32);
          this.meshPartMat = new THREE.MeshBasicMaterial({
            color: 0x878FFF,
            transparent: true,
            opacity: 0.2
          });
          let bColor = this.colors[0];

          if (i === 2 || i === 3 || i === 4 || i === 5) {
            bColor = this.colors[1];
          }

          if (i === 7 || i === 8 || i === 9 || i === 10) {
            bColor = this.colors[2];
          }

          if (i === 12 || i === 13 || i === 14 || i === 15) {
            bColor = this.colors[3];
          }

          if (i === 17 || i === 18) {
            bColor = this.colors[4];
          }

          let bGeo = new THREE.SphereBufferGeometry(4, 32, 32);
          let bMat = new THREE.MeshLambertMaterial({
            color: bColor
          });
          let bMesh = new THREE.Mesh(bGeo, bMat);
          this.meshParticles = new THREE.Mesh(this.meshPartGeo, this.meshPartMat);
          this.meshParticles.add(bubleTooltip);
          this.meshParticles.add(bMesh);
        }

        bubleTooltip.position.set(0, 0, tooltipPosition);
        this.meshPartGeo.computeBoundsTree();
        this.meshParticles.position.setY(this.yD[i]);
        this.meshParticles.position.setX(this.xD[i]);
        this.roadmapMesh.add(this.meshParticles);
      }
    },
    createFilter: function () {
      const fContainer = document.getElementById('filters-container');

      for (let i = 0; i < 6; i++) {
        this.filterScene = new THREE.Scene();
        const fEl = document.createElement('span');
        fEl.id = 'list-itemf' + i;
        fEl.className = 'filter-item';
        fEl.style.setProperty('width', '200px');
        fEl.style.setProperty('height', '60px');

        let label = "Filter";
        if (i === 1) {
          label = "Inception";
        } else if (i === 2) {
          label = "Year 2021";
        } else if (i === 3) {
          label = "Year 2022";
        } else if (i === 4) {
          label = "Year 2023";
        } else if (i === 5) {
          label = "Year 2024";
        }

        fEl.innerHTML = label;

        this.filterScene.userData.element = fEl;
        fContainer.appendChild(fEl);
        if(window.innerWidht >=768){
          this.filterGeo = new THREE.SphereBufferGeometry(1.25, 8, 4);
        }else{
          this.filterGeo = new THREE.SphereBufferGeometry(0.8, 8, 4);
        }

        this.filterCamera = new THREE.PerspectiveCamera(50, 1, 1, 10);
        this.filterCamera.position.z = 4;
        this.filterScene.userData.camera = this.filterCamera;
        this.filterMat = new THREE.MeshBasicMaterial({
          color: i === 0 ? 0x878FFF : this.colors[i - 1],
          transparent: true,
          opacity: 0.5,
          wireframe: true
        });
        this.filterMesh = new THREE.Mesh(this.filterGeo, this.filterMat);
        this.filterMesh.rotation.z = Math.PI / 2;
        this.filterMesh.rotation.y = Math.PI / 2;
        this.filterMesh.scale.set(0, 0, 0);
        this.filterScene.add(this.filterMesh);
        this.filterScene.add(new THREE.HemisphereLight(0xFFFFFF, 0x444444));
        this.filterScene.name = "filter" + i;
        const flight = new THREE.DirectionalLight(0xffffff, 0.5);
        flight.position.set(1, 1, 1);
        this.filterScene.add(flight);
        this.filterScenes.push(this.filterScene);
      }
    },
    createRoadmapPaths: function () {
      const lineMaterial = new THREE.LineBasicMaterial({
        transparent: true,
        opacity: 0,
        color: this.colors[0]
      });

      const lineMaterial1 = new THREE.LineBasicMaterial({
        transparent: true,
        opacity: 0,
        color: this.colors[1]
      });

      const lineMaterial2 = new THREE.LineBasicMaterial({
        transparent: true,
        opacity: 0,
        color: this.colors[2]
      });

      const lineMaterial3 = new THREE.LineBasicMaterial({
        transparent: true,
        opacity: 0,
        color: this.colors[3]
      });

      const lineMaterial4 = new THREE.LineBasicMaterial({
        transparent: true,
        opacity: 0,
        color: this.colors[4]
      });

      const spline0 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2000, 0, 0),
        new THREE.Vector3(this.xD[0], this.yD[0], 0),
        new THREE.Vector3(this.xD[1], this.yD[1], 0),
        new THREE.Vector3(this.xD[2], this.yD[2], 0),
        new THREE.Vector3(this.xD[3], this.yD[3], 0),
        new THREE.Vector3(this.xD[4], this.yD[4], 0),
        new THREE.Vector3(this.xD[5], this.yD[5], 0),
        new THREE.Vector3(this.xD[6], this.yD[6], 0),
        new THREE.Vector3(this.xD[7], this.yD[7], 0),
        new THREE.Vector3(this.xD[8], this.yD[8], 0),
        new THREE.Vector3(this.xD[9], this.yD[9], 0),
        new THREE.Vector3(this.xD[10], this.yD[10], 0),
        new THREE.Vector3(this.xD[11], this.yD[11], 0),
        new THREE.Vector3(this.xD[12], this.yD[12], 0),
        new THREE.Vector3(this.xD[13], this.yD[13], 0),
        new THREE.Vector3(this.xD[14], this.yD[14], 0),
        new THREE.Vector3(this.xD[15], this.yD[15], 0),
        new THREE.Vector3(this.xD[16], this.yD[16], 0),
        new THREE.Vector3(this.xD[17], this.yD[17], 0),
        new THREE.Vector3(this.xD[18], this.yD[18], 0),
        new THREE.Vector3(2000, 0, 0),
      ]);

      var splinePoints0 = spline0.getPoints(4000);

      const glowG0 = new THREE.TubeGeometry(spline0, 4000, 1.3, 8, false);
      this.glowM0 = new THREE.MeshBasicMaterial({
        color: this.colors[0],
        opacity: 0,
        transparent: true,
        depthTest: false
      });
      const glowMesh0 = new THREE.Mesh(glowG0, this.glowM0);

      const spline1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2000, 0, 0),
        new THREE.Vector3(this.xD[0], this.yD[0], 0),
        new THREE.Vector3(this.xD[1], this.yD[1], 0),
        new THREE.Vector3(this.xD[2], this.yD[2], 0),
        new THREE.Vector3(this.xD[3], this.yD[3], 0),
        new THREE.Vector3(this.xD[4], this.yD[4], 0),
        new THREE.Vector3(this.xD[5], this.yD[5], 0),
        new THREE.Vector3(2000, 0, 0),
      ]);

      var splinePoints1 = spline1.getPoints(4000);

      const glowG1 = new THREE.TubeGeometry(spline1, 4000, 1.3, 8, false);
      this.glowM1 = new THREE.MeshBasicMaterial({
        color: this.colors[1],
        opacity: 0,
        transparent: true,
        depthTest: false
      });
      const glowMesh1 = new THREE.Mesh(glowG1, this.glowM1);

      const spline2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2000, 0, 0),
        new THREE.Vector3(this.xD[6], this.yD[6], 0),
        new THREE.Vector3(this.xD[7], this.yD[7], 0),
        new THREE.Vector3(this.xD[8], this.yD[8], 0),
        new THREE.Vector3(this.xD[9], this.yD[9], 0),
        new THREE.Vector3(this.xD[10], this.yD[10], 0),
        new THREE.Vector3(2000, 0, 0),
      ]);

      var splinePoints2 = spline2.getPoints(4000);

      const glowG2 = new THREE.TubeGeometry(spline2, 4000, 1.3, 8, false);
      this.glowM2 = new THREE.MeshBasicMaterial({
        color: this.colors[2],
        opacity: 0,
        transparent: true,
        depthTest: false
      });
      const glowMesh2 = new THREE.Mesh(glowG2, this.glowM2);

      const spline3 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2000, 0, 0),
        new THREE.Vector3(this.xD[11], this.yD[11], 0),
        new THREE.Vector3(this.xD[12], this.yD[12], 0),
        new THREE.Vector3(this.xD[13], this.yD[13], 0),
        new THREE.Vector3(this.xD[14], this.yD[14], 0),
        new THREE.Vector3(this.xD[15], this.yD[15], 0),
        new THREE.Vector3(2000, 0, 0),
      ]);

      var splinePoints3 = spline3.getPoints(4000);

      const glowG3 = new THREE.TubeGeometry(spline3, 4000, 1.3, 8, false);
      this.glowM3 = new THREE.MeshBasicMaterial({
        color: this.colors[3],
        opacity: 0,
        transparent: true,
        depthTest: false
      });
      const glowMesh3 = new THREE.Mesh(glowG3, this.glowM3);

      const spline4 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2000, 0, 0),
        new THREE.Vector3(this.xD[16], this.yD[16], 0),
        new THREE.Vector3(this.xD[17], this.yD[17], 0),
        new THREE.Vector3(this.xD[18], this.yD[18], 0),
        new THREE.Vector3(2000, 0, 0),
      ]);

      var splinePoints4 = spline4.getPoints(4000);

      const glowG4 = new THREE.TubeGeometry(spline4, 4000, 1.3, 8, false);
      this.glowM4 = new THREE.MeshBasicMaterial({
        color: this.colors[4],
        opacity: 0,
        transparent: true,
        depthTest: false
      });
      const glowMesh4 = new THREE.Mesh(glowG4, this.glowM4);

      this.lineGeometry0 = new THREE.BufferGeometry().setFromPoints(splinePoints0);
      const lineMesh0 = new THREE.Line(this.lineGeometry0, lineMaterial);
      lineMesh0.add(glowMesh0);
      this.roadmapMesh.add(lineMesh0);

      this.lineGeometry1 = new THREE.BufferGeometry().setFromPoints(splinePoints1);
      const lineMesh1 = new THREE.Line(this.lineGeometry1, lineMaterial1);
      lineMesh1.add(glowMesh1);
      this.roadmapMesh.add(lineMesh1);

      this.lineGeometry2 = new THREE.BufferGeometry().setFromPoints(splinePoints2);
      const lineMesh2 = new THREE.Line(this.lineGeometry2, lineMaterial2);
      lineMesh2.add(glowMesh2);
      this.roadmapMesh.add(lineMesh2);

      this.lineGeometry3 = new THREE.BufferGeometry().setFromPoints(splinePoints3);
      const lineMesh3 = new THREE.Line(this.lineGeometry3, lineMaterial3);
      lineMesh3.add(glowMesh3);
      this.roadmapMesh.add(lineMesh3);

      this.lineGeometry4 = new THREE.BufferGeometry().setFromPoints(splinePoints4);
      const lineMesh4 = new THREE.Line(this.lineGeometry4, lineMaterial4);
      lineMesh4.add(glowMesh4);
      this.roadmapMesh.add(lineMesh4);
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
    },
    loadFilter: function () {
      setTimeout(() => {
        if(this.$store.state.stopRoadmap !== true) {
          let filter = this.filterScenes[0].children[0];
          new TWEEN.Tween(filter.scale)
            .to({
              x: 1,
              y: 1,
              z: 1
            }, 3000)
            .easing(TWEEN.Easing.Quintic.Out)
            .onComplete(function () {
              document.getElementById('list-itemf0').style['opacity'] = 1;
            })
            .start();
        }
      }, 10000);
    },
    updateUiData: function (event) {
      if (event.target.id === 'list-itemf0') {
        this.filterVisible = !this.filterVisible;
      } else {
        this.filterVisible = false;
      }

      let el = document.getElementById('list-itemf0');
      if (event.target.id === 'clear-filter') {
        el.innerHTML = 'Filter';
        el.style['color'] = '#FFFFFF';
        this.filterScenes[0].children[0].material.color = new THREE.Color(0x878FFF);
      } else if (event.target.id === 'list-itemf1') {
        el.innerHTML = 'Inception';
        el.style['color'] = '#FF7152';
        this.filterScenes[0].children[0].material.color = this.colors[0];
      } else if (event.target.id === 'list-itemf2') {
        el.innerHTML = 'Year 2021';
        el.style['color'] = '#F59337';
        this.filterScenes[0].children[0].material.color = this.colors[1];
      } else if (event.target.id === 'list-itemf3') {
        el.innerHTML = 'Year 2022';
        el.style['color'] = '#E10FEC';
        this.filterScenes[0].children[0].material.color = this.colors[2];
      } else if (event.target.id === 'list-itemf4') {
        el.innerHTML = 'Year 2023';
        el.style['color'] = '#5910C5';
        this.filterScenes[0].children[0].material.color = this.colors[3];
      } else if (event.target.id === 'list-itemf5') {
        el.innerHTML = 'Year 2024';
        el.style['color'] = '#3F057E';
        this.filterScenes[0].children[0].material.color = this.colors[4];
      }

      this.toggleFilter(this.filterVisible);

      if (!this.isPointerDown) {
        let distance = 0;

        if (this.directionX === 'left') {
          distance = this.roadmapMesh.position.x - 40;
        }

        if (this.directionX === 'right') {
          distance = this.roadmapMesh.position.x + 40;
        }
        new TWEEN.Tween(this.roadmapMesh.position)
        .to({ x: distance }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }
    },
    toggleFilter: function (status) {
      let value = 0;
      let el1, el2, el3, el4, el5, class1, class2, class3, class4, class5;

      if (status) {
        value = 1;
        class1 = 'list-itemf1';
        class2 = 'list-itemf2';
        class3 = 'list-itemf3';
        class4 = 'list-itemf4';
        class5 = 'list-itemf5';

        document.getElementById(class1).style['display'] = 'flex';
        document.getElementById(class2).style['display'] = 'flex';
        document.getElementById(class3).style['display'] = 'flex';
        document.getElementById(class4).style['display'] = 'flex';
        document.getElementById(class5).style['display'] = 'flex';

        el1 = this.filterScenes[1].children[0].scale;
        el2 = this.filterScenes[2].children[0].scale;
        el3 = this.filterScenes[3].children[0].scale;
        el4 = this.filterScenes[4].children[0].scale;
        el5 = this.filterScenes[5].children[0].scale;
      } else {
        value = 0;
        class1 = 'list-itemf5';
        class2 = 'list-itemf4';
        class3 = 'list-itemf3';
        class4 = 'list-itemf2';
        class5 = 'list-itemf1';

        document.getElementById(class1).style['display'] = 'none';
        document.getElementById(class2).style['display'] = 'none';
        document.getElementById(class3).style['display'] = 'none';
        document.getElementById(class4).style['display'] = 'none';
        document.getElementById(class5).style['display'] = 'none';

        el1 = this.filterScenes[5].children[0].scale;
        el2 = this.filterScenes[4].children[0].scale;
        el3 = this.filterScenes[3].children[0].scale;
        el4 = this.filterScenes[2].children[0].scale;
        el5 = this.filterScenes[1].children[0].scale;
      }

      if (this.filterScenes[0].children[0].scale.x === 1) {
        new TWEEN.Tween(el1)
        .to({ x: value, y: value, z: value }, 200)
        .easing(TWEEN.Easing.Quintic.In)
        .onComplete(function() {
          document.getElementById(class1).style['opacity'] = value;
        })
        .start();

        setTimeout(() => {
          new TWEEN.Tween(el2)
          .to({ x: value, y: value, z: value }, 200)
          .easing(TWEEN.Easing.Quintic.In)
          .onComplete(function() {
            document.getElementById(class2).style['opacity'] = value;
          })
          .start();
        }, 200);

        setTimeout(() => {
          new TWEEN.Tween(el3)
          .to({ x: value, y: value, z: value }, 200)
          .easing(TWEEN.Easing.Quintic.In)
          .onComplete(function() {
            document.getElementById(class3).style['opacity'] = value;
          })
          .start();
        }, 400);

        setTimeout(() => {
          new TWEEN.Tween(el4)
          .to({ x: value, y: value, z: value }, 200)
          .easing(TWEEN.Easing.Quintic.In)
          .onComplete(function() {
            document.getElementById(class4).style['opacity'] = value;
          })
          .start();
        }, 600);

        setTimeout(() => {
          new TWEEN.Tween(el5)
          .to({ x: value, y: value, z: value }, 200)
          .easing(TWEEN.Easing.Quintic.In)
          .onComplete(function() {
            document.getElementById(class5).style['opacity'] = value;
          })
          .start();
        }, 600);
      }
    },
    moveRoadmapFromSlider: function () {
      this.roadmapMesh.position.set(0, 0, 0);
      this.roadmapMesh.rotation.x = 2.8;
      this.camera.position.set(0, -300, 250);
      this.particles.position.z = -5000;

      new TWEEN.Tween(this.camera.position)
      .to({ y: 0, z: 150 }, 5000)
      .easing(TWEEN.Easing.Quintic.Out)
      .start();

      new TWEEN.Tween(this.roadmapMesh.rotation)
      .to({ x: 2 }, 3000)
      .easing(TWEEN.Easing.Quintic.Out)
      .start();

      new TWEEN.Tween(this.particles.position)
      .to({ z: 0 }, 3000)
      .easing(TWEEN.Easing.Quintic.Out)
      .start();
    },
    moveRoadmapToStart: function () {
      this.camera.rotateY(1);
      this.roadmapMesh.position.set(0, 0, 0);

      setTimeout(() => {
        new TWEEN.Tween(this.roadmapMesh.position)
        .to({ x: 600, y: 0, z: 0 }, 4000)
        .easing(TWEEN.Easing.Quintic.Out)
        .start();

        new TWEEN.Tween(this.camera.rotation)
        .to({ y: 0 }, 4000)
        .easing(TWEEN.Easing.Quintic.Out)
        .start();
      }, 1000);
    },
    showRoadmapPath: function (index, action) {
      let object = this.roadmapMesh.children[19];
      if (index === 0 && action === 'show' && this.roadmapMesh.children[19].material.opacity == 0 ) {
        object = this.roadmapMesh.children[19];
        object.material.uniformsNeedUpdate = true;

        new TWEEN.Tween(object.children[0].material)
        .to({ opacity: action === 'show' ? 0.25 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        new TWEEN.Tween(object.material)
        .to({ opacity: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }

      if ((index === 1 || index === 2 || index === 3 || index === 4 || index === 5) && action === 'show' && this.roadmapMesh.children[20].material.opacity == 0) {
        object = this.roadmapMesh.children[20];
        object.material.uniformsNeedUpdate = true;

        new TWEEN.Tween(object.children[0].material)
        .to({ opacity: action === 'show' ? 0.25 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        new TWEEN.Tween(object.material)
        .to({ opacity: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }

      if ((index === 6 || index === 7 || index === 8 || index === 9 || index === 10) && action === 'show'  && this.roadmapMesh.children[21].material.opacity == 0) {
        object = this.roadmapMesh.children[21];
        object.material.uniformsNeedUpdate = true;

        new TWEEN.Tween(object.children[0].material)
        .to({ opacity: action === 'show' ? 0.25 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        new TWEEN.Tween(object.material)
        .to({ opacity: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }

      if ((index === 11 || index === 12 || index === 13 || index === 14 || index === 15) && action === 'show' && this.roadmapMesh.children[22].material.opacity == 0) {
        object = this.roadmapMesh.children[22];
        object.material.uniformsNeedUpdate = true;

        new TWEEN.Tween(object.children[0].material)
        .to({ opacity: action === 'show' ? 0.25 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        new TWEEN.Tween(object.material)
        .to({ opacity: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }

      if ((index === 16 || index === 17 || index === 18) && action === 'show' && this.roadmapMesh.children[23].material.opacity == 0) {
        object = this.roadmapMesh.children[23];
        object.material.uniformsNeedUpdate = true;

        new TWEEN.Tween(object.children[0].material)
        .to({ opacity: action === 'show' ? 0.25 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        new TWEEN.Tween(object.material)
        .to({ opacity: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }

      if (action === 'hide' && (this.roadmapMesh.children[19].material.opacity == 1 ||
        this.roadmapMesh.children[20].material.opacity == 1 ||
        this.roadmapMesh.children[21].material.opacity == 1 ||
        this.roadmapMesh.children[22].material.opacity == 1 ||
        this.roadmapMesh.children[23].material.opacity == 1
      )) {
        if( this.filterLineIndex !== 0) {
          new TWEEN.Tween(this.roadmapMesh.children[19].material)
          .to({ opacity: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();

          new TWEEN.Tween(this.roadmapMesh.children[19].children[0].material)
          .to({ opacity: action === 'show' ? 0.25 : 0 }, action === 'show' ? 500 : 200)
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();
        }
        if( this.filterLineIndex !== 1) {
          new TWEEN.Tween(this.roadmapMesh.children[20].material)
            .to({ opacity: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

          new TWEEN.Tween(this.roadmapMesh.children[20].children[0].material)
            .to({ opacity: action === 'show' ? 0.25 : 0 }, action === 'show' ? 500 : 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
        }
        if( this.filterLineIndex !== 6) {
          new TWEEN.Tween(this.roadmapMesh.children[21].material)
            .to({ opacity: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

          new TWEEN.Tween(this.roadmapMesh.children[21].children[0].material)
            .to({ opacity: action === 'show' ? 0.25 : 0 }, action === 'show' ? 500 : 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
        }
        if( this.filterLineIndex !== 11) {
          new TWEEN.Tween(this.roadmapMesh.children[22].material)
            .to({ opacity: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

          new TWEEN.Tween(this.roadmapMesh.children[22].children[0].material)
            .to({ opacity: action === 'show' ? 0.25 : 0 }, action === 'show' ? 500 : 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
        }
        if( this.filterLineIndex !== 18) {
          new TWEEN.Tween(this.roadmapMesh.children[23].material)
            .to({ opacity: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

          new TWEEN.Tween(this.roadmapMesh.children[23].children[0].material)
            .to({ opacity: action === 'show' ? 0.25 : 0 }, action === 'show' ? 500 : 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
        }
      }
    },
    animate: function () {
      const theTime = performance.now() * 0.001;
      const bubleTime = theTime / 4;

      this.roadmapMesh.children[19].children[0].scale.setZ(Math.sin(theTime * 2));
      this.roadmapMesh.children[20].children[0].scale.setZ(Math.sin(theTime * 2));
      this.roadmapMesh.children[21].children[0].scale.setZ(Math.sin(theTime * 2));
      this.roadmapMesh.children[22].children[0].scale.setZ(Math.sin(theTime * 2));
      this.roadmapMesh.children[23].children[0].scale.setZ(Math.sin(theTime * 2));
      this.roadmapMat.uniforms.time.value = theTime / 10;

      for (let i = 0; i < 19; i++) {
        if (i === 0 || i === 1 || i === 6 || i === 11 || i === 16) {
        } else {
          this.roadmapMesh.children[i].rotation.z = bubleTime;
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
      if (this.$store.state.stopRoadmap == false) {
        //this.renderer.autoClear = false;
        // this.renderer.clear();
        this.renderer.setScissorTest(true);
        this.renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
        this.renderer.render(this.scene, this.camera);
        this.labelRenderer.render(this.scene, this.camera);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.raycaster.firstHitOnly = true;

        const fParent = document.getElementById('filters-container');

        for (let i = 0; i < this.filterScenes.length; i++) {
          const fCont = document.getElementById('list-itemf' + i);
          const rect = fCont.getBoundingClientRect() !== null ? fCont.getBoundingClientRect() : false;

          if (rect !== false) {
            const theTime = performance.now() * 0.001;
            this.filterScenes[i].rotation.y = Math.sin(theTime) / 4;
            this.filterScenes[i].rotation.x = Math.sin(theTime) / 2;
            this.filterScenes[i].rotation.z = Math.sin(theTime) / 2;

            if (rect.bottom < 0 || rect.top > this.renderer.domElement.clientHeight ||
              rect.right < 0 || rect.left > this.renderer.domElement.clientWidth) {
              return; // it's off screen
            }
            const width = rect.right - rect.left;
            const height = rect.bottom - rect.top;
            const left = rect.left;
            const bottom = this.renderer.domElement.clientHeight - rect.bottom;
            this.renderer.clearDepth();

            if (this.filterScenes.length > 0) {
              this.renderer.setViewport(left , bottom, width / 4, height);
              this.renderer.setScissor(left, bottom, width / 4, height);
              this.renderer.render(this.filterScenes[i], this.filterScenes[i].userData.camera);
            }
          }
        }

        this.renderer.setPixelRatio(window.devicePixelRatio);
      }
    },
    route: function (id) {
      for (let i = 0; i < 16; i++) {
        let int = this.raycaster.intersectObjects([this.scene.children[3].children[i]]);
        if (int.length > 0) {
          var iMesh = int[0].object;
          var tooltipClass = iMesh.children[0].children[0];

          new TWEEN.Tween(this.camera.position)
          .to({ y: -300, z: 250 }, 5000)
          .easing(TWEEN.Easing.Quintic.Out)
          .start();

          new TWEEN.Tween(this.roadmapMesh.rotation)
          .to({ x: 2.8 }, 3000)
          .easing(TWEEN.Easing.Quintic.Out)
          .start();

          new TWEEN.Tween(this.particles.position)
          .to({ z: -5000 }, 3000)
          .easing(TWEEN.Easing.Quintic.Out)
          .start();

          if(i !== 0){
            setTimeout(() => {
              this.$router.push({ name: 'roadmapInner', params: { id: i }});
            }, 1500);
          }else{
            setTimeout(() => {
              this.$router.push({ name: 'roadmapInner', params: { id: 1 }});
            }, 1500);
          }
        }
      }
    },
    deleteLines: function () {
      for(let i = 0; i < 6; i++){
        this.showRoadmapPath(i,'hide');
      }
    },
    closeFilters() {
      this.closeFilter = false;
      this.filterLine = false;
      this.deleteLines();
      this.filterLineIndex = null;
    },
    filterClick: function (e) {
      if(e.target.id == 'list-itemf1'){
        this.closeFilter = true;
        this.filterLine = true;
        this.deleteLines();
        this.showRoadmapPath(0,'show');
        this.filterLineIndex = 0;
      }
      if(e.target.id == 'list-itemf2'){
        this.closeFilter = true;
        this.filterLine = true;
        this.deleteLines();
        this.showRoadmapPath(1,'show');
        this.filterLineIndex = 1;
      }
      if(e.target.id == 'list-itemf3'){
        this.closeFilter = true;
        this.filterLine = true;
        this.deleteLines();
        this.showRoadmapPath(6,'show');
        this.filterLineIndex = 6;
      }
      if(e.target.id == 'list-itemf4'){
        this.closeFilter = true;
        this.filterLine = true;
        this.deleteLines();
        this.showRoadmapPath(11,'show');
        this.filterLineIndex = 11;
      }
      if(e.target.id == 'list-itemf5'){
        this.closeFilter = true;
        this.filterLine = true;
        this.deleteLines();
        this.showRoadmapPath(16,'show');
        this.filterLineIndex = 16;
      }
    },
    timePointHover: function (e) {
      console.log(e.target)
    },
    wheelScroll: function(event) {
      if (this.camera.position.z < 250) {
        if (event.deltaY < 0 && this.roadmapMesh.position.x > -700) {
          new TWEEN.Tween(this.camera.rotation)
          .to({ y: 0.2 }, 400)
          .easing(TWEEN.Easing.Linear.None)
          .start();

          new TWEEN.Tween(this.roadmapMesh.position)
          .to({ x: this.roadmapMesh.position.x + 70 }, 3000)
          .easing(TWEEN.Easing.Quintic.Out)
          .start();

          setTimeout(() => {
            new TWEEN.Tween(this.camera.rotation)
            .to({ y: 0 }, 1500)
            .easing(TWEEN.Easing.Linear.None)
            .start();
          }, 400);
        }
        if (event.deltaY > 0 && this.roadmapMesh.position.x < 700) {
          new TWEEN.Tween(this.camera.rotation)
          .to({ y: -0.2 }, 400)
          .easing(TWEEN.Easing.Linear.None)
          .start();

          new TWEEN.Tween(this.roadmapMesh.position)
          .to({ x: this.roadmapMesh.position.x - 70 }, 3000)
          .easing(TWEEN.Easing.Quintic.Out)
          .start();

          setTimeout(() => {
            new TWEEN.Tween(this.camera.rotation)
            .to({ y: 0 }, 1500)
            .easing(TWEEN.Easing.Linear.None)
            .start();
          }, 400);
        }

        if (this.roadmapMesh.position.x > 600) {
          new TWEEN.Tween(this.roadmapMesh.position)
          .to({ x: 600 }, 1000)
          .easing(TWEEN.Easing.Quintic.Out)
          .start();
        }
        if (this.roadmapMesh.position.x < -600) {
          new TWEEN.Tween(this.roadmapMesh.position)
          .to({ x: -600 }, 1000)
          .easing(TWEEN.Easing.Quintic.Out)
          .start();
        }
      } else {
        new TWEEN.Tween(this.camera.position)
        .to({ y: 0, z: 150 }, 5000)
        .easing(TWEEN.Easing.Quintic.Out)
        .start();

        new TWEEN.Tween(this.roadmapMesh.rotation)
        .to({ x: 2 }, 5000)
        .easing(TWEEN.Easing.Quintic.Out)
        .start();
      }
    },
    onWindowResize: function () {
      this.windowHalfX = window.innerWidth / 2;
      this.windowHalfY = window.innerHeight / 2;

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

      /*new TWEEN.Tween(this.roadmapMesh.rotation)
      .to({ x: 2 }, 3000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();*/
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

      if (this.roadmapMesh.position.x > 600 && !this.isPointerDown) {
        new TWEEN.Tween(this.roadmapMesh.position)
        .to({ x: 600 }, 500)
        .easing(TWEEN.Easing.Quintic.Out)
        .start();
      }

      if (this.roadmapMesh.position.x < -600 && !this.isPointerDown) {
        new TWEEN.Tween(this.roadmapMesh.position)
        .to({ x: -600 }, 500)
        .easing(TWEEN.Easing.Quintic.Out)
        .start();
      }

      if (this.isPointerDown) {
        if (this.directionX === "left") {
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
        } else if (this.directionX === "right") {
          this.roadmapMesh.position.x = this.roadmapMesh.position.x + 7;

          new TWEEN.Tween(this.camera.rotation)
          .to({ y: 0.6 }, 400)
          .easing(TWEEN.Easing.Linear.None)
          .start();

          setTimeout(() => {
            new TWEEN.Tween(this.camera.rotation)
            .to({ y: 0 }, 1500)
            .easing(TWEEN.Easing.Linear.None)
            .start();
          }, 400);
        }

        if (this.direction === "up") {
          new TWEEN.Tween(this.roadmapMesh.rotation)
          .to({ x: 1.8 }, 300)
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();
        }

        if (this.direction === "down") {
          new TWEEN.Tween(this.roadmapMesh.rotation)
          .to({ x: 2.3 }, 300)
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();
        }
      }

      for (let i = 0; i < 19; i++) {
        let int = this.raycaster.intersectObjects([this.scene.children[3].children[i]]);
        if (int.length > 0 && this.filterLineIndex !== i) {
          var iMesh = int[0].object;
          let color = new THREE.Color(0x878FFF);
          if (i === 0) {
            color = this.colors[0];
            iMesh.material.color = color;
          }

          if (i === 1 || i === 2 || i === 3 || i === 4 || i === 5) {
            color = this.colors[1];
            this.scene.children[3].children[1].material.color = color;
            this.scene.children[3].children[2].material.color = color;
            this.scene.children[3].children[3].material.color = color;
            this.scene.children[3].children[4].material.color = color;
            this.scene.children[3].children[5].material.color = color;
          }

          if (i === 6 || i === 7 || i === 8 || i === 9 || i === 10) {
            color = this.colors[2];
            this.scene.children[3].children[6].material.color = color;
            this.scene.children[3].children[7].material.color = color;
            this.scene.children[3].children[8].material.color = color;
            this.scene.children[3].children[9].material.color = color;
            this.scene.children[3].children[10].material.color = color;
          }

          if (i === 11 || i === 12 || i === 13 || i === 14 || i === 15) {
            color = this.colors[3];
            this.scene.children[3].children[11].material.color = color;
            this.scene.children[3].children[12].material.color = color;
            this.scene.children[3].children[13].material.color = color;
            this.scene.children[3].children[14].material.color = color;
            this.scene.children[3].children[15].material.color = color;
          }

          if (i === 16 || i === 17 || i === 18) {
            color = this.colors[4];
            this.scene.children[3].children[16].material.color = color;
            this.scene.children[3].children[17].material.color = color;
            this.scene.children[3].children[18].material.color = color;
          }

          var tooltipClass = "";

          if (i === 0 || i === 1 || i === 6 || i === 11 || i === 16) {
            tooltipClass = iMesh.children[0].children[0].element.id;

            let hoverCol = new THREE.Color('#8785FF');
            if(iMesh.children[1].scale.x !== 1.2) {
              new TWEEN.Tween(iMesh.children[1].scale)
                .to({
                  x: 1.2,
                  y: 1.2,
                  z: 1.2
                }, 300)
                .easing(TWEEN.Easing.Quartic.InOut)
                .start()
              new TWEEN.Tween(iMesh.children[1].material.color)
                .to({
                  r: hoverCol.r,
                  g: hoverCol.g,
                  b: hoverCol.b,
                }, 300)
                .easing(TWEEN.Easing.Quartic.InOut)
                .start()
            }
            if(iMesh.children[2].scale.x !== 1.2) {
              new TWEEN.Tween(iMesh.children[2].scale)
                .to({
                  x: 1.2,
                  y: 1.2,
                  z: 1.2
                }, 400)
                .easing(TWEEN.Easing.Quartic.InOut)
                .start()
              new TWEEN.Tween(iMesh.children[2].material.color)
                .to({
                  r: hoverCol.r,
                  g: hoverCol.g,
                  b: hoverCol.b,
                }, 400)
                .easing(TWEEN.Easing.Quartic.InOut)
                .start()
            }
            if(iMesh.children[3].scale.x !== 1.2) {
              new TWEEN.Tween(iMesh.children[3].scale)
                .to({
                  x: 1.2,
                  y: 1.2,
                  z: 1.2
                }, 500)
                .easing(TWEEN.Easing.Quartic.InOut)
                .start()
              new TWEEN.Tween(iMesh.children[3].material.color)
                .to({
                  r: hoverCol.r,
                  g: hoverCol.g,
                  b: hoverCol.b,
                }, 500)
                .easing(TWEEN.Easing.Quartic.InOut)
                .start()
            }
          } else {
            tooltipClass = iMesh.children[0].element.id;
            if(int[0].object.scale.x !== 1.2){
              new TWEEN.Tween(int[0].object.scale)
                .to({ x: 1.2, y: 1.2, z: 1.2 }, 300)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start()
            }
          }

          //var tooltip = document.getElementById(tooltipClass);
          //tooltip.classList.add('active');

          this.showRoadmapPath(i, 'show');
        } else {
          if(this.filterLineIndex === i){
            this.showRoadmapPath(i, 'show');
          } else {
            this.scene.children[3].children[i].material.color = new THREE.Color(0x878FFF);
            var tooltipClass = "";

            if (i === 0 || i === 1 || i === 6 || i === 11 || i === 16) {
              tooltipClass = this.scene.children[3].children[i].children[0].children[0].element.id;
              let hoverCol = new THREE.Color('#FFFFFF');
              if(this.scene.children[3].children[i].children[3].scale.x !== 1) {
                new TWEEN.Tween(this.scene.children[3].children[i].children[3].scale)
                  .to({
                    x: 1,
                    y: 1,
                    z: 1
                  }, 300)
                  .easing(TWEEN.Easing.Quartic.InOut)
                  .start()
                new TWEEN.Tween(this.scene.children[3].children[i].children[3].material.color)
                  .to({
                    r: hoverCol.r,
                    g: hoverCol.g,
                    b: hoverCol.b,
                  }, 300)
                  .easing(TWEEN.Easing.Quartic.InOut)
                  .start()
              }
              if(this.scene.children[3].children[i].children[2].scale.x !== 1) {
                new TWEEN.Tween(this.scene.children[3].children[i].children[2].scale)
                  .to({
                    x: 1,
                    y: 1,
                    z: 1
                  }, 400)
                  .easing(TWEEN.Easing.Quartic.InOut)
                  .start()
                new TWEEN.Tween(this.scene.children[3].children[i].children[2].material.color)
                  .to({
                    r: hoverCol.r,
                    g: hoverCol.g,
                    b: hoverCol.b,
                  }, 400)
                  .easing(TWEEN.Easing.Quartic.InOut)
                  .start()
              }
              if(this.scene.children[3].children[i].children[1].scale.x !== 1) {
                new TWEEN.Tween(this.scene.children[3].children[i].children[1].scale)
                  .to({
                    x: 1,
                    y: 1,
                    z: 1
                  }, 500)
                  .easing(TWEEN.Easing.Quartic.InOut)
                  .start()
              }
            } else {
              tooltipClass = this.scene.children[3].children[i].children[0].element.id;
              if(this.scene.children[3].children[i].scale !== 1){
                new TWEEN.Tween(this.scene.children[3].children[i].scale)
                  .to({ x: 1, y: 1, z: 1 }, 100)
                  .easing(TWEEN.Easing.Quartic.InOut)
                  .start();
              }
            }

            var tooltip = document.getElementById(tooltipClass);
            tooltip.classList.remove('active');

            this.showRoadmapPath(i, 'hide');
          }
        }
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
          pointAlphas.array[i] = 0.1;
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
    this.helper();
    const promise = new Promise((resolve, reject) => {
      resolve (this.roadmapScene())
    });
    promise.then((value) => {
      this.animate()
    });
    this.$store.commit('stopRoadmap', false);
    document.addEventListener('wheel', this.wheelScroll, false);
    document.addEventListener('click', this.updateUiData);
    document.addEventListener('mouseup', this.onPointerUp, false);
    document.addEventListener('mousedown', this.onPointerDown, false);
    document.addEventListener('mousedown', this.route, false);
    document.addEventListener('mousedown', this.filterClick, false);
    window.addEventListener('resize', this.onWindowResize, false);
    window.addEventListener('pointermove', this.onPointerMove);
  },
  beforeDestroy () {
    document.removeEventListener('wheel', this.wheelScroll, false);
    document.removeEventListener('click', this.updateUiData);
    document.removeEventListener('mouseup', this.onPointerUp, false);
    document.removeEventListener('mousedown', this.onPointerDown, false);
    document.removeEventListener('mousedown', this.route,false);
    document.removeEventListener('mousedown', this.filterClick, false);
    window.removeEventListener('resize', this.onWindowResize, false);
    window.removeEventListener('mousedown', this.onPointerMove);
    this.raycaster = null;
    this.$store.commit('stopRoadmap', true);
    this.$store.commit('setRoadmapInnerRoute', false);
    this.scene.remove(this.scene.children[0]);
    this.renderer = null;
  },
  watch: {
    '$store.state.stopRoadmap': function () {
      if (this.$store.state.stopRoadmap == false) {
        this.animate();
      }else{
        this.renderer = null;
      }
    }
  }
}
</script>
<style>
  .test{
    position: relative;
    z-index: 1000000000;
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
    right: 0px;
    width: 15px;
    height: 15px;
    z-index: 30;
    top: 22px;
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
  .filter-item{
    display: flex;
    align-items: center;
    padding-left: 55px;
    transition: .15s cubic-bezier(.79,.01,.15,.99);
    cursor: pointer;
  }
  #filters-container {
    width: 125px;
    /* height: 400px; */
    z-index: 30;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 38px;
    right: 120px;
  }
  #list-itemf0 {
    opacity: 0;
  }
  #list-itemf1:hover{
    color: #FFB36D;
  }
  #list-itemf2:hover{
    color: #FF81E3;
  }
  #list-itemf3:hover{
    color: #5CFFC4;
  }
  #list-itemf4:hover{
    color: #F3F657;
  }
  #list-itemf5:hover{
    color: #FFFFFF;
  }
  #list-itemf1,
  #list-itemf2,
  #list-itemf3,
  #list-itemf4,
  #list-itemf5 {
    opacity: 0;
    display: none;
  }
  #year-2021,
  #year-2022,
  #year-2023,
  #year-2024 {
    cursor: pointer;
    z-index: 10000;
    position: absolute;
  }
  #filter-control{
    position: absolute;
    top: 46px;
    right: 125px;
    width: 105px;
    height: 40px;
    cursor: pointer;
    z-index: 10000;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
  }
  #filters-container{
    transition: .6s cubic-bezier(.79,.01,.15,.99);
  }
  #filters-container.activeNav{
    opacity: 0;
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
    #filters-container{
      right: auto;
      left: 50px;
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
