<template>
  <div class="statistic__wrapper">
    <div id="statistic-container"></div>
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
  export default {
    name: 'Statistic',
    data () {
      return {
        scene: null,
        cube: null,
        camera: null,
        renderer: null,
        clock: null,
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
        dText: null
      }
    },
    methods: {
      myScene: function () {
        var container = document.getElementById('statistic-container');
        this.scene = new THREE.Scene();

        var width = window.innerWidth;
        var height = window.innerHeight;
        
        this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 3000);
        this.camera.position.z = 1700;
        this.camera.position.y = 700;
        
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
            textMesh.position.x = -35;
            mesh.add(textMesh);
          }
        });

        this.diagram1.position.y = 500;
        this.diagram1.rotation.y = 5;
        this.diagram1.add(dMesh11);
        this.diagram1.add(dMesh12);
        this.diagram1.add(dMesh13);

        this.diagram2.position.y = 500;
        this.diagram2.rotation.y = 5;
        this.diagram2.add(dMesh21);
        this.diagram2.add(dMesh22);
        this.diagram2.add(dMesh23);

        this.diagram3.position.y = 500;
        this.diagram3.rotation.y = 5;
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

        var floorGeo1 = new THREE.BoxBufferGeometry(500, 500, 500, 500);
        var floorMat1 = new THREE.MeshLambertMaterial({ 
          color: 0x00050F,
          wireframe: false
        });
        this.floor1 = new THREE.Mesh(floorGeo1, floorMat1);
        this.floor1.material.side = THREE.DoubleSide;
        this.floor1.position.x = -width;
        this.floor1.rotation.y = 4.8;
        this.floor1.add(this.sphereMesh1);
        this.floor1.add(this.diagram1);
        this.floor1.add(label);
        this.scene.add(this.floor1); 
        
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

        var floorGeo2 = new THREE.BoxBufferGeometry(500, 500, 500, 500);
        var floorMat2 = new THREE.MeshLambertMaterial({ 
          color: 0x00050F,
          wireframe: false
        });
        this.floor2 = new THREE.Mesh(floorGeo2, floorMat2);
        this.floor2.material.side = THREE.DoubleSide;
        this.floor2.position.z = 200;
        this.floor2.rotation.y = 4.8;
        this.floor2.add(this.sphereMesh2);
        this.floor2.add(this.diagram2);
        this.floor2.add(label2);
        this.scene.add(this.floor2); 

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

        var floorGeo3 = new THREE.BoxBufferGeometry(500, 500, 500, 500);
        var floorMat3 = new THREE.MeshLambertMaterial({ 
          color: 0x00050F,
          wireframe: false
        });
        this.floor3 = new THREE.Mesh(floorGeo3, floorMat3);
        this.floor3.material.side = THREE.DoubleSide;
        this.floor3.position.x = width;
        this.floor3.rotation.y = 4.8;
        this.floor3.add(this.sphereMesh3);
        this.floor3.add(this.diagram3);
        this.floor3.add(label3);
        this.scene.add(this.floor3); 

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
      },
      animate: function() {
        this.sphereMesh1.rotation.x += 0.01;
	      this.sphereMesh1.rotation.y += 0.01;
        this.sphereMesh2.rotation.x += 0.01;
	      this.sphereMesh2.rotation.y += 0.01;
        this.sphereMesh3.rotation.x -= 0.01;
	      this.sphereMesh3.rotation.y -= 0.01;

        TWEEN.update();
        requestAnimationFrame(this.animate);
        this.render();
      },
      render: function () {
        //this.cNormal.copy(this.normal).applyMatrix3(this.floor1.normalMatrix);
        //this.cPos.copy(this.pos).applyMatrix4(this.m4.multiplyMatrices(this.camera.matrixWorldInverse, this.floor1.matrixWorld));

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
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        let int1 = this.raycaster.intersectObjects([this.scene.children[2]]);
        let int2 = this.raycaster.intersectObjects([this.scene.children[3]]);
        let int3 = this.raycaster.intersectObjects([this.scene.children[4]]);

        if (this.isDragging) {
          if (int1 !== null && int1.length > 0) {
            this.floor1.rotation.y = this.floor1.rotation.y + this.mouse.x;

            var S1 = new TWEEN.Tween(this.sphereMesh1.position)
            .to({ y: 0 }, 500)
            .easing(TWEEN.Easing.Cubic.InOut);

            var A1 = new TWEEN.Tween(this.floor1.children[1].children[0].position)
            .to({ y: -150 }, 200)
            .easing(TWEEN.Easing.Cubic.InOut);
            
            var B1 = new TWEEN.Tween(this.floor1.children[1].children[1].position)
            .to({ y: -180 }, 200)
            .easing(TWEEN.Easing.Cubic.InOut);
            
            var C1 = new TWEEN.Tween(this.floor1.children[1].children[2].position)
            .to({ y: -100 }, 200)
            .easing(TWEEN.Easing.Cubic.InOut);

            S1.chain(A1);
            A1.chain(B1);
            B1.chain(C1);
            S1.start();     
          } 

          if (int2 !== null && int2.length > 0) {
            this.floor2.rotation.y = this.floor2.rotation.y + this.mouse.x;

            var S2 = new TWEEN.Tween(this.sphereMesh2.position)
            .to({ y: 0 }, 500)
            .easing(TWEEN.Easing.Cubic.InOut);

            var A2 = new TWEEN.Tween(this.floor2.children[1].children[0].position)
            .to({ y: -200 }, 500)
            .easing(TWEEN.Easing.Cubic.InOut);

            var B2 = new TWEEN.Tween(this.floor2.children[1].children[1].position)
            .to({ y: -180 }, 500)
            .easing(TWEEN.Easing.Cubic.InOut);

            var C2 = new TWEEN.Tween(this.floor2.children[1].children[2].position)
            .to({ y: -110 }, 500)
            .easing(TWEEN.Easing.Cubic.InOut);

            S2.chain(A2);
            A2.chain(B2);
            B2.chain(C2);
            S2.start();
          }

          if (int3 !== null && int3.length > 0) {
            this.floor3.rotation.y = this.floor3.rotation.y + this.mouse.x;

            var S3 = new TWEEN.Tween(this.sphereMesh3.position)
            .to({ y: 0 }, 500)
            .easing(TWEEN.Easing.Cubic.InOut);

            var A3 = new TWEEN.Tween(this.floor3.children[1].children[0].position)
            .to({ y: -200 }, 500)
            .easing(TWEEN.Easing.Cubic.InOut);

            var B3 = new TWEEN.Tween(this.floor3.children[1].children[1].position)
            .to({ y: -180 }, 500)
            .easing(TWEEN.Easing.Cubic.InOut);

            var C3 = new TWEEN.Tween(this.floor3.children[1].children[2].position)
            .to({ y: -110 }, 500)
            .easing(TWEEN.Easing.Cubic.InOut);

            S3.chain(A3);
            A3.chain(B3);
            B3.chain(C3);
            S3.start();
          }
        } 
        
        if (!this.isDragging && int1.length == 0) {
          var A1 = new TWEEN.Tween(this.floor1.children[1].children[0].position)
          .to({ y: -550 }, 200)
          .easing(TWEEN.Easing.Cubic.InOut);

          var B1 = new TWEEN.Tween(this.floor1.children[1].children[1].position)
          .to({ y: -550 }, 200)
          .easing(TWEEN.Easing.Cubic.InOut);

          var C1 = new TWEEN.Tween(this.floor1.children[1].children[2].position)
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

        if (!this.isDragging && int2.length == 0) {
          var S2 = new TWEEN.Tween(this.sphereMesh2.position)
          .to({ y: 550 }, 500)
          .easing(TWEEN.Easing.Cubic.InOut);

          var A2 = new TWEEN.Tween(this.floor2.children[1].children[0].position)
          .to({ y: -550 }, 200)
          .easing(TWEEN.Easing.Cubic.InOut);

          var B2 = new TWEEN.Tween(this.floor2.children[1].children[1].position)
          .to({ y: -550 }, 200)
          .easing(TWEEN.Easing.Cubic.InOut);

          var C2 = new TWEEN.Tween(this.floor2.children[1].children[2].position)
          .to({ y: -550 }, 200)
          .easing(TWEEN.Easing.Cubic.InOut);

          A2.chain(B2);
          B2.chain(C2);
          C2.chain(S2);
          A2.start();
        }

        if (!this.isDragging && int3.length == 0) {
          var S3 = new TWEEN.Tween(this.sphereMesh3.position)
          .to({ y: 550 }, 500)
          .easing(TWEEN.Easing.Cubic.InOut);

          var A3 = new TWEEN.Tween(this.floor3.children[1].children[0].position)
          .to({ y: -550 }, 200)
          .easing(TWEEN.Easing.Cubic.InOut);

          var B3 = new TWEEN.Tween(this.floor3.children[1].children[1].position)
          .to({ y: -550 }, 200)
          .easing(TWEEN.Easing.Cubic.InOut);

          var C3 = new TWEEN.Tween(this.floor3.children[1].children[2].position)
          .to({ y: -550 }, 200)
          .easing(TWEEN.Easing.Cubic.InOut);

          A3.chain(B3);
          B3.chain(C3);
          C3.chain(S3);
          A3.start();
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
    },
  }
</script>
<style scoped>
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
</style>
