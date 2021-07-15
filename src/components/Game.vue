<template>
  <div :style="{
    backgroundImage: 'url(' + require(`@/assets/space.jpg`) + ')',
    backgroundSize: 'cover'
    }"
  >
    <div class="hud">
      <h1 id="level"></h1>
      <p>Click on the boxes to make them go away!</p>
      <p id="score"></p>
    </div>

    <div id="webgl-container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

export default {
  name: 'ThreeTest',
  data () {
    return {
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
      comments: ['Easy', 'Tricky', 'Careful now', 'INSANITY'],
      myLevel: document.getElementById('level'),
      myScore: document.getElementById('score'),
      mouse: new THREE.Vector2(),
      sphereBg: null,
      mouseX: 0, 
      mouseY: 0,
			windowHalfX: window.innerWidth / 2,
			windowHalfY: window.innerHeight / 2,
      tMath: THREE.Math,
      conf: {
        n: 7,
        objectWidth: 0.1,
        objectMargin: 0.5,
        minIntensity: 0.02,
        maxIntensity: 0.8,
        color: 0x707070,
        randomColor: true,
        emissiveColor: 0xff3030,
        randomEmissiveColor: false
      },
      pointerMeshes: [],
      maxLength: null,
      mouseOver: true,
      pointer: new THREE.Vector2(),
      pointerPlane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
      pointerPosition: new THREE.Vector3(),
      raycaster: new THREE.Raycaster()
    }
  },
  methods: {
    myScene: function () {
      this.scene = new THREE.Scene();
      var light = new THREE.AmbientLight(0xffffff);
      var width = window.innerWidth;
      var height = window.innerHeight;
      this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
      this.camera.position.z = 18;

      this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
      this.renderer.setSize( width, height );
      document.getElementById("webgl-container").appendChild(this.renderer.domElement);
      this.clock = new THREE.Clock();

      var sLight = new THREE.SpotLight( 0xffffff );
      sLight.position.set( -100, 100, 100 );
      this.scene.add(sLight);

      var aLight = new THREE.AmbientLight( 0xffffff );
      this.scene.add(aLight);
      //David code
      var directionalLight = new THREE.DirectionalLight("#fff", 2);
      directionalLight.position.set(0, 50, -20);
      this.scene.add(directionalLight);

      this.maxLength = (new THREE.Vector3(1, 1, 1)).multiplyScalar((this.conf.n * (this.conf.objectWidth + this.conf.objectMargin)) / 2).length();
      let geo = new THREE.BoxBufferGeometry(this.conf.objectWidth, this.conf.objectWidth, this.conf.objectWidth);
      let pos = new THREE.Vector3();
      let color, emissive;
      for (let i = 0; i < this.conf.n; i++) {
        for (let j = 0; j < this.conf.n; j++) {
          for (let k = 0; k < this.conf.n; k++) {
            color = this.conf.randomColor ? this.conf.color : this.conf.color;
            emissive = this.conf.randomEmissiveColor ? this.conf.emissiveColor : this.conf.emissiveColor;
            let mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color, emissive, emissiveIntensity: 0 }));
            pos.x = (-this.conf.n / 2 + i) * (this.conf.objectWidth + this.conf.objectMargin);
            pos.y = (-this.conf.n / 2 + j) * (this.conf.objectWidth + this.conf.objectMargin);
            pos.z = (-this.conf.n / 2 + k) * (this.conf.objectWidth + this.conf.objectMargin);
            mesh.rotation.set(0, Math.PI/4, Math.PI/4);
            mesh.destination = pos.clone();
            mesh.vcoef = 0.05 - pos.length() * ((0.05 - 0.005) / this.maxLength);
            this.pointerMeshes.push(mesh);
            this.scene.add(mesh);
          }
        }
      }
      //End David code
    },
    initGUI: function () {
      const gui = new GUI();
      gui.add(this.conf, 'n', 2, 16, 1).onChange(this.myScene);
      gui.add(this.conf, 'objectWidth', 1, 20, 0.5).onChange(this.myScene);
      gui.add(this.conf, 'objectMargin', 0, 10, 0.5).onChange(this.myScene);
      gui.add(this.conf, 'maxIntensity', this.conf.minIntensity, 1, 0.1);
      gui.add(this.conf, 'randomColor').listen().onChange(this.myScene);
      gui.addColor(this.conf, 'color').onChange(v => { conf.randomColor = false; this.myScene(); });
      gui.add(this.conf, 'randomEmissiveColor').listen().onChange(this.myScene);
      gui.addColor(this.conf, 'emissiveColor').onChange(v => { this.conf.randomEmissiveColor = false; this.myScene(); });
      gui.close();
    },
    spinner: function () {
      var geometry = new THREE.BoxGeometry(1,1,1);
      var material = new THREE.MeshPhongMaterial( {color: "hotpink", ambient: "hotpink" } );

      var cube = new THREE.Mesh(geometry, material);
      cube.position.x = 10;
      var spinner = new THREE.Object3D();
      spinner.rotation.x = 6;

      spinner.add(cube);
      this.scene.add(spinner);
    },
    randomPointSphere: function (radius) {
      let theta = 2 * Math.PI * Math.random();
      let phi = Math.acos(2 * Math.random() - 1);
      let dx = 0 + (radius * Math.sin(phi) * Math.cos(theta));
      let dy = 0 + (radius * Math.sin(phi) * Math.sin(theta));
      let dz = 0 + (radius * Math.cos(phi));
      return new THREE.Vector3(dx, dy, dz);
    },
    addHolder: function () {
      this.holder = new THREE.Object3D();
      this.holder.name = "holder"

      for (var i = 0; i < this.totalTargets; i++) {
        var ranCol = new THREE.Color();
        ranCol.setRGB( Math.random(), Math.random(), Math.random() );

        var geometry = new THREE.BoxGeometry(2,2,2);
        var material = new THREE.MeshPhongMaterial({
          color: ranCol, 
          ambient: ranCol
        });

        var cube = new THREE.Mesh(geometry, material);
        cube.position.x = i * 5;
        cube.name = "cubeName" + i;

        var spinner = new THREE.Object3D();
        spinner.rotation.x = i*2.5*Math.PI;
        spinner.name = "spinnerName" + i;

        spinner.add(cube);
        this.holder.add(spinner);
      };
      this.scene.add(this.holder);

      //David code
      const loader = new THREE.TextureLoader();
      const textureSphereBg = loader.load(require("../assets/sphere.jpeg"));
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

      for (let i = 0; i < 1000; i++) {
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;

        vertices.push( x, y, z );
			}

      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

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

        particles.rotation.x = Math.random() * 6;
        particles.rotation.y = Math.random() * 6;
        particles.rotation.z = Math.random() * 6;

        this.scene.add(particles);
			}
      this.mouseOver = false;
      //End David code
    },
    animate: function() {
      //Sphere Beckground Animation
      this.sphereBg.rotation.x += 0.005;
      this.sphereBg.rotation.y += 0.002;
      this.sphereBg.rotation.z += 0.002;

      let origin = this.pointerPosition;
      if (!this.mouseOver) {
        const time = Date.now() * 0.001;
        const d = this.maxLength * 0.7;
        origin = new THREE.Vector3();
        origin.x = Math.sin(time * 0.9) * d;
        origin.y = Math.cos(time * 1.2) * d;
        origin.z = Math.cos(time * 0.7) * d;
      }

      let mesh, dv, d;
      for (let i = 0; i < this.pointerMeshes.length; i++) {
        mesh = this.pointerMeshes[i];
        dv = mesh.destination.clone().add(origin).sub(mesh.position);
        d = dv.length();
        dv.normalize().multiplyScalar(d * mesh.vcoef);
        mesh.position.add(dv);
        mesh.material.emissiveIntensity = this.tMath.clamp(40 * dv.length() / this.maxLength, this.conf.minIntensity, this.conf.maxIntensity);
      }

      //Stars  Animation
      requestAnimationFrame( this.animate );
      this.render();
    },
    render: function () {
      const time = Date.now() * 0.00005;

      this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
			this.camera.position.y += (- this.mouseY - this.camera.position.y) * 0.05;

			this.camera.lookAt(this.scene.position);

      for (let i = 0; i < this.scene.children.length; i++) {
        const object = this.scene.children[ i ];

        if ( object instanceof THREE.Points ) {
          object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
        }
			}

      this.holder.children.forEach(function (elem, index, array) {
        elem.rotation.y += (0.01 * (6 - index));
        elem.children[0].rotation.x += 0.01;
        elem.children[0].rotation.y += 0.01;
      });
      let scene = this.scene;
      let particles = this.particles;
      if (this.particles.length > 0) {
        let clock = this.clock.getElapsedTime()
        this.particles.forEach(function (elem, index, array) {
          switch (elem.name) {
            case "part0":
              elem.position.x += 1;
              break;
            case "part1":
              elem.position.x -= 1;
              break;
            case "part2":
              elem.position.y += 1;
              break;
            case "part3":
              elem.position.y -= 1;
              break;
            default:
              break;
          }

          if (elem.birthDay - clock < -1 ) {
            scene.remove(elem);
            particles.splice(index, 1);
          }
        })
        this.scene = scene;
        this.particles = particles;
      };
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.render(this.scene, this.camera);
    },
    addExplosion: function (point) {
      var timeNow = this.clock.getElapsedTime();

      for (var i = 0; i < 4; i++) {
        var geometry = new THREE.BoxGeometry(1,1,1);
        var material = new THREE.MeshBasicMaterial({color: 0x999999});
        var part = new THREE.Mesh(geometry, material);
        part.position.x = point.x;
        part.position.y = point.y;
        part.position.z = point.z;
        part.name = "part" + i;
        part.birthDay = timeNow;
        this.scene.add(part);
        this.particles.push(part);
      };
    },
    onDocumentMouseDown: function(event) {
      event.preventDefault();

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
      let raycaster = new THREE.Raycaster()
      raycaster.setFromCamera( this.mouse, this.camera );

      if (this.score < this.totalTargets) {
        let addExplosion = this.addExplosion;
        let score = this.score;
        let totalTargets = this.totalTargets;
        let myScore = this.myScore;
        let complete = this.complete;
        let level = this.level;
        let totalLevels = this.totalLevels;
        this.holder.children.forEach(function (elem, index, array) {
          let intersects = raycaster.intersectObjects( elem.children );
          if (intersects.length > 0 && intersects[0].object.visible) {
            intersects[0].object.visible = false;

            addExplosion(intersects[0].point);
            score += 1;

            if (score < totalTargets) {
              // myScore.innerHTML = "<span class='hit'>HIT!</span> Score: " + score + "/" + totalTargets;
              console.log(score)
            } else {
              complete = true;

              if (level < totalLevels) {
                // myScore.innerHTML = "<strong>You got 'em all!</strong> Click the screen for level "  + (level+1) + ".";
                console.log(level+1)
              } else {
               // myScore.innerHTML = "<strong>You win!</strong> Click the screen to play again.";
                console.log("You win!  Click the screen to play again.")
              }
            };
          }
        });
        this.score = score;
        this.totalTargets = totalTargets;
        this.myScore = myScore;
        this.complete = complete;
        this.level = level;
        this.totalLevels = totalLevels;
      }
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

      // this.myLevel.innerText = this.comments[level-1] +  ": Level " + this.level + " of " + this.totalLevels;
      console.log(this.comments[this.level-1] +  ": Level " + this.level + " of " + this.totalLevels)
      this.scene.remove(this.holder);
      this.addHolder();
    },
    onWindowResize: function() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize( window.innerWidth, window.innerHeight );

      this.render();
    },
    onPointerMove: function (event) {
      if (event.isPrimary === false) return;

      this.mouseX = event.clientX - this.windowHalfX;
      this.mouseY = event.clientY - this.windowHalfY;

      const v = new THREE.Vector3();
      this.camera.getWorldDirection(v);
      v.normalize();
      this.pointerPlane.normal = v;

      this.mouseOver = true;

      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.camera);
      this.raycaster.ray.intersectPlane(this.pointerPlane, this.pointerPosition);
		}
  },
  mounted() {
    document.getElementById("webgl-container").addEventListener('mousedown', this.onDocumentMouseDown, false);
    document.body.addEventListener('pointermove', this.onPointerMove);

    // this.myLevel.innerText = this.comments[this.level-1] +  ": Level " + this.level + " of " + this.totalLevels;
    this.myScene();
    this.initGUI();
    this.addHolder();
    this.animate();

    window.addEventListener( 'resize', this.onWindowResize, false );
  }
}
</script>

<style scoped>
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
    margin-left: 1em;
  }

  .hit {
    font-weight: bold;
    color: red;
  }
</style>
