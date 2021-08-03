<template>
  <div>
    <div id="roadmap-container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
const TWEEN = require('@tweenjs/tween.js');
import { 
  roadmap_vertex, 
  line_vertex,
  line_vertex1,
  line_vertex2, 
  part_vertex 
} from '../assets/shaders/vertex.js';
import { 
  roadmap_fragment, 
  line_fragment,
  line_fragment1,
  line_fragment2, 
  part_fragment 
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
      mouse: new THREE.Vector2(),
      renderer: null,
      raycaster: new THREE.Raycaster(),
      mouseX: 0,
      mouseY: 0,
      windowHalfX: window.innerWidth / 2,
      windowHalfY: window.innerHeight / 2,
      positions: null,
      uniforms: null,
      lineUniforms: null,
      lineUniforms1: null,
      lineUniforms2: null,
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
      lineVertex: line_vertex,
      lineFragment: line_fragment,
      lineVertex1: line_vertex1,
      lineFragment1: line_fragment1,
      lineVertex2: line_vertex2,
      lineFragment2: line_fragment2,
      lineVertex3: line_vertex2,
      lineFragment3: line_fragment2,
      partVertex: part_vertex,
      partFragment: part_fragment,
      labelRenderer: new CSS2DRenderer(),
      meshPartMat: null,
      meshPartGeo: null,
      meshParticles: null,
      meshBubles: 16,
      yD: [0, 40, -10, 25, 5, -40, -10, -20, 30, 0, 10, 20, 50, 5, -10, -10],
      xD: [-1400, -1200, -1100, -900, -750, -450, -250, -100, 100, 250, 450, 750, 950, 1100, 1200, 1400],
      itemSize: 0,
      itemAlpha: 0,
      lineGeometry0: null,
      lineGeometry1: null,
      lineGeometry2: null,
      lineGeometry3: null,
      controls: null,
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
      ]
    }
  },
  methods: {
    roadmapScene: function() {
      var container = document.getElementById('roadmap-container');
      this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
      this.labelRenderer.domElement.style.position = 'absolute';
      this.labelRenderer.domElement.style.bottom = '0px';
      document.body.appendChild(this.labelRenderer.domElement);
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
      var blia = [];

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
        linePoints.push(new THREE.Vector3(0, 0, 20));
        linePoints.push(new THREE.Vector3(0, 0, 0));

        const tooltipLineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        const tooltipLineMesh = new THREE.Line(tooltipLineGeo, tooltipLineMat, THREE.LineSegments);

        tooltipLineMesh.position.z = -30;
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
        toolDiv.style.marginTop = '-1em';

        const bubleTooltip = new CSS2DObject(toolDiv);
        bubleTooltip.position.set(0, 0, -5);

        tooltipLineMesh.add(bubleTooltip);

        this.meshParticles = new THREE.Mesh(this.meshPartGeo, this.meshPartMat);

        this.meshParticles.add(tooltipLineMesh);
        this.meshPartGeo.computeBoundsTree();
        this.meshParticles.position.setY(this.yD[i]);
        this.meshParticles.position.setX(this.xD[i]);
        this.roadmapMesh.add(this.meshParticles);
        blia.push(this.meshParticles);
      }
      //End Mesh particles

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setClearColor(0x878FFF, 0.2);
      this.moveRoadmapToStart();
      
      //Create Horizontal Lines
      const lineLoader = new THREE.TextureLoader();
      const lineTexture0 = lineLoader.load(require("../assets/fire.jpg"));
      const lineTexture1 = lineLoader.load(require("../assets/metal.jpg"));
      const lineTexture2 = lineLoader.load(require("../assets/water.jpg"));
      const lineTexture3 = lineLoader.load(require("../assets/space.jpg"));

      this.lineUniforms = {
        tex: { type: "t", value: lineTexture0 },
        opacity: { type: "c", value: 0.0 },
        time: { type: "f", value: 0.0 },
        resolution: { type: "v4", value: new THREE.Vector4() }
      };

      this.lineUniforms1 = {
        tex: { type: "t", value: lineTexture1 },
        opacity: { type: "c", value: 0.0 },
        time: { type: "f", value: 0.0 },
        resolution: { type: "v4", value: new THREE.Vector4() }
      };

      this.lineUniforms2 = {
        tex: { type: "t", value: lineTexture2 },
        opacity: { type: "c", value: 0.0 },
        time: { type: "f", value: 0.0 },
        resolution: { type: "v4", value: new THREE.Vector4() }
      };

      this.lineUniforms3 = {
        tex: { type: "t", value: lineTexture3 },
        opacity: { type: "c", value: 0.0 },
        time: { type: "f", value: 0.0 },
        resolution: { type: "v4", value: new THREE.Vector4() }
      };

      this.lineUniforms.resolution.value.x = window.innerWidth;
      this.lineUniforms.resolution.value.y = window.innerHeight;
      this.lineUniforms.resolution.value.z = asp1;
      this.lineUniforms.resolution.value.w = asp2;

      this.lineUniforms1.resolution.value.x = window.innerWidth;
      this.lineUniforms1.resolution.value.y = window.innerHeight;
      this.lineUniforms1.resolution.value.z = asp1;
      this.lineUniforms1.resolution.value.w = asp2;

      this.lineUniforms2.resolution.value.x = window.innerWidth;
      this.lineUniforms2.resolution.value.y = window.innerHeight;
      this.lineUniforms2.resolution.value.z = asp1;
      this.lineUniforms2.resolution.value.w = asp2;

      this.lineUniforms3.resolution.value.x = window.innerWidth;
      this.lineUniforms3.resolution.value.y = window.innerHeight;
      this.lineUniforms3.resolution.value.z = asp1;
      this.lineUniforms3.resolution.value.w = asp2;

      const lineMaterial = new THREE.ShaderMaterial({
        uniforms: this.lineUniforms,
        vertexShader: this.lineVertex,
        fragmentShader: this.lineFragment,
        transparent: true
      });

      const lineMaterial1 = new THREE.ShaderMaterial({
        uniforms: this.lineUniforms1,
        vertexShader: this.lineVertex1,
        fragmentShader: this.lineFragment1,
        transparent: true
      });

      const lineMaterial2 = new THREE.ShaderMaterial({
        uniforms: this.lineUniforms2,
        vertexShader: this.lineVertex2,
        fragmentShader: this.lineFragment2,
        transparent: true
      });

      const lineMaterial3 = new THREE.ShaderMaterial({
        uniforms: this.lineUniforms3,
        vertexShader: this.lineVertex3,
        fragmentShader: this.lineFragment3,
        transparent: true
      });

      this.lineGeometry0 = new THREE.BufferGeometry().setFromPoints(this.calcRoadmapPathPos('line0'));
      const lineMesh0 = new THREE.Points(this.lineGeometry0, lineMaterial);
      this.roadmapMesh.add(lineMesh0);

      this.lineGeometry1 = new THREE.BufferGeometry().setFromPoints(this.calcRoadmapPathPos('line1'));
      const lineMesh1 = new THREE.Points(this.lineGeometry1, lineMaterial1);
      this.roadmapMesh.add(lineMesh1);

      this.lineGeometry2 = new THREE.BufferGeometry().setFromPoints(this.calcRoadmapPathPos('line2'));
      const lineMesh2 = new THREE.Points(this.lineGeometry2, lineMaterial2);
      this.roadmapMesh.add(lineMesh2);

      this.lineGeometry3 = new THREE.BufferGeometry().setFromPoints(this.calcRoadmapPathPos('line3'));
      const lineMesh3 = new THREE.Points(this.lineGeometry3, lineMaterial3);
      this.roadmapMesh.add(lineMesh3);
      //End Create Horizontal Lines

      container.appendChild(this.renderer.domElement);
    },
    moveRoadmapToStart: function () {
      new TWEEN.Tween(this.roadmapMesh.position)
      .to({ x: 1100 }, 3000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();
    },
    showRoadmapPath: function (index, action) {
      let object = this.roadmapMesh.children[16];

      if (index === 0 && action === 'show') {
        object = this.roadmapMesh.children[16];
        object.material.uniformsNeedUpdate = true;

        new TWEEN.Tween(object.material.uniforms.opacity)
        .to({ value: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }
      
      if ((index === 1 || index === 2 || index === 3 || index === 4 || index === 5) && action === 'show') {
        object = this.roadmapMesh.children[17];
        object.material.uniformsNeedUpdate = true;

        new TWEEN.Tween(object.material.uniforms.opacity)
        .to({ value: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }

      if ((index === 6 || index === 7 || index === 8 || index === 9 || index === 10) && action === 'show') {
        object = this.roadmapMesh.children[18];
        object.material.uniformsNeedUpdate = true;

        new TWEEN.Tween(object.material.uniforms.opacity)
        .to({ value: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }

      if ((index === 11 || index === 12 || index === 13 || index === 14 || index === 15) && action === 'show') {
        object = this.roadmapMesh.children[19];
        object.material.uniformsNeedUpdate = true;

        new TWEEN.Tween(object.material.uniforms.opacity)
        .to({ value: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }
      
      if (action === 'hide') {
        new TWEEN.Tween(this.roadmapMesh.children[16].material.uniforms.opacity)
        .to({ value: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        new TWEEN.Tween(this.roadmapMesh.children[17].material.uniforms.opacity)
        .to({ value: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        new TWEEN.Tween(this.roadmapMesh.children[18].material.uniforms.opacity)
        .to({ value: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        new TWEEN.Tween(this.roadmapMesh.children[19].material.uniforms.opacity)
        .to({ value: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }
    },
    calcRoadmapPathPos: function (line) {
      const points = [];

      let delta1 = 0;
      let delta2 = 40;
      let delta3 = -10;
      let delta4 = 25;
      let delta5 = 5;
      let delta6 = -40;
      let delta7 = 0;
      let delta8 = -10;
      let delta9 = -20;
      let delta10 = 30;
      let delta11 = 0;
      let delta12 = 10;
      let delta13 = 0;
      let delta14 = 20;
      let delta15 = 50;
      let delta16 = 5;
      let delta17 = -10;

      for (let i = -2000; i < 4000; i++) {
        if (i < this.xD[0]) {
          points.push(new THREE.Vector3(i, 0, 0));
        }

        if (line === 'line0' || line === 'line1') {
          if (i === this.xD[0]) {
            points.push(new THREE.Vector3(this.xD[0], this.yD[0], 0));
          }
          if (i > this.xD[0] && i < this.xD[1]) {
            points.push(new THREE.Vector3(i, delta1, 0));
            delta1 += 0.2
          }
          if (i === this.xD[1]) {
            points.push(new THREE.Vector3(this.xD[1], this.yD[1], 0));
          }
          if (i > this.xD[1] && i < this.xD[2]) {
            points.push(new THREE.Vector3(i, delta2, 0));
            delta2 -= 0.5;
          }
          if (i === this.xD[2]) {
            points.push(new THREE.Vector3(this.xD[2], this.yD[2], 0));
          }
          if (i > this.xD[2] && i < this.xD[3]) {
            points.push(new THREE.Vector3(i, delta3, 0));
            delta3 += 0.175;
          }
          if (i === this.xD[3]) {
            points.push(new THREE.Vector3(this.xD[3], this.yD[3], 0));
          }
          if (i > this.xD[3] && i < this.xD[4]) {
            points.push(new THREE.Vector3(i, delta4, 0));
            delta4 -= 0.13;
          }
          if (i === this.xD[4]) {
            points.push(new THREE.Vector3(this.xD[4], this.yD[4], 0));
          }
          if (i > this.xD[4] && i < this.xD[5]) {
            points.push(new THREE.Vector3(i, delta5, 0));
            delta5 -= 0.15;
          }
          if (i === this.xD[5]) {
            points.push(new THREE.Vector3(this.xD[5], this.yD[5], 0));
          }
          if (i > this.xD[5] && i < 0) {
            points.push(new THREE.Vector3(i, delta6, 0));
            delta6 += 0.088888;
          }
          if (i > 0 || i === 0) {
            points.push(new THREE.Vector3(i, 0, 0));
          }
        }

        if (line === 'line2') {
          if (i > this.xD[0] && i < this.xD[6]) {
            points.push(new THREE.Vector3(i, delta7, 0));
            delta7 -= 0.008888;
          }
          if (i > this.xD[10]) {
            points.push(new THREE.Vector3(i, delta12, 0));
            delta12 -= 0.006;
          }
        }

        if (line === 'line0' || line === 'line2') {
          if (i === this.xD[6]) {
            points.push(new THREE.Vector3(this.xD[6], this.yD[6], 0));
          }
          if (i > this.xD[6] && i < this.xD[7]) {
            points.push(new THREE.Vector3(i, delta8, 0));
            delta8 -= 0.066;
          }
          if (i === this.xD[7]) {
            points.push(new THREE.Vector3(this.xD[7], this.yD[7], 0));
          }
          if (i > this.xD[7] && i < this.xD[8]) {
            points.push(new THREE.Vector3(i, delta9, 0));
            delta9 += 0.25;
          }
          if (i === this.xD[8]) {
            points.push(new THREE.Vector3(this.xD[8], this.yD[8], 0));
          }
          if (i > this.xD[8] && i < this.xD[9]) {
            points.push(new THREE.Vector3(i, delta10, 0));
            delta10 -= 0.2;
          }
          if (i === this.xD[9]) {
            points.push(new THREE.Vector3(this.xD[9], this.yD[9], 0));
          }
          if (i > this.xD[9] && i < this.xD[10]) {
            points.push(new THREE.Vector3(i, delta11, 0));
            delta11 += 0.05;
          }
          if (i === this.xD[10]) {
            points.push(new THREE.Vector3(this.xD[10], this.yD[10], 0));
          }
        }

        if (line === 'line3') {
          if (i > this.xD[0] && i < this.xD[11]) {
            points.push(new THREE.Vector3(i, delta13, 0));
            delta13 += 0.009;
          }
          if (i === this.xD[11]) {
            points.push(new THREE.Vector3(this.xD[11], this.yD[11], 0));
          }
          if (i > this.xD[11] && i < this.xD[12]) {
            points.push(new THREE.Vector3(i, delta14, 0));
            delta14 += 0.15;
          }
          if (i === this.xD[12]) {
            points.push(new THREE.Vector3(this.xD[12], this.yD[12], 0));
          }
          if (i > this.xD[12] && i < this.xD[13]) {
            points.push(new THREE.Vector3(i, delta15, 0));
            delta15 -= 0.3;
          }
          if (i === this.xD[13]) {
            points.push(new THREE.Vector3(this.xD[13], this.yD[13], 0));
          }
          if (i > this.xD[13] && i < this.xD[14]) {
            points.push(new THREE.Vector3(i, delta16, 0));
            delta16 -= 0.15;
          }
          if (i === this.xD[14]) {
            points.push(new THREE.Vector3(this.xD[14], this.yD[14], 0));
          }
          if (i > this.xD[14] && i < this.xD[15]) {
            points.push(new THREE.Vector3(i, this.yD[15], 0));
          }
          if (i === this.xD[15]) {
            points.push(new THREE.Vector3(this.xD[15], this.yD[15], 0));
          }
          if (i > this.xD[15]) {
            points.push(new THREE.Vector3(i, delta17, 0));
            delta17 += 0.16;
          }
        }
      }
      
      return points;
    },
    animate: function () {
      const theTime = performance.now() * 0.001;

      this.roadmapMat.uniforms.time.value = theTime / 10;
      this.lineUniforms.time.value = theTime;
      this.lineUniforms1.time.value = theTime;
      this.lineUniforms2.time.value = theTime;
      this.lineUniforms3.time.value = theTime;

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
      this.labelRenderer.render(this.scene, this.camera);
    },
    wheelScroll: function(event) {
      if (event.isPrimary === false) return;

      /*this.mouseX = event.clientX - this.windowHalfX;

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

      this.camera.position.x += (this.mouseX * 100 - this.camera.position.x) * 0.005;*/
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
      this.raycaster.setFromCamera(this.mouse, this.camera);
      this.raycaster.firstHitOnly = true;

      if (this.isPointerDown) {
        if (this.directionX === "left") {
          this.roadmapMesh.position.x -= event.clientX * 0.005;
          setTimeout(() => {
            if (!this.isPointerDown) {
              new TWEEN.Tween(this.roadmapMesh.position)
              .to({ x: this.roadmapMesh.position.x - 100 }, 300)
              .easing(TWEEN.Easing.Quadratic.Out)
              .start();
            }
          }, 1);
        } else if (this.directionX === "right") {
          this.roadmapMesh.position.x += event.clientX * 0.005;
          setTimeout(() => {
            if (!this.isPointerDown) {
              new TWEEN.Tween(this.roadmapMesh.position)
              .to({ x: this.roadmapMesh.position.x + 100 }, 300)
              .easing(TWEEN.Easing.Quadratic.Out)
              .start();
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
          var tooltipClass = iMesh.children[0].children[0].element.id;
          var tooltip = document.getElementById(tooltipClass);
          tooltip.classList.add('active');

          new TWEEN.Tween(iMesh.children[0].scale)
          .to({ x: 1, y: 1, z: 1 }, 300)
          .easing(TWEEN.Easing.Quadratic.In)
          .start();

          new TWEEN.Tween(int[0].object.scale)
          .to({ x: 1.2, y: 1.2, z: 1.2 }, 500)
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();

          this.showRoadmapPath(i, 'show');
        } else {
          var tooltipClass = this.scene.children[3].children[i].children[0].children[0].element.id;
          var tooltip = document.getElementById(tooltipClass);
          tooltip.classList.remove('active');
          
          new TWEEN.Tween(this.scene.children[3].children[i].children[0].scale)
          .to({ x: 0, y: 0, z: 0 }, 100)
          .easing(TWEEN.Easing.Quadratic.In)
          .start();

          new TWEEN.Tween(this.scene.children[3].children[i].scale)
          .to({ x: 1, y: 1, z: 1 }, 500)
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();

          this.showRoadmapPath(i, 'hide');
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
      }else{
        this.renderer = null;
      }
    }
  }
}
</script>
<style>
  .buble-tooltip{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .buble-tooltip div{
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    transform: translateY(10px);
    opacity: 0;
    transition-delay: .1s;
  }
  .buble-tooltip.active div{
    transform: translateY(0px);
    opacity: 1;
    transition-delay: 0s;
  }
  .buble-tooltip span{
    font-size: 13px;
    line-height: 18px;
    transition: .4s cubic-bezier(.79,.01,.15,.99);
    transform: translateY(10px);
    opacity: 0;
    transition-delay: 0s;
  }
  .buble-tooltip.active span{
    transform: translateY(0px);
    opacity: 1;
    transition-delay: .1s;
  }
  .roadmap__container{
    position: relative;
    height: 100vh;
    width: 100%;
  }
</style>
