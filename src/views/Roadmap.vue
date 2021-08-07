<template>
  <div>
    <div id="roadmap-container"></div>
    <div id="filters-container" class="filters"></div>
    <div id="filter-control"></div>
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
      filterLine: false,
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
      meshParticles: null,
      meshBubles: 16,
      colors: [
        new THREE.Color(0xFFB36D),
        new THREE.Color(0xFF81E3),
        new THREE.Color(0x5CFFC4),
        new THREE.Color(0xF3F657)
      ],
      yD: [0, 40, -10, 25, 5, -40, -10, -20, 30, 0, 10, 20, 50, 5, -10, -10],
      xD: [-1400, -1200, -1100, -900, -750, -450, -250, -100, 100, 250, 450, 750, 950, 1100, 1200, 1400],
      itemSize: 0,
      itemAlpha: 0,
      lineGeometry0: null,
      lineGeometry1: null,
      lineGeometry2: null,
      lineGeometry3: null,
      glowM0: null,
      glowM1: null,
      glowM2: null,
      glowM3: null,
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
        }
      ],
      filterScenes: [],
      filterScene: null,
      filterCamera: null,
      filterGeo: null,
      filterMat: null,
      filterMesh: null
    }
  },
  methods: {
    roadmapScene: function() {
      var container = document.getElementById('roadmap-container');
      this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
      this.labelRenderer.domElement.style.position = 'absolute';
      this.labelRenderer.domElement.style.bottom = '0px';
      this.labelRenderer.domElement.style.pointerEvents = 'none';
      container.appendChild(this.labelRenderer.domElement);
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1500);
      this.camera.position.z = 150;

      this.scene = new THREE.Scene();
      //this.scene.fog = new THREE.FogExp2(0x878FFF, 10, 1000);
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
      this.roadmapMesh.position.z = 500;
      this.roadmapMesh.position.y = -500;
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

      for (let i = 0; i < meshBubles; ++i) {
        let bSize = 5;
        let linePosition = -5;
        let tooltipPosition = -30;

        if (i == 0 || i == 1 || i == 6 || i == 11) {
          bSize = 6;
          linePosition = -12;
          tooltipPosition = -25;
        }

        this.meshPartGeo = new THREE.IcosahedronGeometry(bSize, 1);
        this.meshPartMat = new THREE.MeshBasicMaterial({
          color: 0x878FFF,
          wireframe: true
        });

        const tooltipLineMat = new THREE.LineBasicMaterial({
          color: 0x878FFF
        });

        const linePoints = [];
        linePoints.push(new THREE.Vector3(0, 0, -20));
        linePoints.push(new THREE.Vector3(0, 0, 0));

        const tooltipLineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        const tooltipLineMesh = new THREE.Line(tooltipLineGeo, tooltipLineMat, THREE.LineSegments);

        tooltipLineMesh.position.z = linePosition;
        tooltipLineMesh.scale.x = 0;
        tooltipLineMesh.scale.y = 0;
        tooltipLineMesh.scale.z = 0;

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
        bubleTooltip.position.set(0, 0, tooltipPosition);

        tooltipLineMesh.add(bubleTooltip);

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
      //End Create Horizontal Lines

      //Rings
      for (let i = 0; i < 16; i++) {
        if (i === 0 || i === 1 || i === 6 || i === 11) {
          const ringSat = new THREE.SphereBufferGeometry(0.8, 32, 32);
          const ringSatMesh = new THREE.Mesh(ringSat, this.meshPartMat);
          ringSatMesh.position.x = -15;

          const ringSat1 = new THREE.SphereBufferGeometry(0.8, 32, 32);
          const ringSatMesh1 = new THREE.Mesh(ringSat1, this.meshPartMat);
          ringSatMesh1.position.x = -16;

          const ringSat2 = new THREE.SphereBufferGeometry(0.8, 32, 32);
          const ringSatMesh2 = new THREE.Mesh(ringSat2, this.meshPartMat);
          ringSatMesh2.position.x = -17;

          const ring0 = new THREE.RingGeometry(15, 14.8, 32);
          const ring1 = new THREE.RingGeometry(16, 15.8, 32);
          const ring2 = new THREE.RingGeometry(17, 16.8, 32);

          this.ringMesh = new THREE.Mesh(ring0, this.meshPartMat);
          this.ringMesh1 = new THREE.Mesh(ring1, this.meshPartMat);
          this.ringMesh2 = new THREE.Mesh(ring2, this.meshPartMat);

          this.ringMesh.position.set(this.xD[i], this.yD[i], 0);
          this.ringMesh1.position.set(this.xD[i], this.yD[i], 0);
          this.ringMesh2.position.set(this.xD[i], this.yD[i], 0);

          this.ringMesh.add(ringSatMesh);
          this.ringMesh1.add(ringSatMesh1);
          this.ringMesh2.add(ringSatMesh2);

          this.roadmapMesh.add(this.ringMesh);
          this.roadmapMesh.add(this.ringMesh1);
          this.roadmapMesh.add(this.ringMesh2);
        }
      }
      //End Rings
      //Filter
      const fContainer = document.getElementById('filters-container');

      for (let i = 0; i < 5; i++) {
        this.filterScene = new THREE.Scene();
        const fEl = document.createElement('span');
        fEl.id = 'list-item' + i;
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
        }

        fEl.innerHTML = label;

        this.filterScene.userData.element = fEl;
        fContainer.appendChild(fEl);

        this.filterGeo = new THREE.SphereBufferGeometry(1.25, 8, 4);
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
        this.filterScene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444));
        this.filterScene.name = "filter" + i;
        const flight = new THREE.DirectionalLight(0xffffff, 0.5);
        flight.position.set(1, 1, 1);
        this.filterScene.add(flight);
        this.filterScenes.push(this.filterScene);
      }
      //End Filter
      console.log(this.filterScenes)
      this.loadFilter();
      container.appendChild(this.renderer.domElement);
    },
    loadFilter: function () {
      setTimeout(() => {
        let filter = this.filterScenes[0].children[0];

        new TWEEN.Tween(filter.scale)
        .to({ x: 1, y: 1, z: 1 }, 3000)
        .easing(TWEEN.Easing.Quintic.Out)
        .onComplete(function() {
          document.getElementById('list-item0').style['opacity'] = 1;
        })
        .start();
      }, 10000);
    },
    updateUiData: function (event) {
      if (event.target.id === 'list-item0') {
        this.filterVisible = !this.filterVisible;
      } else {
        this.filterVisible = false;
      }

      let el = document.getElementById('list-item0');

      if (event.target.id === 'list-item1') {
        el.innerHTML = 'Inception';
        el.style['color'] = '#FFB36D';
        this.filterScenes[0].children[0].material.color = this.colors[0];
      } else if (event.target.id === 'list-item2') {
        el.innerHTML = 'Year 2021';
        el.style['color'] = '#FF81E3';
        this.filterScenes[0].children[0].material.color = this.colors[1];
      } else if (event.target.id === 'list-item3') {
        el.innerHTML = 'Year 2022';
        el.style['color'] = '#5CFFC4';
        this.filterScenes[0].children[0].material.color = this.colors[2];
      } else if (event.target.id === 'list-item4') {
        el.innerHTML = 'Year 2023';
        el.style['color'] = '#F3F657';
        this.filterScenes[0].children[0].material.color = this.colors[3];
      }

      this.toggleFilter(this.filterVisible);
    },
    toggleFilter: function (status) {
      let value = 0;
      let el1, el2, el3, el4, class1, class2, class3, class4;

      if (status) {
        value = 1;
        el1 = this.filterScenes[1].children[0].scale;
        el2 = this.filterScenes[2].children[0].scale;
        el3 = this.filterScenes[3].children[0].scale;
        el4 = this.filterScenes[4].children[0].scale;
        class1 = 'list-item1'; 
        class2 = 'list-item2';
        class3 = 'list-item3'; 
        class4 = 'list-item4'; 
      } else {
        value = 0;
        el1 = this.filterScenes[4].children[0].scale;
        el2 = this.filterScenes[3].children[0].scale;
        el3 = this.filterScenes[2].children[0].scale;
        el4 = this.filterScenes[1].children[0].scale;
        class1 = 'list-item4'; 
        class2 = 'list-item3';
        class3 = 'list-item2'; 
        class4 = 'list-item1'; 
      }

      if (this.filterScenes[0].children[0].scale.x === 1) {
        new TWEEN.Tween(el1)
        .to({ x: value, y: value, z: value }, 100)
        .easing(TWEEN.Easing.Quintic.Out)
        .onComplete(function() {
          document.getElementById(class1).style['opacity'] = value;
        })
        .start();

        setTimeout(() => {
          new TWEEN.Tween(el2)
          .to({ x: value, y: value, z: value }, 100)
          .easing(TWEEN.Easing.Quintic.Out)
          .onComplete(function() {
            document.getElementById(class2).style['opacity'] = value;
          })
          .start();
        }, 100);

        setTimeout(() => {
          new TWEEN.Tween(el3)
          .to({ x: value, y: value, z: value }, 100)
          .easing(TWEEN.Easing.Quintic.Out)
          .onComplete(function() {
            document.getElementById(class3).style['opacity'] = value;
          })
          .start();
        }, 200);

        setTimeout(() => {
          new TWEEN.Tween(el4)
          .to({ x: value, y: value, z: value }, 100)
          .easing(TWEEN.Easing.Quintic.Out)
          .onComplete(function() {
            document.getElementById(class4).style['opacity'] = value;
          })
          .start();
        }, 300);
      }
    },
    moveRoadmapToStart: function () {
      this.camera.rotation.y = 1;
      var A = new TWEEN.Tween(this.roadmapMesh.position)
      .to({ y: 0, z: 0 }, 3000)
      .easing(TWEEN.Easing.Quintic.Out);

      var B = new TWEEN.Tween(this.roadmapMesh.position)
      .to({ x: 1100 }, 3000)
      .easing(TWEEN.Easing.Quintic.Out);

      setTimeout(() => {
        var cA = new TWEEN.Tween(this.camera.rotation)
        .to({ y: 1 }, 3000)
        .easing(TWEEN.Easing.Quintic.Out);

        var cB = new TWEEN.Tween(this.camera.rotation)
        .to({ y: 0 }, 3000)
        .easing(TWEEN.Easing.Quintic.Out);

        cA.chain(cB);
        cA.start();
      }, 1000);

      A.chain(B);
      A.start();

      new TWEEN.Tween(this.camera.rotation)
      .to({ y: 0 }, 3000)
      .easing(TWEEN.Easing.Quintic.Out)
      .start();
    },
    showRoadmapPath: function (index, action) {
      let object = this.roadmapMesh.children[16];
      if (index === 0 && action === 'show') {
        object = this.roadmapMesh.children[16];
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

      if ((index === 1 || index === 2 || index === 3 || index === 4 || index === 5) && action === 'show') {
        object = this.roadmapMesh.children[17];
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

      if ((index === 6 || index === 7 || index === 8 || index === 9 || index === 10) && action === 'show') {
        object = this.roadmapMesh.children[18];
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

      if ((index === 11 || index === 12 || index === 13 || index === 14 || index === 15) && action === 'show') {
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

      if (action === 'hide') {
        new TWEEN.Tween(this.roadmapMesh.children[16].material)
        .to({ opacity: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        new TWEEN.Tween(this.roadmapMesh.children[16].children[0].material)
        .to({ opacity: action === 'show' ? 0.25 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        new TWEEN.Tween(this.roadmapMesh.children[17].material)
        .to({ opacity: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        new TWEEN.Tween(this.roadmapMesh.children[17].children[0].material)
        .to({ opacity: action === 'show' ? 0.25 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        new TWEEN.Tween(this.roadmapMesh.children[18].material)
        .to({ opacity: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        new TWEEN.Tween(this.roadmapMesh.children[18].children[0].material)
        .to({ opacity: action === 'show' ? 0.25 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        new TWEEN.Tween(this.roadmapMesh.children[19].material)
        .to({ opacity: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        new TWEEN.Tween(this.roadmapMesh.children[19].children[0].material)
        .to({ opacity: action === 'show' ? 0.25 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }
    },
    animate: function () {
      const theTime = performance.now() * 0.001;
      const bubleTime = theTime / 4;
      this.roadmapMesh.children[16].children[0].scale.setZ(Math.sin(theTime * 2));
      this.roadmapMesh.children[17].children[0].scale.setZ(Math.sin(theTime * 2));
      this.roadmapMesh.children[18].children[0].scale.setZ(Math.sin(theTime * 2));
      this.roadmapMesh.children[19].children[0].scale.setZ(Math.sin(theTime * 2));
      this.roadmapMat.uniforms.time.value = theTime / 10;
      this.roadmapMesh.children[20].rotation.set(bubleTime, 0, theTime);
      this.roadmapMesh.children[21].rotation.set(0, bubleTime, theTime);
      this.roadmapMesh.children[22].rotation.set(-bubleTime, 0, -theTime);
      this.roadmapMesh.children[23].rotation.set(bubleTime, 0, theTime);
      this.roadmapMesh.children[24].rotation.set(0, bubleTime, theTime);
      this.roadmapMesh.children[25].rotation.set(-bubleTime, 0, -theTime);
      this.roadmapMesh.children[26].rotation.set(bubleTime, 0, theTime);
      this.roadmapMesh.children[27].rotation.set(0, bubleTime, theTime);
      this.roadmapMesh.children[28].rotation.set(-bubleTime, 0, -theTime);
      this.roadmapMesh.children[29].rotation.set(bubleTime, 0, theTime);
      this.roadmapMesh.children[30].rotation.set(0, bubleTime, theTime);
      this.roadmapMesh.children[31].rotation.set(-bubleTime, 0, -theTime);

      for (let i = 0; i < 15; i++) {
        this.roadmapMesh.children[i].rotation.z = bubleTime;
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
      this.renderer.autoClear = false;
      this.renderer.clear();
      this.renderer.setScissorTest(true);
      this.renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
      this.renderer.render(this.scene, this.camera);
      this.labelRenderer.render(this.scene, this.camera);
      this.raycaster.setFromCamera(this.mouse, this.camera);
      this.raycaster.firstHitOnly = true;

      const fParent = document.getElementById('filters-container');

      for (let i = 0; i < this.filterScenes.length; i++) {
        const fCont = document.getElementById('list-item' + i);
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
    },
    route: function (id) {
      for (let i = 0; i < 16; i++) {
        let int = this.raycaster.intersectObjects([this.scene.children[3].children[i]]);
        if (int.length > 0) {
          var iMesh = int[0].object;
          var tooltipClass = iMesh.children[0].children[0].element.id;
        }
      }
    },
    deleteLines: function () {
      for(let i = 0; i <  4; i++){
        this.showRoadmapPath(i,'hide');
      }
    },
    filterClick: function (e) {
      if(e.target.id == 'list-item1'){
        this.filterLine = true;
        this.deleteLines();
        this.showRoadmapPath(0,'show');
      }
      if(e.target.id == 'list-item2'){
        this.filterLine = true;
        this.deleteLines();
        this.showRoadmapPath(1,'show');
      }
      if(e.target.id == 'list-item3'){
        this.filterLine = true;
        this.deleteLines();
        this.showRoadmapPath(6,'show');
      }
      if(e.target.id == 'list-item4'){
        this.filterLine = true;
        this.deleteLines();
        this.showRoadmapPath(11,'show');
      }
    },
    wheelScroll: function(event) {
        if (event.deltaY < 0 && this.roadmapMesh.position.x > -1300) {
          this.roadmapMesh.position.x -= event.clientX * 0.008;
          var cA = new TWEEN.Tween(this.roadmapMesh.position)
            .to({ x: this.roadmapMesh.position.x - this.windowHalfX / 2 }, 1500)
            .easing(TWEEN.Easing.Quintic.Out)
            .start();

          var cB = new TWEEN.Tween(this.camera.rotation)
            .to({ y: 0.2 }, 1500)
            .easing(TWEEN.Easing.Quintic.Out);

          var cC = new TWEEN.Tween(this.camera.rotation)
            .to({ y: 0 }, 1000)
            .easing(TWEEN.Easing.Quintic.Out);

          cB.chain(cC);
          cA.chain(cB);
          cA.start();
        }
        if (event.deltaY > 0 && this.roadmapMesh.position.x < 1300) {
          this.roadmapMesh.position.x += event.clientX * 0.008;
          var cA = new TWEEN.Tween(this.roadmapMesh.position)
            .to({ x: this.roadmapMesh.position.x + this.windowHalfX / 2 }, 1500)
            .easing(TWEEN.Easing.Quintic.Out)
            .start();

          var cB = new TWEEN.Tween(this.camera.rotation)
            .to({ y: -0.2 }, 1500)
            .easing(TWEEN.Easing.Quintic.Out);

          var cC = new TWEEN.Tween(this.camera.rotation)
            .to({ y: 0 }, 1000)
            .easing(TWEEN.Easing.Quintic.Out);

          cB.chain(cC);
          cA.chain(cB);
          cA.start();
        }
      if (this.roadmapMesh.position.x > 1300) {
        setTimeout(() => {
          new TWEEN.Tween(this.roadmapMesh.position)
            .to({ x: 1200 }, 1000)
            .easing(TWEEN.Easing.Quintic.Out)
            .start();
        },1000)
      }

      if (this.roadmapMesh.position.x < -1300) {
        setTimeout(() => {
          new TWEEN.Tween(this.roadmapMesh.position)
            .to({ x: -1200 }, 1000)
            .easing(TWEEN.Easing.Quintic.Out)
            .start();
        }, 1000)
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

      if (this.roadmapMesh.position.x > 1400 && !this.isPointerDown) {
        new TWEEN.Tween(this.roadmapMesh.position)
        .to({ x: 1300 }, 500)
        .easing(TWEEN.Easing.Quintic.Out)
        .start();
      }

      if (this.roadmapMesh.position.x < -1400 && !this.isPointerDown) {
        new TWEEN.Tween(this.roadmapMesh.position)
        .to({ x: -1300 }, 500)
        .easing(TWEEN.Easing.Quintic.Out)
        .start();
      }

      if (this.isPointerDown) {
        if (this.directionX === "left") {
          this.roadmapMesh.position.x -= event.clientX * 0.005;
          setTimeout(() => {
            if (!this.isPointerDown) {
              new TWEEN.Tween(this.roadmapMesh.position)
              .to({ x: this.roadmapMesh.position.x - this.windowHalfX / 2 }, 1000)
              .easing(TWEEN.Easing.Quintic.Out)
              .start();

              var cA = new TWEEN.Tween(this.camera.rotation)
              .to({ y: 0.2 }, 1000)
              .easing(TWEEN.Easing.Quintic.Out);

              var cB = new TWEEN.Tween(this.camera.rotation)
              .to({ y: 0 }, 3000)
              .easing(TWEEN.Easing.Quintic.Out);

              cA.chain(cB);
              cA.start();
            }
          }, 1);
        } else if (this.directionX === "right") {
          this.roadmapMesh.position.x += event.clientX * 0.005;
          setTimeout(() => {
            if (!this.isPointerDown) {
              new TWEEN.Tween(this.roadmapMesh.position)
              .to({ x: this.roadmapMesh.position.x + this.windowHalfX / 2 }, 1000)
              .easing(TWEEN.Easing.Quintic.Out)
              .start();

              var cA = new TWEEN.Tween(this.camera.rotation)
              .to({ y: -0.2 }, 1000)
              .easing(TWEEN.Easing.Quintic.Out);

              var cB = new TWEEN.Tween(this.camera.rotation)
              .to({ y: 0 }, 3000)
              .easing(TWEEN.Easing.Quintic.Out);

              cA.chain(cB);
              cA.start();
            }
          }, 1);
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
      for (let i = 0; i < 16; i++) {
        let int = this.raycaster.intersectObjects([this.scene.children[3].children[i]]);
        if (int.length > 0) {
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

          var tooltipClass = iMesh.children[0].children[0].element.id;
          var tooltip = document.getElementById(tooltipClass);
          tooltip.classList.add('active');

          new TWEEN.Tween(int[0].object.scale)
          .to({ x: 1.2, y: 1.2, z: 1.2 }, 300)
          .easing(TWEEN.Easing.Quadratic.Out)
          .start()

          new TWEEN.Tween(iMesh.children[0].scale)
          .to({ x: 1, y: 1, z: 1 }, 300)
          .easing(TWEEN.Easing.Quadratic.In)
          .start()

          this.filterLine = false;
          this.deleteLines();
          this.showRoadmapPath(i, 'show');
        } else {
          this.scene.children[3].children[i].material.color = new THREE.Color(0x878FFF);
          var tooltipClass = this.scene.children[3].children[i].children[0].children[0].element.id;
          var tooltip = document.getElementById(tooltipClass);
          tooltip.classList.remove('active');

          new TWEEN.Tween(this.scene.children[3].children[i].scale)
            .to({ x: 1, y: 1, z: 1 }, 100)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

          new TWEEN.Tween(this.scene.children[3].children[i].children[0].scale)
            .to({ x: 0, y: 0, z: 0 }, 100)
            .easing(TWEEN.Easing.Quadratic.In)
            .start();
          if(!this.filterLine){
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
    document.addEventListener('click', this.updateUiData);
    document.addEventListener('mouseup', this.onPointerUp, false);
    document.addEventListener('mousedown', this.onPointerDown, false);
    document.addEventListener('mousedown', this.route);
    document.addEventListener('mousedown', this.filterClick);
    window.addEventListener('resize', this.onWindowResize, false);
    window.addEventListener('pointermove', this.onPointerMove);
  },
  beforeDestroy () {
    this.$store.commit('stopRoadmap', true)
    this.scene.remove(this.scene.children[0]);
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
  .filter-item{
    display: flex;
    align-items: center;
    padding-left: 55px;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    cursor: pointer;
  }
  #filters-container {
    width: 200px;
    height: 400px;
    z-index: 10000000;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 55px;
    right: 80px;
  }
  #list-item0 {
    opacity: 0;
  }
  #list-item1:hover{
    color: #FFB36D;
  }
  #list-item2:hover{
    color: #FF81E3;
  }
  #list-item3:hover{
    color: #5CFFC4;
  }
  #list-item4:hover{
    color: #F3F657;
  }
  /*new THREE.Color(0xFFB36D),*/
  /*new THREE.Color(0xFF81E3),*/
  /*new THREE.Color(0x5CFFC4),*/
  /*new THREE.Color(0xF3F657)*/
  #list-item1,
  #list-item2,
  #list-item3,
  #list-item4 {
    opacity: 0;
  }
  #year-2021,
  #year-2022,
  #year-2023{
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
  .buble-tooltip span{
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
</style>
