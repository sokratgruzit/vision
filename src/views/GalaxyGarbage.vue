<template>
  <div class="game__container" :class="gameStart ? 'active' : ''">
    
    <div class="statistic-container" :class="statistic ? 'active' : ''">
      <div class="statistic-container__inner">
        <div class="statistic-container__ttl">You Win. Now you can go to statistic bro</div>
        <router-link to="/statistic" class="explore-button">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <div class="explore-button__text">Go to statistic</div>
        </router-link>
      </div>
    </div>
    <div class="action-container" :class="badgeAnimation ? 'active' : ''">
      <div class="animation-container">
        <div class="y-axis-container">
          <div class="container">
            <img :src="badgeTextures[badgeIndex - 1]" alt="coin">
          </div>
        </div>
      </div>
      <div class="next-lvl__container">
        Click To Next Level
      </div>
    </div>
    <div class="hud">
      <div class="hud__inner">Level
        <div class="level__container-outer">
          <div class="level__container" :style="{
          transform: `translateY(-${(level - 1) * 60}px)`
        }">
            <div class="level__num">1</div>
            <div class="level__num">2</div>
            <div class="level__num">3</div>
            <div class="level__num">4</div>
          </div>
        </div>
        <!--        {{level}}-->
      </div>
      <div class="hud__inner">Difficult <div class="word-animation"><span v-for="item in commentNow" :class="animateText ? 'changeText' : ''">{{item}}</span></div></div>
      <div class="hud__inner">Time
        <div class="timer">
          <div class="timer-col">
            {{ minutes }}:
          </div>
          <div class="timer-col">
            {{ seconds }}
          </div>
        </div>
      </div>
      <div class="hud__inner">My Score
        <div class="level__container-outer">
          <div class="level__container" :style="{
          transform: `translateY(-${(score) * 60}px)`
        }">
            <div class="level__num" v-for="item in maxScore">{{item - 1}}</div>
          </div>
        </div>
      </div>
      <div class="hud__inner" :style="{ position: 'relative' }">
        Player
        <div class="word-animation"><span v-for="item in playerStatusNow" :class="animateText ? 'changeText' : ''" :style="{ color: 'red' }">{{item}}</span></div>
        <div id="badges-container" class="badges"></div>
      </div>
    </div>
    <div id="webgl-container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { TessellateModifier } from 'three/examples/jsm/modifiers/TessellateModifier.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  target_vertex,
  wave_vertex
} from '../assets/shaders/vertex.js';
import {
  target_fragment,
  wave_fragment
} from '../assets/shaders/fragment.js';
const TWEEN = require('@tweenjs/tween.js');
export default {
  name: 'ThreeTest',
  data () {
    return {
      animateText: false,
      animateText2: false,
      maxScore: 20,
      statistic: false,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      firstAnimation: false,
      timeNow: new Date().getTime(),
      startTime: new Date('2021-02-01T00:00:00'),
      scene: null,
      cube: null,
      camera: null,
      renderer: null,
      clock: null,
      holder: null,
      intersects: null,
      particles: [],
      level: 1,
      totalLevels: 4,
      score: 0,
      totalTargets: 3,
      speed: 0.01,
      complete: false,
      commentNow: 'Easy',
      comments: ['Easy', 'Tricky', 'Careful now', 'INSANITY'],
      playerStatusNow: 'Baby',
      playerStatuses: ['Baby', 'Warrior', 'Death Machine', 'God of War'],
      levelAbout:'',
      myLevel: document.getElementById('level'),
      myScore: document.getElementById('score'),
      mouse: new THREE.Vector2(),
      sphereBg: null,
      mouseX: 0,
      mouseY: 0,
      windowHalfX: window.innerWidth / 2,
      windowHalfY: window.innerHeight / 2,
      pointerMouse: { x: 0, y: 0 },
      pointer: null,
      uniforms: null,
      geometry: null,
      vertex: target_vertex,
      fragment: target_fragment,
      waveVertex: wave_vertex,
      waveFragment: wave_fragment,
      waveUniforms: {
        tExplosion: {
          type: "t",
          value: new THREE.TextureLoader().load(require("../assets/fire.jpg"))
        },
        time: { // float initialized to 0
          type: "f",
          value: 0.0
        }
      },
      waveStart: Date.now(),
      waveMesh: null,
      badgeCanvas: null,
      badgeScene: null,
      badgeGeo: null,
      badgeMat: null,
      badgeMesh: null,
      badgeCamera: null,
      badgeScenes: [],
      badgeTextures: [
        require("../assets/badge_star.png"),
        require("../assets/badge_star2.png"),
        require("../assets/badge_star3.png"),
        require("../assets/badge_star4.png")
      ],
      oldBadgeIndex:0,
      badgeIndex: 0,
      badgeAnimation:false,
      intro: true,
      vectors: [],
      gameStart: false
    }
  },
  methods: {
    pad (val) {
      var valString = val + "";
      if (valString.length < 2) {
        return "0" + valString;
      } else {
        return valString;
      }
    },
    setTime () {
      ++this.totalSeconds;
      this.seconds = this.pad(this.totalSeconds % 60);
      this.minutes = parseInt(this.totalSeconds / 60);
    },
    counterFinish (vac) {
      const vm = this;
      vm.buttonTxt = 'Resend';
      vac.attrs.disabled = false;
    },
    myScene: function () {
      this.scene = new THREE.Scene();
      var light = new THREE.AmbientLight(0xffffff);
      var width = window.innerWidth;
      var height = window.innerHeight;
      this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
      if (this.intro) {
        this.camera.position.z = 1;
      } else {
        this.camera.position.z = 18;
      }

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize( width, height );
      document.getElementById("webgl-container").appendChild(this.renderer.domElement);
      this.clock = new THREE.Clock();
      var sLight = new THREE.SpotLight(0xffffff);
      sLight.position.set(-100, 100, 100);
      this.scene.add(sLight);
      var aLight = new THREE.AmbientLight( 0xffffff );
      this.scene.add(aLight);
      //David code
      var directionalLight = new THREE.DirectionalLight("#fff", 2);
      directionalLight.position.set(0, 50, -20);
      //Intro Strars Field
      if (this.intro) {
        let starsGeometry = new THREE.BufferGeometry();
        const vertices = [];
        const materials = [];
        for (let i = 0; i < 20000; i++) {
          const x = Math.random() * 2000 - 1000;
          const y = Math.random() * 2000 - 1000;
          const z = Math.random() * 2000 - 1000;
          vertices.push( x, y, z );
        }
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 4));
        let sprite = new THREE.TextureLoader().load(require("../assets/txtStar.png"));
        let starMaterial = new THREE.PointsMaterial({
          color: 0xaaaaaa,
          size: 5,
          map: sprite
        });
        const stars = new THREE.Points(starsGeometry, starMaterial);
        stars.position.z = -2000;
        this.scene.add(stars);
      }
      //End Intro Strars Field
      //End David code
    },
    spinner: function () {
      if (!this.intro) {
        var geometry = new THREE.BoxGeometry(1,1,1);
        var material = new THREE.MeshPhongMaterial( {color: "hotpink" } );
        var cube = new THREE.Mesh(geometry, material);
        cube.position.x = 10;
        var spinner = new THREE.Object3D();
        spinner.rotation.x = 6;
        spinner.add(cube);
        this.scene.add(spinner);
      }
    },
    randomPointSphere: function (radius) {
      if (!this.intro) {
        let theta = 2 * Math.PI * Math.random();
        let phi = Math.acos(2 * Math.random() - 1);
        let dx = 0 + (radius * Math.sin(phi) * Math.cos(theta));
        let dy = 0 + (radius * Math.sin(phi) * Math.sin(theta));
        let dz = 0 + (radius * Math.cos(phi));
        return new THREE.Vector3(dx, dy, dz);
      }
    },
    mathRandom: function (num = 1) {
      if (!this.intro) {
        var setNumber = - Math.random() * num + Math.random() * num;
        return setNumber;
      }
    },
    addHolder: function () {
      if (!this.intro) {
        this.holder = new THREE.Object3D();
        this.holder.name = "holder"
        for (var i = 0; i < this.totalTargets; i++) {
          this.geometry = new THREE.IcosahedronGeometry(1.5, 16);
          var targetTexLoader = new THREE.TextureLoader();
          var targetTexture = targetTexLoader.load(require("../assets/moon.png"));
          this.uniforms = {
            targetTex: { type: "t", value: targetTexture },
            amplitude: { value: 0.0 }
          };
          const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.vertex,
            fragmentShader: this.fragment
          });
          var cube = new THREE.Mesh(this.geometry, material);
          cube.position.x = i * 1.2 + 5;
          cube.name = "cubeName" + i;
          var spinner = new THREE.Object3D();
          spinner.rotation.x = i * 2.5 * Math.PI;
          spinner.name = "spinnerName" + i;
          spinner.add(cube);
          this.holder.add(spinner);
        }
        this.scene.add(this.holder);
        /*const pointerLoader = new THREE.TextureLoader();
        const pointerTex = pointerLoader.load(require("../assets/badge_star.png"));
        var pg = new THREE.CylinderGeometry(1, 1, 0.15, 25);
        var pm = new THREE.MeshPhongMaterial({
          map: pointerTex
        });
        this.pointer = new THREE.Mesh(pg, pm);
        this.scene.add(this.pointer);*/
        //David code
        const loader = new THREE.TextureLoader();
        const textureSphereBg = loader.load(require("../assets/sphere.jpg"));
        const txtStar = loader.load(require("../assets/txtStar.png"));
        const texture1 = loader.load(require( "../assets/star1.png" ));
        const texture2 = loader.load(require("../assets/star2.png"));
        const texture4 = loader.load(require("../assets/star3.png"));
        /* Sphere  Background */
        textureSphereBg.anisotropy = 16;
        let geometrySphereBg = new THREE.SphereBufferGeometry(150, 40, 40);
        let materialSphereBg = new THREE.MeshBasicMaterial({
          side: THREE.BackSide,
          map: textureSphereBg,
        });
        this.sphereBg = new THREE.Mesh(geometrySphereBg, materialSphereBg);
        this.scene.add(this.sphereBg);
        /* Moving Stars */
        let starsGeometry = new THREE.BufferGeometry();
        const vertices = [];
        const materials = [];
        for (let i = 0; i < 100; i++) {
          const x = Math.random() * 2000 - 1000;
          const y = Math.random() * 2000 - 1000;
          const z = Math.random() * 2000 - 1000;
          vertices.push( x, y, z );
        }
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 4));
        const parameters = [
          [[ 1.0, 0.2, 0.5 ], texture1, 20 ],
          [[ 0.95, 0.1, 0.5 ], texture2, 15 ],
          [[ 0.90, 0.05, 0.5 ], texture4, 10 ],
          [[ 0.85, 0, 0.5 ], txtStar, 8 ],
          [[ 0.80, 0, 0.5 ], texture1, 5 ]
        ];
        for ( let i = 0; i < parameters.length; i ++ ) {
          const color = parameters[i][0];
          const sprite = parameters[i][1];
          const size = parameters[i][2];
          materials[i] = new THREE.PointsMaterial({
            size: size,
            map: sprite,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
          });
          materials[i].color.setHSL(color[0], color[1], color[2]);
          const particles = new THREE.Points(starsGeometry, materials[i]);
          //particles.rotation.x = Math.random() * 6;
          //particles.rotation.y = Math.random() * 6;
          //particles.rotation.z = Math.random() * 6;
          this.scene.add(particles);
        }
        //End David code
      }
    },
    animate: function() {
      if (!this.intro) {
        //Sphere Beckground Animation
        this.sphereBg.rotation.x += 0.003;
        this.sphereBg.rotation.y += 0.001;
        this.sphereBg.rotation.z += 0.001;
      } else {
        //this.camera.rotation.x = Math.PI/2;
        this.scene.children[2].position.z += 20;
      }

      if (this.$store.state.stopRoadmap == false){
        requestAnimationFrame(this.animate);
      }
      this.render();
    },
    render: function () {
      if (!this.intro) {
        const time = Date.now() * 0.00005;
        const dTime = Date.now() * 0.001;
        this.uniforms.amplitude.value = 1.0 + Math.sin( dTime * 0.5 );
        this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
        this.camera.position.y += (- this.mouseY - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);
        for (let i = 0; i < this.scene.children.length; i++) {
          const object = this.scene.children[i];
          if (object instanceof THREE.Points) {
            object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
          }
        }
        this.holder.children.forEach(function (elem, index, array) {
          elem.rotation.y += (0.01 * (6 - index));
          elem.children[0].rotation.x += 0.01;
          elem.children[0].rotation.y += 0.01;
        });
        //this.pointer.rotation.x += 0.01;
        //this.pointer.rotation.y += 0.01;
        var delta = this.clock.getDelta();
        this.waveUniforms.time.value += delta;
        if (this.waveMesh !== null && this.waveScaleUp) {
          this.waveMesh.scale.x = this.waveMesh.scale.x + 0.1;
          this.waveMesh.scale.y = this.waveMesh.scale.y + 0.1;
          this.waveMesh.scale.z = this.waveMesh.scale.z + 0.1;
          if(this.waveMesh.scale.x > 2) {
            this.waveScaleUp = false
          }
        }
        if (this.waveMesh !== null && !this.waveScaleUp) {
          this.waveMesh.scale.x = this.waveMesh.scale.x - 0.1;
          this.waveMesh.scale.y = this.waveMesh.scale.y - 0.1;
          this.waveMesh.scale.z = this.waveMesh.scale.z - 0.1;
          if (this.waveMesh.scale.x < 0) {
            this.scene.remove(this.waveMesh);
            this.waveMesh = null;
            this.waveScaleUp = true;
          }
        }
        this.renderer.autoClear = false;
        this.renderer.clear();
        this.renderer.setScissorTest(true);
        this.renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
        this.renderer.render(this.scene, this.camera);
        const badgesParent = document.getElementById('badges-container');

        if (this.badgeScenes.length > 0 && badgesParent.hasChildNodes()) {
          for (let i = 0; i < this.badgeScenes.length; i++) {
            const badgeCont = document.getElementById('list-item' + i);
            const rect = badgeCont.getBoundingClientRect() !== null ? badgeCont.getBoundingClientRect() : false;

            if (rect !== false) {
              this.badgeScenes[i].rotation.y += 0.02;

              if (rect.bottom < 0 || rect.top > this.renderer.domElement.clientHeight ||
                rect.right < 0 || rect.left > this.renderer.domElement.clientWidth) {
                return; // it's off screen
              }
              const width = rect.right - rect.left;
              const height = rect.bottom - rect.top;
              const left = rect.left;
              const bottom = this.renderer.domElement.clientHeight - rect.bottom;
              this.renderer.clearDepth();

              if (this.badgeScenes.length > 0) {
                this.renderer.setViewport(left, bottom, width, height);
                this.renderer.setScissor(left, bottom, width, height);
                this.renderer.render(this.badgeScenes[i], this.badgeScenes[i].userData.camera);
              }
            }
          }
        }
      } else {
        this.renderer.render(this.scene, this.camera);
      }

      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.physicallyCorrectLights = true;
    },
    addExplosion: function (point) {
      //Object Explosion
      var geometry = new THREE.IcosahedronGeometry(1.5, 16);
      const numFaces = geometry.attributes.position.count / 3;
      var timeNow = this.clock.getElapsedTime();
      const tessellateModifier = new TessellateModifier(8, 6);
      geometry = tessellateModifier.modify(geometry);
      const displacement = new Float32Array(numFaces * 3 * 3);
      var targetTexLoader = new THREE.TextureLoader();
      var targetTexture = targetTexLoader.load(require("../assets/moon.png"));
      for (let f = 0; f < numFaces; f++) {
        const index = 9 * f;
        const d = 100 * (0.5 - Math.random());
        for (let j = 0; j < 3; j++) {
          displacement[index + (3 * j)] = d;
          displacement[index + (3 * j) + 1] = d;
          displacement[index + (3 * j) + 2] = d;
        }
      }
      geometry.setAttribute('displacement', new THREE.BufferAttribute(displacement, 3));
      this.uniforms = {
        targetTex: { type: "t", value: targetTexture },
        amplitude: { value: 0.0 }
      };
      const material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: this.vertex,
        fragmentShader: this.fragment,
        opacity: 0.7,
        transparent: true
      });
      var part = new THREE.Mesh(geometry, material);
      part.position.x = point.x;
      part.position.y = point.y;
      part.position.z = point.z;
      this.scene.add(part);

      setTimeout(() => {
        this.scene.remove(part);
      }, 15000);

      //End of Object Explosion
      //Waves
      var waveGeo = new THREE.IcosahedronGeometry(5, 40);
      var waveMat = new THREE.ShaderMaterial({
        uniforms: this.waveUniforms,
        vertexShader: this.waveVertex,
        fragmentShader: this.waveFragment,
        side: THREE.DoubleSide
      });
      this.waveUniforms.time.value = .00025 * (Date.now() - this.waveStart);
      this.waveMesh = new THREE.Mesh(waveGeo, waveMat);
      this.waveMesh.scale.x = 0;
      this.waveMesh.scale.y = 0;
      this.waveMesh.scale.z = 0;
      this.waveMesh.name = "wave0";
      this.scene.add(this.waveMesh);
      //End of Waves
    },
    onDocumentMouseDown: function(event) {
      event.preventDefault();
      if (!this.intro) {
        if (this.complete) {
          this.complete = false;
          this.score = 0;
          this.restartScene();
          return;
        }
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        // update the picking ray with the camera and mouse position
        let raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(this.mouse, this.camera);
        if (this.score < this.totalTargets) {
          let addExplosion = this.addExplosion;
          let score = this.score;
          let totalTargets = this.totalTargets;
          let myScore = this.myScore;
          let complete = this.complete;
          let level = this.level;
          let totalLevels = this.totalLevels;
          let bScenes = this.badgeScenes;
          let bScene = this.badgeScene;
          let bGeo = this.badgeGeo;
          let bMat = this.badgeMat;
          let bMesh = this.badgeMesh;
          let bCamera = this.badgeCamera;
          let bIndex = 0;
          this.holder.children.forEach(function (elem, index, array) {
            let intersects = raycaster.intersectObjects(elem.children);
            if (intersects.length > 0 && intersects[0].object.visible) {
              intersects[0].object.visible = false;
              addExplosion(intersects[0].point);
              score += 1;
              if (score < totalTargets) {
                // myScore.innerHTML = "<span class='hit'>HIT!</span> Score: " + score + "/" + totalTargets;
                console.log(score)
              } else {
                complete = true;
                let badgeTextures = [
                  require("../assets/badge_star.png"),
                  require("../assets/badge_star2.png"),
                  require("../assets/badge_star3.png"),
                  require("../assets/badge_star4.png")
                ];
                if (level == 1) {
                  bIndex = 1;
                } else if (level == 2) {
                  bIndex = 2;
                } else if (level == 3) {
                  bIndex = 3;
                } else if (level == 4) {
                  bIndex = 4;
                }
                const bContainer = document.getElementById('badges-container');
                bContainer.querySelectorAll('*').forEach(n => n.remove());
                bScenes = [];
                for (let i = 0; i < bIndex; i++) {
                  bScene = new THREE.Scene();
                  const bEl = document.createElement('div');
                  bEl.id = 'list-item' + i;
                  bEl.style.setProperty('width', '60px');
                  bEl.style.setProperty('height', '60px');

                  bScene.userData.element = bEl;
                  bContainer.appendChild(bEl);

                  bGeo = new THREE.CylinderGeometry(1, 1, 0.15, 25);
                  //bCamera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 1, 100);
                  bCamera = new THREE.PerspectiveCamera(50, 1, 1, 10);
                  //bCamera.position.set(0,0,5);
                  //bCamera.lookAt(bScene.position);
                  bCamera.position.z = 4;
                  bScene.userData.camera = bCamera;
                  const controls = new OrbitControls(bScene.userData.camera, bScene.userData.element);
                  controls.minDistance = 2;
                  controls.maxDistance = 5;
                  controls.enablePan = false;
                  controls.enableZoom = true;
                  bScene.userData.controls = controls;
                  const badgeLoader = new THREE.TextureLoader();
                  const badgeTex = badgeLoader.load(badgeTextures[i]);
                  bMat = new THREE.MeshBasicMaterial({
                    roughness: 0.5,
                    metalness: 1,
                    map: badgeTex
                  });
                  bMesh = new THREE.Mesh(bGeo, bMat);
                  bMesh.rotation.z = Math.PI / 2;
                  bMesh.rotation.y = Math.PI / 2;
                  bScene.add(bMesh);
                  bScene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444));
                  bScene.name = "warior" + i;
                  const blight = new THREE.DirectionalLight(0xffffff, 0.5);
                  blight.position.set(1, 1, 1);
                  bScene.add(blight);
                  bScenes.push(bScene);
                }
                if (level < totalLevels) {
                  // myScore.innerHTML = "<strong>You got 'em all!</strong> Click the screen for level "  + (level+1) + ".";
                  console.log(level+1)
                } else {
                  // myScore.innerHTML = "<strong>You win!</strong> Click the screen to play again.";
                  console.log("You win!  Click the screen to play again.")
                }
              }
            }
          });
          this.badgeIndex = bIndex;
          this.score = score;
          this.totalTargets = totalTargets;
          this.myScore = myScore;
          this.complete = complete;
          this.level = level;
          this.totalLevels = totalLevels;
          this.badgeScenes = bScenes;
          this.badgeScene = bScene;
          this.badgeGeo = bGeo;
          this.badgeMat = bMat;
          this.badgeMesh = bMesh;
          this.badgeCamera = bCamera;
        }
      }
    },
    drawCurve: function (vectors) {
      if (vectors.length > 3) {
        const curve = new THREE.CatmullRomCurve3(vectors);
        var curvePoints = curve.getPoints(100);
        const cMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setRGB(Math.random(), Math.random(), Math.random()),
          opacity: 1,
          transparent: true,
          depthTest: false
        });
        const cGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
        const cMesh = new THREE.Line(cGeo, cMat);

        const glowG = new THREE.TubeGeometry(curve, 100, 0.2, 8, false);
        const glowM = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setRGB(Math.random(), Math.random(), Math.random()),
          opacity: 0.25,
          transparent: true,
          depthTest: false
        });
        const glowMesh = new THREE.Mesh(glowG, glowM);
        cMesh.add(glowMesh);
        cMesh.name = 'pointer_glow';
        this.scene.add(cMesh);

        if (this.vectors.length > 50) {
          this.vectors = [];
        }
      }

      setTimeout(() => {
        this.removeCurve();
      }, 500);
    },
    removeCurve: function () {
      let curve = this.scene.getObjectByName('pointer_glow');
      this.scene.remove(curve);
    },
    restartScene: function () {
      // this.myScore.innerHTML = "";
      if (this.level < this.totalLevels) {
        this.speed += 0.005;
        this.totalTargets += 1;
        this.level += 1;
      } else {
        this.speed = 0.01;
        this.totalTargets = 3;
        this.level = 1;
      }
      this.badgeAnimation = false;
      console.log(this.comments[this.level-1] +  ": Level " + this.level + " of " + this.totalLevels)
      this.animateText = true
      setTimeout(() => {
        this.commentNow = this.comments[this.level-1];
        this.playerStatusNow = this.playerStatuses[this.level-1];
      },1500)
      setTimeout(() => {
        this.animateText = false
      },2500)
      this.scene.remove(this.holder);
      this.scene.remove(this.sphereBg);
      //this.scene.remove(this.pointer);
      if (this. level == 1) {
        this.badgeScenes = [];
      }
      this.addHolder();
    },
    onWindowResize: function() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.render();
    },
    onPointerMove: function (event) {
      if (event.isPrimary === false) return;

      if (!this.intro) {
        this.pointerMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointerMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.mouseX = event.clientX - this.windowHalfX;
        this.mouseY = event.clientY - this.windowHalfY;
        let vector = new THREE.Vector3(this.pointerMouse.x, this.pointerMouse.y, 0.5);
        vector.unproject(this.camera);
        let dir = vector.sub(this.camera.position).normalize();
        let distance = -this.camera.position.z / dir.z;
        let pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
        //this.pointer.position.copy(pos);
        this.vectors.push(pos);
        this.drawCurve(this.vectors);
      }
    }
  },
  mounted() {
    // firstAnimation
    setInterval(this.setTime, 1000);
    document.getElementById("webgl-container").addEventListener('mousedown', this.onDocumentMouseDown, false);
    document.body.addEventListener('pointermove', this.onPointerMove);
    this.$store.commit('setHeader', false)
    // this.myLevel.innerText = this.comments[this.level-1] +  ": Level " + this.level + " of " + this.totalLevels;


    const promise = new Promise((resolve, reject) => {
      resolve (this.myScene())
    });
    promise.then((value) => {
      this.addHolder();
    });
    promise.then((value) => {
      this.$store.commit('stopRoadmap', false)
      this.animate();
    });
    window.addEventListener( 'resize', this.onWindowResize, false );
    setTimeout(() => {
      this.intro = false;
      this.scene.remove(this.scene.children[2]);
      this.addHolder();
      this.gameStart = true;
    }, 3000);
  },
  beforeDestroy () {
    this.$store.commit('stopGalaxyGarbage', true)
  },
  watch: {
    'badgeIndex': function () {
      if(this.badgeIndex == 4){
        this.statistic = true;
        console.log(this.badgeIndex)
      }
      if(this.badgeIndex !== 4 && this.oldBadgeIndex + 1 == this.badgeIndex){
        this.oldBadgeIndex++;
        this.badgeAnimation = true;
      }
    },
    '$store.state.stopGalaxyGarbage': function () {
      if (this.$store.state.stopGalaxyGarbage == false) {
        this.animate();
      }
    }
  }
}
</script>

