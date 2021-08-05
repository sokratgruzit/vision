<template>
  <div>
    <div id="roadmap-container"></div>
    <div id="filter-control"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { TessellateModifier } from 'three/examples/jsm/modifiers/TessellateModifier.js';
const TWEEN = require('@tweenjs/tween.js');
import {
  roadmap_vertex,
  part_vertex,
  text_vertex,
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
      ringMesh: null,
      ringMesh1: null,
      ringMesh2: null,
      filterVisible: true,
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

      class CustomSinCurve extends THREE.Curve {
        constructor( scale = 1 ) {
          super();
          this.scale = scale;
        }

        getPoint( t, optionalTarget = new THREE.Vector3() ) {
          console.log(t);
          const tx = t * 3 - 1.5;
          const ty = Math.sin( 2 * Math.PI * t );
          const tz = 0;

          return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
        }
      }

      const path = new CustomSinCurve( 100 );
      const geometry = new THREE.TubeGeometry( path, 20, 2, 8, false );
      const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      const mesh = new THREE.Mesh( geometry, material );

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
      
      this.lineGeometry0 = new THREE.BufferGeometry().setFromPoints(this.calcRoadmapPathPos('line0'));
      const lineMesh0 = new THREE.Line(this.lineGeometry0, lineMaterial);
      lineMesh0.add(mesh);
      this.roadmapMesh.add(lineMesh0);

      this.lineGeometry1 = new THREE.BufferGeometry().setFromPoints(this.calcRoadmapPathPos('line1'));
      const lineMesh1 = new THREE.Line(this.lineGeometry1, lineMaterial1);
      this.roadmapMesh.add(lineMesh1);

      this.lineGeometry2 = new THREE.BufferGeometry().setFromPoints(this.calcRoadmapPathPos('line2'));
      const lineMesh2 = new THREE.Line(this.lineGeometry2, lineMaterial2);
      this.roadmapMesh.add(lineMesh2);

      this.lineGeometry3 = new THREE.BufferGeometry().setFromPoints(this.calcRoadmapPathPos('line3'));
      const lineMesh3 = new THREE.Line(this.lineGeometry3, lineMaterial3);
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
      var scene = this.scene;
      var textLoader = new THREE.FontLoader();
      textLoader.load("./three_fonts/Kanit_Regular.json", function(
        font
      ) {
        let vectorColor = "vec3(1.0,0.0,0.0)";

        var filterGeo = new THREE.TextBufferGeometry("Filter +", {
          font: font,
          size: 5,
          height: 0,
          curveSegments: 20,
          bevelThickness: 2,
          bevelSize: 8,
          bevelSegments: 5
        });

        const tessellateModifier = new TessellateModifier(8, 6);
        filterGeo = tessellateModifier.modify(filterGeo);
        const numFaces = filterGeo.attributes.position.count / 3;
        const colors = new Float32Array( numFaces * 3 * 3 );
        const color = new THREE.Color();
        const displacement = new Float32Array(numFaces * 3 * 3);

        for (let f = 0; f < numFaces; f++) {
          const index = 9 * f;

          const h = 0.2 * Math.random();
          const s = 0.5 + 0.5 * Math.random();
          const l = 0.5 + 0.5 * Math.random();

          const d = 1000 * (0.5 - Math.random());

          for (let i = 0; i < 3; i++) {
            colors[ index + ( 3 * i ) ] = color.r;
            colors[ index + ( 3 * i ) + 1 ] = color.g;
            colors[ index + ( 3 * i ) + 2 ] = color.b;

            displacement[index + (3 * i)] = d;
            displacement[index + (3 * i) + 1] = d;
            displacement[index + (3 * i) + 2] = d;
          }
        }

        filterGeo.setAttribute('customColor', new THREE.BufferAttribute(colors, 3 ));
        filterGeo.setAttribute('displacement', new THREE.BufferAttribute(displacement, 3));

        var textUniforms = {
          amplitude: { value: 7 },
          percent: { type: "f", value: 0.0 }
        };

        const tShaderMat = new THREE.ShaderMaterial({
          uniforms: textUniforms,
          vertexShader: text_vertex,
          fragmentShader: `
            varying vec3 vNormal;
            varying vec3 vColor;
            uniform float percent;
            void main() {
              const float ambient = 0.4;
              vec3 light = vec3( 1.0 );
              light = normalize( light );
              float directional = max( dot( vNormal, light ), 0.0 );
              gl_FragColor = vec4( ( directional + ambient ) *` + vectorColor + `, 1.0 );
              gl_FragColor.a = 1.0 * percent;
            }
          `,
          transparent: true
        });

        var filterMesh = new THREE.Mesh(filterGeo, tShaderMat);
        filterMesh.position.x = 100;
        //filterMesh.position.z = 500;
        filterMesh.position.y = 90;

        const squareMat = new THREE.LineBasicMaterial({
          color: 0x0000ff,
          opacity: 0,
          transparent: true
        });

        const sPoints = [];
        sPoints.push( new THREE.Vector3(0, 0, 0));
        sPoints.push( new THREE.Vector3(0, 30, 0));
        sPoints.push( new THREE.Vector3(30, 30, 0));
        sPoints.push( new THREE.Vector3(30, 0, 0));
        sPoints.push( new THREE.Vector3(0, 0, 0));

        const squareGeo = new THREE.BufferGeometry().setFromPoints(sPoints);
        const squareMesh = new THREE.Line(squareGeo, squareMat);
        filterMesh.add(squareMesh);


        const filterItemDiv = document.createElement('div');
        filterItemDiv.id = 'year-2021';
        filterItemDiv.className = 'year-select';
        filterItemDiv.textContent = "Year 2021";
        filterItemDiv.style.marginTop = '-1em';
        filterItemDiv.style.opacity = '0';

        const filterItemDiv1 = document.createElement('div');
        filterItemDiv1.id = 'year-2022';
        filterItemDiv1.className = 'year-select';
        filterItemDiv1.textContent = "Year 2022";
        filterItemDiv1.style.marginTop = '-1em';
        filterItemDiv1.style.opacity = '0';

        const filterItemDiv2 = document.createElement('div');
        filterItemDiv2.id = 'year-2023';
        filterItemDiv2.className = 'year-select';
        filterItemDiv2.textContent = "Year 2023";
        filterItemDiv2.style.marginTop = '-1em';
        filterItemDiv2.style.opacity = '0';

        const filterItemObj = new CSS2DObject(filterItemDiv);
        filterItemObj.position.set(12, -12, 0);
        filterMesh.add(filterItemObj);

        const filterItemObj1 = new CSS2DObject(filterItemDiv1);
        filterItemObj1.position.set(12, -22, 0);
        filterMesh.add(filterItemObj1);

        const filterItemObj2 = new CSS2DObject(filterItemDiv2);
        filterItemObj2.position.set(12, -32, 0);
        filterMesh.add(filterItemObj2);

        scene.add(filterMesh);
      });

      this.scene = scene;
      this.loadFilter();
      //End Filter

      container.appendChild(this.renderer.domElement);
    },
    loadFilter: function () {
      setTimeout(() => {
        let filter = this.scene.children[5].material;

        new TWEEN.Tween(filter.uniforms.amplitude)
        .to({ value: 0 }, 3000)
        .easing(TWEEN.Easing.Quintic.Out)
        .start();

        new TWEEN.Tween(filter.uniforms.percent)
        .to({ value: 1 }, 3000)
        .easing(TWEEN.Easing.Quintic.Out)
        .start();
      }, 10000);
    },
    showFilter: function () {
      let int = this.scene.children[5] === undefined ? false : this.scene.children[5];
      let filter = int.children[0];
      let v = this.filterVisible;

      new TWEEN.Tween(filter.position)
      .to({
        x: v ? -1.5 : 0,
        y: v ? -32 : 50,
        z: 0
      }, 2000)
      .easing(TWEEN.Easing.Quintic.Out)
      .start();

      new TWEEN.Tween(filter.material)
      .to({ opacity: v ? 1 : 0 }, 500)
      .easing(TWEEN.Easing.Quintic.Out)
      .start();

      new TWEEN.Tween(filter.rotation)
      .to({
        x: v ? 6.29 : 0,
        y: v ? 6.29 : 0,
        z: v ? 6.29 : 0
      }, 2000)
      .easing(TWEEN.Easing.Quintic.Out)
      .start();


      setTimeout(() => {
        document.getElementById('year-2021').style['opacity'] = v ? '1' : '0';
        document.getElementById('year-2022').style['opacity'] = v ? '1' : '0';
        document.getElementById('year-2023').style['opacity'] = v ? '1' : '0';
      }, v ? 2000 : 0);

      this.filterVisible = !this.filterVisible;
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

        new TWEEN.Tween(object.material)
        .to({ opacity: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }

      if ((index === 1 || index === 2 || index === 3 || index === 4 || index === 5) && action === 'show') {
        object = this.roadmapMesh.children[17];
        object.material.uniformsNeedUpdate = true;

        new TWEEN.Tween(object.material)
        .to({ opacity: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }

      if ((index === 6 || index === 7 || index === 8 || index === 9 || index === 10) && action === 'show') {
        object = this.roadmapMesh.children[18];
        object.material.uniformsNeedUpdate = true;

        new TWEEN.Tween(object.material)
        .to({ opacity: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      }

      if ((index === 11 || index === 12 || index === 13 || index === 14 || index === 15) && action === 'show') {
        object = this.roadmapMesh.children[19];
        object.material.uniformsNeedUpdate = true;

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

        new TWEEN.Tween(this.roadmapMesh.children[17].material)
        .to({ opacity: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        new TWEEN.Tween(this.roadmapMesh.children[18].material)
        .to({ opacity: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        new TWEEN.Tween(this.roadmapMesh.children[19].material)
        .to({ opacity: action === 'show' ? 1 : 0 }, action === 'show' ? 500 : 200)
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
      const bubleTime = theTime / 4;
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
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.render(this.scene, this.camera);
      this.labelRenderer.render(this.scene, this.camera);

      this.raycaster.setFromCamera(this.mouse, this.camera);
      this.raycaster.firstHitOnly = true;
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
      if(e.target.id == 'year-2021'){
        this.filterLine = true;
        this.deleteLines();
        this.showRoadmapPath(1,'show');
      }
      if(e.target.id == 'year-2022'){
        this.filterLine = true;
        this.deleteLines();
        this.showRoadmapPath(6,'show');
      }
      if(e.target.id == 'year-2023'){
        this.filterLine = true;
        this.deleteLines();
        this.showRoadmapPath(11,'show');
      }
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
    document.getElementById('filter-control').addEventListener('click', this.showFilter);
    document.addEventListener('mouseup', this.onPointerUp, false);
    document.addEventListener('mousedown', this.onPointerDown, false);
    document.addEventListener('mousedown', this.route);
    document.addEventListener('mousedown', this.filterClick);
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
