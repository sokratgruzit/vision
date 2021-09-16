<template>
  <div class="statistic-main">
    <div class="statistic__wrapper">
      <div id="statistic-container"></div>
    </div>
    <div class="statistic-text__container">
      <div class="statistic-text__block" v-for="statistic in statTexts" :class="activeStat == statistic.id ? 'active' : ''">
        <div class="statistic-text__block-inner">
          <h2 class="statistic-text__ttl">{{statistic.title}}</h2>
          <div class="statistic-text__text">
            {{statistic.text}}
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import * as THREE from 'three';
  import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
  import { TessellateModifier } from 'three/examples/jsm/modifiers/TessellateModifier.js';
  import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
  import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
  import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
  const TWEEN = require('@tweenjs/tween.js');
  import {
    fractal_vertex
  } from '../assets/shaders/vertex.js';
  import {
    fractal_fragment
  } from '../assets/shaders/fragment.js';

  export default {
    name: 'Statistic',
    data () {
      return {
        scene: null,
        cube: null,
        camera: null,
        renderer: null,
        time: 0,
        raycaster: new THREE.Raycaster(),
        mouse: new THREE.Vector2(),
        isDragging: false,
        renderScene: null,
        bloomPass: null,
        labelRenderer: new CSS3DRenderer(),
        pos: new THREE.Vector3(2, 0.5, 0),
        normal: new THREE.Vector3(1, 0, 0),
        cNormal: new THREE.Vector3(),
        cPos: new THREE.Vector3(),
        m4: new THREE.Matrix4(),
        direction: "",
        directionX: "",
        oldX: 0,
        oldY: 0,
        div: null,
        div2: null,
        div3: null,
				params: {
          exposure: 1,
          bloomStrength: 0,
          bloomThreshold: 0,
          bloomRadius: 0
        },
				composer: null,
        colors: [
          new THREE.Color(0xFFB36D),
          new THREE.Color(0xFF81E3),
          new THREE.Color(0x5CFFC4),
          new THREE.Color(0xF3F657)
        ],
        sphereMesh1: null,
        diagram1: new THREE.Group(),
        floor1: null,
        sphereMesh2: null,
        diagram2: new THREE.Group(),
        floor2: null,
        sphereMesh3: null,
        diagram3: new THREE.Group(),
        floor3: null,
        dText: null,
        statTexts: [
          {
            id: 1,
            title: 'Text',
            text:'It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
          },
          {
            id: 2,
            title: 'Text 2',
            text:'It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
          },
          {
            id: 3,
            title: 'Text 3',
            text:'It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
          }
        ],
        activeStat: 1,
        zoomUp: true,
        zoomDown: false,
        zoomUp2: true,
        zoomDown2: false,
        zoomUp3: true,
        zppmDown3: false,
        fractalMesh: null,
        fractalMesh2: null,
        fractalMesh3: null,
        fractalOffset: new THREE.Vector2(-2.0 * window.innerWidth / window.innerHeight, -2.0),
        fractalOffset2: new THREE.Vector2(-3, -3),
        fractalOffset3: new THREE.Vector2(-2.0 * window.innerWidth / window.innerHeight, -2.0),
        fractalZoom: 4,
        fractalZoom2: {
          value: 6
        },
        fractalZoom3: {
          value: 2
        },
        fractalParams: {
          a: 1.01,
          b: 0.01,
          c: 0.01,
          d: 0.01,
          e: 0.01,
          f: 0.01
        }
      }
    },
    methods: {
      myScene: function () {
        var container = document.getElementById('statistic-container');
        this.scene = new THREE.Scene();

        var width = window.innerWidth;
        var height = window.innerHeight;
        if(window.innerWidth < 1023){
          height = window.innerHeight / 2;
        }

        this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 5000);
        this.camera.position.z = 2500;
        this.camera.position.y = 600;

        var sLight = new THREE.PointLight(0xff00ff);
        sLight.position.set(-100, 100, 100);
        this.scene.add(sLight);
        var aLight = new THREE.DirectionalLight(0xffffff);
        aLight.position.set( 0, 0, 1 );
        this.scene.add(aLight);

        var dNumbersLoader = new THREE.FontLoader();

        var dGeo11 = new THREE.BoxBufferGeometry(100, 400, 100);
        var dMat11 = new THREE.MeshLambertMaterial({
          color: this.colors[0],
          wireframe: false
        });
        var dMesh11 = new THREE.Mesh(dGeo11, dMat11);
        dMesh11.position.x = -150;
        dMesh11.position.y = -550;

        var dGeo12 = new THREE.BoxBufferGeometry(100, 400, 100);
        var dMat12 = new THREE.MeshLambertMaterial({
          color: this.colors[0],
          wireframe: false
        });
        var dMesh12 = new THREE.Mesh(dGeo12, dMat12);
        dMesh12.position.y = -550;

        var dGeo13 = new THREE.BoxBufferGeometry(100, 400, 100);
        var dMat13 = new THREE.MeshLambertMaterial({
          color: this.colors[0],
          wireframe: false
        });
        var dMesh13 = new THREE.Mesh(dGeo13, dMat13);
        dMesh13.position.x = 150;
        dMesh13.position.y = -550;

        var dGeo21 = new THREE.BoxBufferGeometry(100, 400, 100);
        var dMat21 = new THREE.MeshLambertMaterial({
          color: this.colors[1],
          wireframe: false
        });
        var dMesh21 = new THREE.Mesh(dGeo21, dMat21);
        dMesh21.position.x = -150;
        dMesh21.position.y = -550;

        var dGeo22 = new THREE.BoxBufferGeometry(100, 400, 100);
        var dMat22 = new THREE.MeshLambertMaterial({
          color: this.colors[1],
          wireframe: false
        });
        var dMesh22 = new THREE.Mesh(dGeo22, dMat22);
        dMesh22.position.y = -550;

        var dGeo23 = new THREE.BoxBufferGeometry(100, 400, 100);
        var dMat23 = new THREE.MeshLambertMaterial({
          color: this.colors[1],
          wireframe: false
        });
        var dMesh23 = new THREE.Mesh(dGeo23, dMat23);
        dMesh23.position.x = 150;
        dMesh23.position.y = -550;

        var dGeo31 = new THREE.BoxBufferGeometry(100, 400, 100);
        var dMat31 = new THREE.MeshLambertMaterial({
          color: this.colors[2],
          wireframe: false
        });
        var dMesh31 = new THREE.Mesh(dGeo31, dMat31);
        dMesh31.position.x = -150;
        dMesh31.position.y = -550;

        var dGeo32 = new THREE.BoxBufferGeometry(100, 400, 100);
        var dMat32 = new THREE.MeshLambertMaterial({
          color: this.colors[2],
          wireframe: false
        });
        var dMesh32 = new THREE.Mesh(dGeo32, dMat32);
        dMesh32.position.y = -550;

        var dGeo33 = new THREE.BoxBufferGeometry(100, 400, 100);
        var dMat33 = new THREE.MeshLambertMaterial({
          color: this.colors[2],
          wireframe: false
        });
        var dMesh33 = new THREE.Mesh(dGeo33, dMat33);
        dMesh33.position.x = 150;
        dMesh33.position.y = -550;

        dNumbersLoader.load("./three_fonts/Kanit_Regular.json", function(
          font
        ) {
          var dNumbers = ['50%', '20%', '30%', '21%', '15%', '7%', '56%', '78%', '23%'];

          for (let i = 0; i < dNumbers.length; i++) {
            var text = new THREE.TextBufferGeometry(dNumbers[i], {
              font: font,
              size: 50,
              height: 5,
              curveSegments: 10
            });

            const mat = new THREE.MeshBasicMaterial({
              color: 0xff7152
            });

            let mesh = dMesh11;

            if (i == 0) {
              mesh = dMesh11;
            } else if (i == 1) {
              mesh = dMesh12;
            } else if (i == 2) {
              mesh = dMesh13;
            } else if (i == 3) {
              mesh = dMesh21;
            } else if (i == 4) {
              mesh = dMesh22;
            } else if (i == 5) {
              mesh = dMesh23;
            } else if (i == 6) {
              mesh = dMesh31;
            } else if (i == 7) {
              mesh = dMesh32;
            } else if (i == 8) {
              mesh = dMesh33;
            }

            let textMesh = new THREE.Mesh(text, mat);
            textMesh.position.y = 230;
            textMesh.position.x = 35;
            textMesh.rotation.y = 35;
            mesh.add(textMesh);
          }
        });

        this.diagram1.position.y = 500;
        this.diagram1.rotation.y = 4.8;
        this.diagram1.add(dMesh11);
        this.diagram1.add(dMesh12);
        this.diagram1.add(dMesh13);

        this.diagram2.position.y = 500;
        this.diagram2.rotation.y = 5;
        this.diagram2.add(dMesh21);
        this.diagram2.add(dMesh22);
        this.diagram2.add(dMesh23);

        this.diagram3.position.y = 500;
        this.diagram3.rotation.y = 4.5;
        this.diagram3.add(dMesh31);
        this.diagram3.add(dMesh32);
        this.diagram3.add(dMesh33);

        var sphereGeo1 = new THREE.SphereBufferGeometry(200, 40, 40);
        var sphereMat1 = new THREE.MeshLambertMaterial({
          color: this.colors[0],
          wireframe: true
        });
        this.sphereMesh1 = new THREE.Mesh(sphereGeo1, sphereMat1);
        this.sphereMesh1.position.y = 550;

        this.div = document.createElement('div');
        this.div.className = 'label';
        this.div.textContent = 'Check Stats 1';
        var label = new CSS3DObject(this.div);
        label.position.copy(this.pos);
        label.rotation.y = Math.PI * 0.5;
        label.scale.set(5, 5, 5);

        var floorGeo1 = new THREE.CylinderGeometry(300, 300, 500, 32);
        var floorMat1 = new THREE.MeshLambertMaterial({
          color: 0x00050F,
          wireframe: false
        });
        this.floor1 = new THREE.Mesh(floorGeo1, floorMat1);
        this.floor1.position.x = -1200;
        this.floor1.position.y = 245;
        this.floor1.rotation.y = 4.8;
        this.floor1.matrixWorldNeedsUpdate = true;
        this.floor1.add(this.sphereMesh1);
        this.floor1.add(this.diagram1);
        this.floor1.add(label);

        var sphereGeo2 = new THREE.SphereBufferGeometry(200, 40, 40);
        var sphereMat2 = new THREE.MeshLambertMaterial({
          color: this.colors[1],
          wireframe: true
        });
        this.sphereMesh2 = new THREE.Mesh(sphereGeo2, sphereMat2);
        this.sphereMesh2.position.y = 550;

        this.div2 = document.createElement('div');
        this.div2.className = 'label';
        this.div2.textContent = 'Check Stats 2';
        var label2 = new CSS3DObject(this.div2);
        label2.position.copy(this.pos);
        label2.rotation.y = Math.PI * 0.5;
        label2.scale.set(5, 5, 5);

        var floorGeo2 = new THREE.CylinderGeometry(300, 300, 500, 32);
        var floorMat2 = new THREE.MeshLambertMaterial({
          color: 0x00050F,
          wireframe: false
        });
        this.floor2 = new THREE.Mesh(floorGeo2, floorMat2);
        this.floor2.position.x = 600;
        this.floor2.position.z = 1045;
        this.floor2.position.y = 245;
        this.floor2.rotation.y = 4.8;
        this.floor2.add(this.sphereMesh2);
        this.floor2.add(this.diagram2);
        this.floor2.add(label2);

        var sphereGeo3 = new THREE.SphereBufferGeometry(200, 40, 40);
        var sphereMat3 = new THREE.MeshLambertMaterial({
          color: this.colors[2],
          wireframe: true
        });
        this.sphereMesh3 = new THREE.Mesh(sphereGeo3, sphereMat3);
        this.sphereMesh3.position.y = 550;

        this.div3 = document.createElement('div');
        this.div3.className = 'label';
        this.div3.textContent = 'Check Stats 3';
        var label3 = new CSS3DObject(this.div3);
        label3.position.copy(this.pos);
        label3.rotation.y = Math.PI * 0.5;
        label3.scale.set(5, 5, 5);

        var floorGeo3 = new THREE.CylinderGeometry(300, 300, 500, 32);
        var floorMat3 = new THREE.MeshLambertMaterial({
          color: 0x00050F,
          wireframe: false,
          clippingPlanes: [this.floor1],
          clipShadows: true
        });
        this.floor3 = new THREE.Mesh(floorGeo3, floorMat3);
        this.floor3.position.z = -1060;
        this.floor3.position.x = 550;
        this.floor3.position.y = 245;
        this.floor3.rotation.y = 4.8;
        this.floor3.add(this.sphereMesh3);
        this.floor3.add(this.diagram3);
        this.floor3.add(label3);

        var wrapperGeo = new THREE.CylinderGeometry(1500, 1500, 1, 50);
        var wrapperMat = new THREE.MeshLambertMaterial({
          color: 0x00050F,
          wireframe: false
        });
        var wrapper = new THREE.Mesh(wrapperGeo, wrapperMat);
        wrapper.add(this.floor1);
        wrapper.add(this.floor2);
        wrapper.add(this.floor3);
        this.scene.add(wrapper);
        // console.log(this.scene.children[2].children[0].children[2].position.copy(this.pos))
        if(window.innerWidth < 1023){
          wrapper.position.x = 0;
        }else{
          wrapper.position.x = -width;
        }

        THREE.Mesh.prototype.raycast = acceleratedRaycast;
        THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
        THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        container.appendChild(this.renderer.domElement);
        this.labelRenderer.setSize(width, height);
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0px';
        container.appendChild(this.labelRenderer.domElement);

        this.renderScene = new RenderPass(this.scene, this.camera);

				this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
				this.bloomPass.threshold = this.params.bloomThreshold;
				this.bloomPass.strength = this.params.bloomStrength;
				this.bloomPass.radius = this.params.bloomRadius;

        this.composer = new EffectComposer(this.renderer);
				this.composer.addPass(this.renderScene);
				this.composer.addPass(this.bloomPass);

        //Fractal
        this.fractalUniforms = {
          res: {type: 'vec2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
          aspect: {type: 'float', value: window.innerWidth / window.innerHeight},
          zoom: {type:'float', value: this.fractalZoom},
          opacity: {value: 0.05},
					color: {value: this.colors[3]},
          offset: {type:'vec2', value: this.fractalOffset},
          pset1: {type:'vec3', value: new THREE.Vector3(this.fractalParams['a'], this.fractalParams['b'], this.fractalParams['c'])},
          pset2: {type:'vec3', value: new THREE.Vector3(this.fractalParams['d'], this.fractalParams['e'], this.fractalParams['f'])}
        };

        let fractalGeo = new THREE.PlaneBufferGeometry(6000, 5000);
        let fractalMat = new THREE.ShaderMaterial({
          uniforms: this.fractalUniforms,
          fragmentShader: fractal_fragment,
          vertexShader: fractal_vertex,
          blending: THREE.AdditiveBlending,
					depthTest: false,
					transparent: true
        });

        this.fractalMesh = new THREE.Mesh(fractalGeo, fractalMat);
        //this.fractalMesh.position.x = -width * 1.8;
        //this.scene.add(this.fractalMesh);

        this.fractalUniforms3 = {
          res: {type: 'vec2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
          aspect: {type: 'float', value: window.innerWidth / window.innerHeight},
          zoom: {type:'float', value: this.fractalZoom3},
          opacity: {value: 0.15},
					color: {value: this.colors[3]},
          offset: {type:'vec2', value: this.fractalOffset3},
          pset1: {type:'vec3', value: new THREE.Vector3(this.fractalParams['a'], this.fractalParams['b'], this.fractalParams['c'])},
          pset2: {type:'vec3', value: new THREE.Vector3(this.fractalParams['d'], this.fractalParams['e'], this.fractalParams['f'])}
        };

        let fractalGeo3 = new THREE.PlaneBufferGeometry(6000, 5000);
        let fractalMat3 = new THREE.ShaderMaterial({
          uniforms: this.fractalUniforms3,
          fragmentShader: fractal_fragment,
          vertexShader: fractal_vertex,
          blending: THREE.AdditiveBlending,
					depthTest: false,
					transparent: true
        });

        this.fractalMesh3 = new THREE.Mesh(fractalGeo3, fractalMat3);
        //this.fractalMesh3.position.x = -width * 1.8;
        //this.scene.add(this.fractalMesh3);
        this.createFractal();
        //End Fractal
      },
      animate: function() {
        this.sphereMesh1.rotation.x += 0.01;
	      this.sphereMesh1.rotation.y += 0.01;
        this.sphereMesh2.rotation.x += 0.01;
	      this.sphereMesh2.rotation.y += 0.01;
        this.sphereMesh3.rotation.x -= 0.01;
	      this.sphereMesh3.rotation.y -= 0.01;
        
        if (this.zoomUp) {
          this.fractalZoom = this.fractalZoom - 0.005;
          if (this.fractalZoom < 0) {
            this.zoomUp = false;
            this.zoomDown = true;
          }
        }

        if (this.zoomDown) {
          this.fractalZoom = this.fractalZoom + 0.005;
          if (this.fractalZoom > 4) {
            this.zoomUp = true;
            this.zoomDown = false;
          }
        }

        this.fractalOffset = this.fractalOffset.add(new THREE.Vector2(
          -this.fractalOffset.x + -1, 
          -this.fractalOffset.y + -0.33
        ));

        this.fractalUniforms['zoom']['value'] = this.fractalZoom;
        this.fractalUniforms['offset']['value'] = this.fractalOffset;

        if (this.zoomUp2) {
          this.fractalZoom2.value = this.fractalZoom2.value - 0.01;
          this.fractalOffset2.x = this.fractalOffset2.x + -0.0001;
          this.fractalOffset2.y = this.fractalOffset2.y + 0.01;

          if (this.fractalZoom2.value < 0) {
            this.zoomUp2 = false;
            this.zoomDown2 = true;
          }
        }

        //if (this.zoomDown2) {
        //  this.fractalZoom2 = this.fractalZoom2 + 0.01;
        //  if (this.fractalZoom2 > 6) {
        //    this.zoomUp2 = true;
        //    this.zoomDown2 = false;
        //  }
        //}

        this.fractalUniforms2['zoom']['value'] = this.fractalZoom2.value;
        this.fractalUniforms2['offset']['value'] = this.fractalOffset2;
        //console.log(this.fractalZoom2.value)

        if (this.zoomUp3) {
          this.fractalZoom3 = this.fractalZoom3 - 0.005;
          if (this.fractalZoom3 < 0) {
            this.zoomUp3 = false;
            this.zoomDown3 = true;
          }
        }

        if (this.zoomDown3) {
          this.fractalZoom3 = this.fractalZoom3 + 0.005;
          if (this.fractalZoom3 > 2) {
            this.zoomUp3 = true;
            this.zoomDown3 = false;
          }
        }

        this.fractalOffset3 = this.fractalOffset3.add(new THREE.Vector2(
          -this.fractalOffset3.x + -1, 
          -this.fractalOffset3.y + -0.33
        ));

        this.fractalUniforms3['zoom']['value'] = this.fractalZoom3;
        this.fractalUniforms3['offset']['value'] = this.fractalOffset3;

        TWEEN.update();
        requestAnimationFrame(this.animate);
        this.render();
      },
      createFractal: function () {
        this.fractalUniforms2 = {
          res: {type: 'vec2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
          aspect: {type: 'float', value: window.innerWidth / window.innerHeight},
          zoom: {type:'float', value: this.fractalZoom2.value},
          opacity: {value: 0.1},
					color: {value: this.colors[3]},
          offset: {type:'vec2', value: this.fractalOffset2},
          pset1: {type:'vec3', value: new THREE.Vector3(this.fractalParams['a'], this.fractalParams['b'], this.fractalParams['c'])},
          pset2: {type:'vec3', value: new THREE.Vector3(this.fractalParams['d'], this.fractalParams['e'], this.fractalParams['f'])}
        };

        let fractalGeo2 = new THREE.PlaneBufferGeometry(9000, 5000);
        let fractalMat2 = new THREE.ShaderMaterial({
          uniforms: this.fractalUniforms2,
          fragmentShader: fractal_fragment,
          vertexShader: fractal_vertex,
          blending: THREE.AdditiveBlending,
					depthTest: false,
					transparent: true
        });

        this.fractalMesh2 = new THREE.Mesh(fractalGeo2, fractalMat2);
        //this.fractalMesh2.position.x = -width * 1.8;
        this.scene.add(this.fractalMesh2);

        //new TWEEN.Tween(this.fractalZoom2)
        //.to({ value: 0 }, 30000)
        //.easing(TWEEN.Easing.Quintic.Out)
        //.start();
        //console.log(this.fractalMesh2.position)

        //new TWEEN.Tween(this.fractalOffset2)
        //.to({ x: 3, y: 4 }, 60000)
        //.easing(TWEEN.Easing.Quintic.Out)
        //.start();
      },
      render: function () {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.raycaster.firstHitOnly = true;
        this.renderer.render(this.scene, this.camera);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.physicallyCorrectLights = true;
        this.composer.render();
        this.labelRenderer.render(this.scene, this.camera);
      },
      onWindowResize: function() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.scene.children[2].children[0].children[2].position.copy(this.pos)
        this.scene.children[2].children[0].children[2].matrixWorld.set(this.floor1.matrixWorld)
        this.scene.children[2].children[0].children[2].updateMatrixWorld()
        console.log(this.floor1)
        console.log(this.scene.children[2].children[0].children[2])
        this.render();
      },
      onMouseDown: function() {
        this.isDragging = true;

        new TWEEN.Tween(this.bloomPass)
        .to({ strength: 0.5 }, 500)
        .easing(TWEEN.Easing.Cubic.In)
        .start();
      },
      onMouseUp: function() {
        this.isDragging = false;

        new TWEEN.Tween(this.bloomPass)
        .to({ strength: 0 }, 500)
        .easing(TWEEN.Easing.Cubic.In)
        .start();
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

        let int1 = this.raycaster.intersectObjects([this.scene.children[2].children[0]]);
        let int2 = this.raycaster.intersectObjects([this.scene.children[2].children[1]]);
        let int3 = this.raycaster.intersectObjects([this.scene.children[2].children[2]]);

        int1 = int1[0] !== undefined ? int1[0] : false;
        int2 = int2[0] !== undefined ? int2[0] : false;
        int3 = int3[0] !== undefined ? int3[0] : false;

        if (this.isDragging) {
          if (int1 && !int2 && !int3) {
            this.activeStat = 1;
            let fl1 = int1.object;

            if (this.directionX === "right") {
              fl1.rotation.y = fl1.rotation.y + this.mouse.x;
            }

            if (this.directionX === "left") {
              fl1.rotation.y = fl1.rotation.y - this.mouse.x;
            }

            var S1 = new TWEEN.Tween(this.sphereMesh1.position)
            .to({ y: 0 }, 500)
            .easing(TWEEN.Easing.Cubic.InOut);

            var A1 = new TWEEN.Tween(fl1.children[1].children[0].position)
            .to({ y: -150 }, 200)
            .easing(TWEEN.Easing.Cubic.InOut);

            var B1 = new TWEEN.Tween(fl1.children[1].children[1].position)
            .to({ y: -180 }, 200)
            .easing(TWEEN.Easing.Cubic.InOut);

            var C1 = new TWEEN.Tween(fl1.children[1].children[2].position)
            .to({ y: -100 }, 200)
            .easing(TWEEN.Easing.Cubic.InOut);

            S1.chain(A1);
            A1.chain(B1);
            B1.chain(C1);
            S1.start();
          }

          if (int2 && !int1 && !int3) {
            this.activeStat = 2;
            let fl2 = int2.object;

            if (this.directionX === "right") {
              fl2.rotation.y = fl2.rotation.y + this.mouse.x;
            }

            if (this.directionX === "left") {
              fl2.rotation.y = fl2.rotation.y - this.mouse.x;
            }

            var S2 = new TWEEN.Tween(this.sphereMesh2.position)
            .to({ y: 0 }, 500)
            .easing(TWEEN.Easing.Cubic.InOut);

            var A2 = new TWEEN.Tween(fl2.children[1].children[0].position)
            .to({ y: -200 }, 500)
            .easing(TWEEN.Easing.Cubic.InOut);

            var B2 = new TWEEN.Tween(fl2.children[1].children[1].position)
            .to({ y: -180 }, 500)
            .easing(TWEEN.Easing.Cubic.InOut);

            var C2 = new TWEEN.Tween(fl2.children[1].children[2].position)
            .to({ y: -110 }, 500)
            .easing(TWEEN.Easing.Cubic.InOut);

            S2.chain(A2);
            A2.chain(B2);
            B2.chain(C2);
            S2.start();
          }

          if (int3 && !int1 && !int2) {
            this.activeStat = 3;
            let fl3 = int3.object;

            if (this.directionX === "right") {
              fl3.rotation.y = fl3.rotation.y + this.mouse.x;
            }

            if (this.directionX === "left") {
              fl3.rotation.y = fl3.rotation.y - this.mouse.x;
            }

            var S3 = new TWEEN.Tween(this.sphereMesh3.position)
            .to({ y: 0 }, 500)
            .easing(TWEEN.Easing.Cubic.InOut);

            var A3 = new TWEEN.Tween(fl3.children[1].children[0].position)
            .to({ y: -200 }, 500)
            .easing(TWEEN.Easing.Cubic.InOut);

            var B3 = new TWEEN.Tween(fl3.children[1].children[1].position)
            .to({ y: -180 }, 500)
            .easing(TWEEN.Easing.Cubic.InOut);

            var C3 = new TWEEN.Tween(fl3.children[1].children[2].position)
            .to({ y: -110 }, 500)
            .easing(TWEEN.Easing.Cubic.InOut);

            S3.chain(A3);
            A3.chain(B3);
            B3.chain(C3);
            S3.start();
          }
        }

        if (!int1) {
          let fl1 = this.scene.children[2].children[0];

          var A1 = new TWEEN.Tween(fl1.children[1].children[0].position)
          .to({ y: -550 }, 200)
          .easing(TWEEN.Easing.Cubic.InOut);

          var B1 = new TWEEN.Tween(fl1.children[1].children[1].position)
          .to({ y: -550 }, 200)
          .easing(TWEEN.Easing.Cubic.InOut);

          var C1 = new TWEEN.Tween(fl1.children[1].children[2].position)
          .to({ y: -550 }, 200)
          .easing(TWEEN.Easing.Cubic.InOut);

          var S1 = new TWEEN.Tween(this.sphereMesh1.position)
          .to({ y: 550 }, 500)
          .easing(TWEEN.Easing.Cubic.InOut);

          A1.chain(B1);
          B1.chain(C1);
          C1.chain(S1);
          A1.start();
        }

        if (!int2) {
          let fl2 = this.scene.children[2].children[1];

          var S2 = new TWEEN.Tween(this.sphereMesh2.position)
          .to({ y: 550 }, 500)
          .easing(TWEEN.Easing.Cubic.InOut);

          var A2 = new TWEEN.Tween(fl2.children[1].children[0].position)
          .to({ y: -550 }, 200)
          .easing(TWEEN.Easing.Cubic.InOut);

          var B2 = new TWEEN.Tween(fl2.children[1].children[1].position)
          .to({ y: -550 }, 200)
          .easing(TWEEN.Easing.Cubic.InOut);

          var C2 = new TWEEN.Tween(fl2.children[1].children[2].position)
          .to({ y: -550 }, 200)
          .easing(TWEEN.Easing.Cubic.InOut);

          A2.chain(B2);
          B2.chain(C2);
          C2.chain(S2);
          A2.start();
        }

        if (!int3) {
          let fl3 = this.scene.children[2].children[2];

          var S3 = new TWEEN.Tween(this.sphereMesh3.position)
          .to({ y: 550 }, 500)
          .easing(TWEEN.Easing.Cubic.InOut);

          var A3 = new TWEEN.Tween(fl3.children[1].children[0].position)
          .to({ y: -550 }, 200)
          .easing(TWEEN.Easing.Cubic.InOut);

          var B3 = new TWEEN.Tween(fl3.children[1].children[1].position)
          .to({ y: -550 }, 200)
          .easing(TWEEN.Easing.Cubic.InOut);

          var C3 = new TWEEN.Tween(fl3.children[1].children[2].position)
          .to({ y: -550 }, 200)
          .easing(TWEEN.Easing.Cubic.InOut);

          A3.chain(B3);
          B3.chain(C3);
          C3.chain(S3);
          A3.start();
        }
      },
      wheelScroll: function (event) {
        let wrapper = this.raycaster.intersectObjects([this.scene.children[2]]);
        wrapper = wrapper[0] !== undefined ? wrapper[0] : false;

        if (wrapper) {
          if (event.deltaY < 0) {
            this.scene.children[2].rotation.y -= event.clientX * 0.0008;
          }

          if (event.deltaY > 0) {
            this.scene.children[2].rotation.y += event.clientX * 0.0008;
          }
        }
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
  .statistic-text__block{
    position: absolute;
    max-height: 100%;
    width: 100%;
    top: 0px;
    right: 0px;
    pointer-events: none;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    opacity: 0;
    transform: translateY(10px);
  }
  .statistic-text__block.active{
    pointer-events: all;
    opacity: 1;
    transform: translateY(0px);
    transition-delay: .6s;
  }
  .statistic-text__text{
    text-align: left;
    color: rgba(171, 176, 188, 1);
    padding-bottom: 100px;
  }
  .statistic-text__ttl{
    text-align: left;
    font-size: 70px;
    line-height: 70px;
    color: #FF7152;
    margin-bottom: 30px;
    margin-top: 30px;
  }
  .statistic-text__block-inner{
    display: flex;
    flex-direction: column;
    padding-right: 30px;
  }
  .statistic-text__container{
    position: absolute;
    width: 40%;
    right: 80px;
    height: calc(100% - 138px);
    z-index: 10;
    bottom: 0px;
  }
  .statistic__wrapper {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100vh;
  }
  #statistic-container {
    width: 100%;
    height: 100vh;
  }
  .label {
    text-align: center;
    width: 200px;
    height: 200px;
    border: 1px solid white;
    border-radius: 5px;
    color: #ffffff;
    font-family: sans-serif;
    background: rgba( 0, 0, 0, .6 );
    z-index: 100000;
  }
  /*Ipad Pro*/
  @media (max-width: 1300px){
    .statistic-text__ttl{
      font-size: 35px;
      line-height: 40px;
    }
    .statistic-text__text{
      font-size: 14px;
      line-height: 18px;
    }
  }
  /*Ipad 768*/
  @media (max-width: 1023px){
    .statistic-main{
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .statistic-text__container{
      right: 45px;
      width: calc(100% - 90px);
      height: 50%;
    }
  }
  /*Mobile*/
  @media (max-width: 767px){
    .statistic-text__container{
      right: 15px;
      width: calc(100% - 30px);
    }
    .statistic-text__text{
      padding-bottom: 50px;
    }
    .statistic-text__block-inner{
      padding-right: 15px;
    }
    .statistic-text__ttl{
      margin-bottom: 15px;
    }
  }
</style>