<style scoped>
  .start-timer{
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  }
  .explore-button__text{
    text-transform: uppercase;
  }
  .explore-button{
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0px 47px;
    border: 1px solid rgba(255, 255, 255, .1);
    margin-right: auto;
    position: relative;
    cursor: pointer;
  }
  .explore-button span:nth-child(1){
    top: -1px;
    left: -1px;
    border-left: 1px solid #8785FF;
    border-top: 1px solid #8785FF;
  }
  .explore-button span:nth-child(2){
    top: -1px;
    right: -1px;
    border-right: 1px solid #8785FF;
    border-top: 1px solid #8785FF;
  }
  .explore-button span:nth-child(3){
    bottom: -1px;
    right: -1px;
    border-right: 1px solid #8785FF;
    border-bottom: 1px solid #8785FF;
  }
  .explore-button span:nth-child(4){
    bottom: -1px;
    left: -1px;
    border-left: 1px solid #8785FF;
    border-bottom: 1px solid #8785FF;
  }
  .explore-button span{
    height: 9px;
    width: 9px;
    position: absolute;
  }
  .timer-col{
    font-size: 50px;
    line-height: 60px;
  }
  .timer{
    display: flex;
  }
  .hud p{

  }
  .level__container{
    display: flex;
    flex-direction: column;
    transition: 1s cubic-bezier(.79,.01,.15,.99);
    transition-delay: .6s;
  }
  .level__container-outer{
    height: 60px;
    overflow: hidden;
  }
  .level__num{
    font-size: 50px;
    line-height: 60px;
    color: #fff;
  }
  /*coin css*/
  .next-lvl__container{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100vh;
    z-index: 1000000;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    background: rgba(135, 133, 255, .4);
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    opacity: 0;
  }
  .action-container.active .next-lvl__container{
    opacity: 1;
    transition-delay: 2s;
  }
  .animation-container img{
    transform: scale(1.5);
  }
  .action-container{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100vh;
    z-index: 1000000;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
  }
  .statistic-container.active{
    pointer-events: all;
    opacity: 1;
  }
  .statistic-container{
    pointer-events: none;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100vh;
    z-index: 1000000;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(135, 133, 255, .4);
    opacity: 0;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
  }
  .statistic-container__inner{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .statistic-container__inner .explore-button{
    margin-left: auto;
    margin-top: 30px;
  }
  .animation-container {
    display: relative;
    width : 200px;
    height : 300px;
  }

  .container {
    position: relative;
    top: 180px;
    left: -18px;
    height: 250px;
    width: 250px;
  }
  .y-axis-container{
    opacity: 0;
  }
  .action-container.active .y-axis-container{
    animation: bounce 2.5s ease-in-out;
  }
  .y-axis-container .container{
    padding: 0px!important;
  }
  @keyframes bounce {
    0% {
      animation-timing-function: ease-out;
      opacity: 0;
    }
    20% {
      animation-timing-function: ease-out;
      transform: translateY(-160px);
      opacity: 1;
    }

    50% {
      animation-timing-function: ease-out;
      transform: translateY(-180px);
    }
    90%{
      opacity: 0;
    }
    100% {
      animation-timing-function: ease-out;
      opacity: 0;
      transform: translateY(-180px);
    }
  }

  @keyframes scaling {
    20% {
      transform: scale(0.6);
    }

    50% {
      transform: scale(0.5);
    }
  }

  @keyframes flash {
    0% {
      transform : rotate(0deg) scale(0);
    }
    8% {
      transform : rotate(0deg) scale(0);
    }
    10% {
      transform : rotate(150deg) scale(1.8);
    }
    15% {
      transform : rotate(45deg) scale(0);
    }
    100% {
      transform : rotate(45deg) scale(0);
    }
  }


  @keyframes shine {
    20% {
      transform : rotate(25deg) translateY(400px);
    }

    100% {
      transform : rotate(25deg) translateY(400px);
    }
  }
  /*coin css end*/
  #badges-container {
    width: 240px;
    height: 70px;
    z-index: 10000000;
    display: flex;
    justify-content: flex-end;
  }
  #list-item0,
  #list-item1,
  #list-item2,
  #list-item3 {
    width: 25%;
    height: 100%;
  }
  .badges{
    display: flex;
  }
  body {
    margin: 0;
    padding: 0;
    color: #333;
    font-family: helvetica;
  }
  canvas {
    position: absolute;
  }
  .hud {
    position: absolute;
    display: flex;
    flex-direction: column;
    right: 40px;
    align-items: flex-end;
    top: 40px;
  }
  .hud__inner{
    flex-direction: column;
    display: flex;
    align-items: flex-end;
    font-size: 18px;
    margin-bottom: 15px;
    color: #ABB0BC;
    transition: .6s cubic-bezier(.79,.01,.15,.99);
    transform: translateY(10px);
    opacity: 0;
  }
  .hud__inner:nth-child(2){
    transition-delay: .1s;
  }
  .hud__inner:nth-child(3){
    transition-delay: .2s;
  }
  .hud__inner:nth-child(4){
    transition-delay: .3s;
  }
  .hud__inner:nth-child(5){
    transition-delay: .4s;
  }
  .game__container.active .hud__inner{
    transform: translateY(0px);
    opacity: 1;
  }
  .word-animation{
    display: flex;
  }
  .hud__inner span{
    font-size: 50px;
    line-height: 60px;
    color: #fff;
    transition: 1s;
  }
  .changeText{
    transform: rotate3d(0, 2, 0,170deg);
    opacity: 0;
  }
  @keyframes changeText {
    0% {
      animation-timing-function: ease-out;
      transform: rotate3d(0, 2, 0,0deg);
      opacity: 1;
    }
    25% {
      animation-timing-function: ease-in;
      transform: rotate3d(0, 2, 0,170deg);
      opacity: 0;
    }

    50% {
      animation-timing-function: ease-in;
      transform: rotate3d(0, 2, 0,170deg);
    }
    75%{
      animation-timing-function: ease-out;
      transform: rotate3d(0, 2, 0,170deg);
      opacity: 0;
    }
    100% {
      animation-timing-function: ease-out;
      transform: rotate3d(0, 2, 0,0deg);
      opacity: 1;
    }
  }
  .game__container{
    position: fixed;
    z-index: 10000;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    width: 100%;
    height: 100vh;
  }
  .hit {
    font-weight: bold;
    color: red;
  }
</style>
