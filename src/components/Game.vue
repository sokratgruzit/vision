<template>
  <div class="game__container" :style="{
    backgroundImage: 'url(' + require(`@/assets/space.jpg`) + ')',
    backgroundSize: 'cover'
    }"
  >
    <div class="hud">
      <p>Level<span>{{level}}</span></p>
      <p>Difficult<span>{{this.commentNow}}</span></p>
      <p>Time<span>0:19</span></p>
      <p>My Score<span>{{this.score}}</span></p>
    </div>

    <div id="webgl-container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { TessellateModifier } from 'three/examples/jsm/modifiers/TessellateModifier.js';
const TWEEN = require('@tweenjs/tween.js');

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
      commentNow: 'Easy',
      comments: ['Easy', 'Tricky', 'Careful now', 'INSANITY'],
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
      vertex: "uniform float amplitude;attribute vec3 customColor;attribute vec3 displacement;varying vec3 vNormal;varying vec3 vColor;void main() {vNormal = normal;vColor = customColor;vec3 newPosition = position + normal * amplitude * displacement;gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );}",
      fragment: "varying vec3 vNormal;varying vec3 vColor;void main() {const float ambient = 0.4;vec3 light = vec3( 1.0 );light = normalize( light );float directional = max( dot( vNormal, light ), 0.0 );gl_FragColor = vec4( ( directional + ambient ) * vColor, 1.0 );}",
      waveVertex: `
      varying vec2 vUv;
      void main()
      {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }`,
      waveFragment: `
      uniform sampler2D baseTexture;
      uniform float baseSpeed;
      uniform sampler2D noiseTexture;
      uniform float noiseScale;
      uniform float alpha;
      uniform float time;

      varying vec2 vUv;
      void main()
      {
        vec2 uvTimeShift = vUv + vec2( -0.7, 1.5 ) * time * baseSpeed;
        vec4 noiseGeneratorTimeShift = texture2D( noiseTexture, uvTimeShift );
        vec2 uvNoiseTimeShift = vUv + noiseScale * vec2( noiseGeneratorTimeShift.r, noiseGeneratorTimeShift.b );
        vec4 baseColor = texture2D( baseTexture, uvNoiseTimeShift );

        baseColor.a = alpha;
        gl_FragColor = baseColor;
      }`,
      waveUniforms: {
        baseTexture: 	{ type: "t", value: new THREE.TextureLoader().load(require("../assets/sphere.jpeg"))},
        baseSpeed: 		{ type: "f", value: 0.05 },
        noiseTexture: 	{ type: "t", value: new THREE.TextureLoader().load(require("../assets/cloud.png"))},
        noiseScale:		{ type: "f", value: 0.5337 },
        alpha: 			{ type: "f", value: 1.0 },
        time: 			{ type: "f", value: 1.0 }
      }
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

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
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
      //End David code
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
    mathRandom: function (num = 1) {
      var setNumber = - Math.random() * num + Math.random() * num;
      return setNumber;
    },
    addHolder: function () {
      this.holder = new THREE.Object3D();
      this.holder.name = "holder"

      for (var i = 0; i < this.totalTargets; i++) {
        this.geometry = new THREE.IcosahedronGeometry(1,0);
        const numFaces = this.geometry.attributes.position.count / 3;
				const colors = new Float32Array( numFaces * 3 * 3 );
        var color = new THREE.Color();
        var lo = new THREE.TextureLoader();
        var texture = lo.load(require("../assets/sphere.jpeg"));

        /*var material = new THREE.MeshPhongMaterial({
          color: ranCol,
          ambient: ranCol,
          wireframe: true
        });*/

        for (let f = 0; f < numFaces; f++) {
          const index = 9 * f;
          const h = 0.2 * Math.random();
					const s = 0.5 + 0.5 * Math.random();
					const l = 0.5 + 0.5 * Math.random();

					color.setHSL(h, s, l);

          for (let j = 0; j < 3; j++) {
            colors[index + (3 * j)] = color.r;
						colors[index + (3 * j) + 1] = color.g;
						colors[index + (3 * j) + 2] = color.b;
          }
        }

        this.geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));

        this.uniforms = {
          texture:		 { type: "t", value: texture},
					amplitude: { value: 0.0 }
				};

        const material = new THREE.ShaderMaterial({
					uniforms: this.uniforms,
					vertexShader: this.vertex,
					fragmentShader: this.fragment
				});

        var cube = new THREE.Mesh(this.geometry, material);
        cube.position.x = i * 5;
        cube.name = "cubeName" + i;

        var spinner = new THREE.Object3D();
        spinner.rotation.x = i*2.5*Math.PI;
        spinner.name = "spinnerName" + i;

        spinner.add(cube);
        this.holder.add(spinner);
      }
      this.scene.add(this.holder);
      var rC = new THREE.Color();
      rC.setRGB(Math.random(), Math.random(), Math.random());
      var pg = new THREE.IcosahedronGeometry(1,0);
      var pm = new THREE.MeshPhongMaterial({
        color: rC,
        ambient: rC
      });

      this.pointer = new THREE.Mesh(pg, pm);
      this.scene.add(this.pointer);

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
    },
    animate: function() {
      //Sphere Beckground Animation

      this.sphereBg.rotation.x += 0.003;
      this.sphereBg.rotation.y += 0.001;
      this.sphereBg.rotation.z += 0.001;

      requestAnimationFrame(this.animate)
      this.render();
    },
    render: function () {
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

      this.pointer.rotation.x += 0.01;
      this.pointer.rotation.y += 0.01;

      var delta = this.clock.getDelta();
	    this.waveUniforms.time.value += delta;

      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.physicallyCorrectLights = true;
      this.renderer.render(this.scene, this.camera);
    },
    addExplosion: function (point) {
      //Object Explosion
      var geometry = new THREE.IcosahedronGeometry(1,0);
      const numFaces = geometry.attributes.position.count / 3;
      const colors = new Float32Array(numFaces * 3 * 3);
      var color = new THREE.Color();
      var timeNow = this.clock.getElapsedTime();

      const tessellateModifier = new TessellateModifier(8, 6);
			geometry = tessellateModifier.modify(geometry);
			const displacement = new Float32Array(numFaces * 3 * 3);

      for (let f = 0; f < numFaces; f++) {
        const index = 9 * f;
        const h = 0.2 * Math.random();
        const s = 0.5 + 0.5 * Math.random();
        const l = 0.5 + 0.5 * Math.random();

        color.setHSL(h, s, l);
        const d = 50 * (0.5 - Math.random());

        for (let j = 0; j < 3; j++) {
          colors[index + (3 * j)] = color.r;
          colors[index + (3 * j) + 1] = color.g;
          colors[index + (3 * j) + 2] = color.b;

          displacement[index + (3 * j)] = d;
					displacement[index + (3 * j) + 1] = d;
					displacement[index + (3 * j) + 2] = d;
        }
      }

      geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('displacement', new THREE.BufferAttribute(displacement, 3));

      this.uniforms = {
				amplitude: { value: 0.0 }
			};

      const material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: this.vertex,
        fragmentShader: this.fragment
      });

      var part = new THREE.Mesh(geometry, material);
      part.position.x = point.x;
      part.position.y = point.y;
      part.position.z = point.z;
      part.name = "part0";
      part.birthDay = timeNow;
      this.scene.add(part);
      //End of Object Explosion

      //Waves
      var waveGeo = new THREE.PlaneGeometry(10, 10);
      var waveMat = new THREE.ShaderMaterial({
        uniforms: this.waveUniforms,
        vertexShader: this.waveVertex,
        fragmentShader: this.waveFragment,
        side: THREE.DoubleSide
      });

      var waveMesh = new THREE.Mesh( waveGeo, waveMat );
      this.scene.add( waveMesh );
      //End of Waves
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
      this.commentNow = this.comments[this.level-1];
      this.scene.remove(this.holder);
      this.scene.remove(this.pointer);
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

      this.pointerMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	    this.pointerMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      this.mouseX = event.clientX - this.windowHalfX;
      this.mouseY = event.clientY - this.windowHalfY;

      let vector = new THREE.Vector3(this.pointerMouse.x, this.pointerMouse.y, 0.5);
      vector.unproject(this.camera);
      let dir = vector.sub(this.camera.position).normalize();
      let distance = -this.camera.position.z / dir.z;
      let pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
      this.pointer.position.copy(pos);
		}
  },
  mounted() {
    document.getElementById("webgl-container").addEventListener('mousedown', this.onDocumentMouseDown, false);
    document.body.addEventListener('pointermove', this.onPointerMove);

    // this.myLevel.innerText = this.comments[this.level-1] +  ": Level " + this.level + " of " + this.totalLevels;
    this.myScene();
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
    display: flex;
    flex-direction: column;
    right: 80px;
    align-items: flex-end;
    top: 170px;
  }
  .hud p{
    flex-direction: column;
    display: flex;
    align-items: flex-end;
    font-size: 18px;
    margin-bottom: 30px;
    color: #ABB0BC;
  }
  .hud p span{
    color: #FF7152;
    font-size: 50px;
    line-height: 60px;
    color: #fff;
  }
  .game__container{
    position: relative;
  }

  .hit {
    font-weight: bold;
    color: red;
  }
</style>
