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
        floor2: null
      }
    },
    methods: {
      myScene: function () {
        var container = document.getElementById('statistic-container');
        this.scene = new THREE.Scene();

        var width = window.innerWidth;
        var height = window.innerHeight;
        
        this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 3000);
        this.camera.position.z = 2500;
        
        var sLight = new THREE.PointLight(0xff00ff);
        sLight.position.set(-100, 100, 100);
        this.scene.add(sLight);
        var aLight = new THREE.DirectionalLight( 0xffffff );
        aLight.position.set( 0, 0, 1 );
        this.scene.add(aLight);

        var sphereGeo1 = new THREE.SphereBufferGeometry(200, 10, 5);
        var sphereMat1 = new THREE.MeshBasicMaterial ({
          color: this.colors[0],
          wireframe: true
        });
        this.sphereMesh1 = new THREE.Mesh(sphereGeo1, sphereMat1);
        this.sphereMesh1.position.y = 550;

        var dGeo11 = new THREE.BoxBufferGeometry(100, 400, 100);
        var dMat11 = new THREE.MeshBasicMaterial ({
          color: this.colors[0],
          wireframe: true
        });
        var dMesh11 = new THREE.Mesh(dGeo11, dMat11);
        dMesh11.position.x = -150;
        dMesh11.position.y = -550;

        var dGeo12 = new THREE.BoxBufferGeometry(100, 400, 100);
        var dMat12 = new THREE.MeshBasicMaterial ({
          color: this.colors[0],
          wireframe: true
        });
        var dMesh12 = new THREE.Mesh(dGeo12, dMat12);
        dMesh12.position.y = -550;

        var dGeo13 = new THREE.BoxBufferGeometry(100, 400, 100);
        var dMat13 = new THREE.MeshBasicMaterial ({
          color: this.colors[0],
          wireframe: true
        });
        var dMesh13 = new THREE.Mesh(dGeo13, dMat13);
        dMesh13.position.x = 150;
        dMesh13.position.y = -550;

        var dGeo21 = new THREE.BoxBufferGeometry(100, 400, 100);
        var dMat21 = new THREE.MeshBasicMaterial ({
          color: this.colors[1],
          wireframe: true
        });
        var dMesh21 = new THREE.Mesh(dGeo21, dMat21);
        dMesh21.position.x = -150;
        dMesh21.position.y = -550;

        var dGeo22 = new THREE.BoxBufferGeometry(100, 400, 100);
        var dMat22 = new THREE.MeshBasicMaterial ({
          color: this.colors[1],
          wireframe: true
        });
        var dMesh22 = new THREE.Mesh(dGeo22, dMat22);
        dMesh22.position.y = -550;

        var dGeo23 = new THREE.BoxBufferGeometry(100, 400, 100);
        var dMat23 = new THREE.MeshBasicMaterial ({
          color: this.colors[1],
          wireframe: true
        });
        var dMesh23 = new THREE.Mesh(dGeo23, dMat23);
        dMesh23.position.x = 150;
        dMesh23.position.y = -550;

        this.diagram1.position.y = 550;
        this.diagram1.add(dMesh11);
        this.diagram1.add(dMesh12);
        this.diagram1.add(dMesh13);

        this.diagram2.position.y = 550;
        this.diagram2.add(dMesh21);
        this.diagram2.add(dMesh22);
        this.diagram2.add(dMesh23);

        var floorGeo1 = new THREE.BoxBufferGeometry(500, 500, 500, 500);
        var floorMat1 = new THREE.MeshBasicMaterial({ color: 0x00050F });
        this.floor1 = new THREE.Mesh(floorGeo1, floorMat1);
        this.floor1.material.side = THREE.DoubleSide;
        this.floor1.position.x = -1500;
        this.floor1.add(this.sphereMesh1);
        this.floor1.add(this.diagram1);
        this.scene.add(this.floor1); 
        
        var sphereGeo2 = new THREE.SphereBufferGeometry(200, 10, 5);
        var sphereMat2 = new THREE.MeshBasicMaterial ({
          color: this.colors[1],
          wireframe: true
        });
        this.sphereMesh2 = new THREE.Mesh(sphereGeo2, sphereMat2);
        this.sphereMesh2.position.y = 550;

        var floorGeo2 = new THREE.BoxBufferGeometry(500, 500, 500, 500);
        var floorMat2 = new THREE.MeshBasicMaterial({ color: 0x00050F });
        this.floor2 = new THREE.Mesh(floorGeo2, floorMat2);
        this.floor2.material.side = THREE.DoubleSide;
        this.floor2.position.x = 1500;
        this.floor2.add(this.sphereMesh2);
        this.floor2.add(this.diagram2);
        this.scene.add(this.floor2); 

        THREE.Mesh.prototype.raycast = acceleratedRaycast;
        THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
        THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize( width, height );
        container.appendChild(this.renderer.domElement);
      },
      animate: function() {
        this.sphereMesh1.rotation.x += 0.01;
	      this.sphereMesh1.rotation.y += 0.01;
        this.sphereMesh2.rotation.x += 0.01;
	      this.sphereMesh2.rotation.y += 0.01;

        TWEEN.update();
        requestAnimationFrame(this.animate);
        this.render();
      },
      render: function () {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.raycaster.firstHitOnly = true;
        this.renderer.render(this.scene, this.camera);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.physicallyCorrectLights = true;
      },
      onWindowResize: function() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.render();
      },
      onMouseDown: function() {
        this.isDragging = true;
      },
      onMouseUp: function() {
        this.isDragging = false;
      },
      onMouseMove: function (event) {
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        let int1 = this.raycaster.intersectObjects([this.scene.children[2]]);
        let int2 = this.raycaster.intersectObjects([this.scene.children[3]]);
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

            new TWEEN.Tween(this.sphereMesh2.position)
            .to({ y: 0 }, 500)
            .easing(TWEEN.Easing.Cubic.InOut)
            .start();

            setTimeout(() => {
              new TWEEN.Tween(this.floor2.children[1].children[0].position)
              .to({ y: -200 }, 500)
              .easing(TWEEN.Easing.Cubic.InOut)
              .start();
            }, 500);

            setTimeout(() => {
              new TWEEN.Tween(this.floor2.children[1].children[1].position)
              .to({ y: -180 }, 500)
              .easing(TWEEN.Easing.Cubic.InOut)
              .start();
            }, 700);

            setTimeout(() => {
              new TWEEN.Tween(this.floor2.children[1].children[2].position)
              .to({ y: -110 }, 500)
              .easing(TWEEN.Easing.Cubic.InOut)
              .start();
            }, 900);
          }
        } 
        
        if (!this.isDragging) {
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

          new TWEEN.Tween(this.sphereMesh2.position)
          .to({ y: 550 }, 500)
          .easing(TWEEN.Easing.Cubic.InOut)
          .start();

          new TWEEN.Tween(this.floor2.children[1].children[0].position)
          .to({ y: -550 }, 500)
          .easing(TWEEN.Easing.Cubic.InOut)
          .start();

          new TWEEN.Tween(this.floor2.children[1].children[1].position)
          .to({ y: -550 }, 500)
          .easing(TWEEN.Easing.Cubic.InOut)
          .start();

          new TWEEN.Tween(this.floor2.children[1].children[2].position)
          .to({ y: -550 }, 500)
          .easing(TWEEN.Easing.Cubic.InOut)
          .start();
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
  
</style>
