<template>
  <div id="galaxy-container"></div>
</template>

<script>
  import * as THREE from 'three';
  import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
  import { TessellateModifier } from 'three/examples/jsm/modifiers/TessellateModifier.js';
  import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
  const TWEEN = require('@tweenjs/tween.js');
  import { galaxy_vertex, text_vertex } from '../assets/shaders/vertex.js';
  import { galaxy_fragment } from '../assets/shaders/fragment.js';

  export default {
    name: 'MainSlide',
    data () {
      return {
        requestAnimation: null,
        scene: null,
        galaxyMesh: null,
        camera: null,
        renderer: null,
        controls: null,
        clock: null,
        mouse: new THREE.Vector2(),
        raycaster: new THREE.Raycaster(),
        int0: null,
        int1: null,
        int2: null,
        mouseX: 0,
        mouseY: 0,
        count: 0,
        windowHalfX: window.innerWidth / 2,
        windowHalfY: window.innerHeight / 2,
        galaxyGeo: null,
        galaxyMat: null,
        uniforms: null,
        galaxyVertex: galaxy_vertex,
        galaxyFragment: galaxy_fragment,
        moveGalaxy: true,
        rotateGalaxy: true,
        translateGalaxy: true,
        particles: null,
        targetRotation: 0,
        targetRotationOnPointerDown: 0,
        pointerX: 0,
        pointerXOnPointerDown: 0,
        isPointerDown: false,
        slideOut: false,
        slideIn: true,
        labelRenderer: new CSS2DRenderer()
      }
    },
    watch: {
      '$store.state.stopGalactic': function () {
        if (this.$store.state.stopGalactic == false) {
          this.animate();
        }else{
          this.renderer = null;
        }
      },
      '$store.state.currentSlide': function () {
        var text1 = this.scene.getObjectByName("CORE");
        var textMat1 = text1 === undefined ? false : text1.material;
        var text2 = this.scene.getObjectByName("VISION");
        var textMat2 = text2 === undefined ? false : text2.material;
        var text3 = this.scene.getObjectByName("Connect");
        var textMat3 = text3 === undefined ? false : text3.material;
        var text4 = this.scene.getObjectByName("Story");
        var textMat4 = text4 === undefined ? false : text4.material;

        if (this.$store.state.currentSlide == 2) {
          this.moveGalaxyOnSlider();
          if (textMat1) {
            new TWEEN.Tween(textMat1.uniforms.amplitude)
              .to({ value: 7 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();

            new TWEEN.Tween(textMat1.uniforms.percent)
              .to({ value: 0 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();

            new TWEEN.Tween(textMat2.uniforms.amplitude)
              .to({ value: 7 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();

            new TWEEN.Tween(textMat2.uniforms.percent)
              .to({ value: 0 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();

            new TWEEN.Tween(textMat3.uniforms.amplitude)
              .to({ value: 7 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();

            new TWEEN.Tween(textMat3.uniforms.percent)
              .to({ value: 0 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();

            new TWEEN.Tween(textMat4.uniforms.amplitude)
              .to({ value: 0 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();

            new TWEEN.Tween(textMat4.uniforms.percent)
              .to({ value: 1 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();
          }
        }
        if (this.$store.state.currentSlide == 1) {
          this.moveGalaxyOnSlider();
          if (textMat1) {
            new TWEEN.Tween(textMat1.uniforms.amplitude)
              .to({ value: 7 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();

            new TWEEN.Tween(textMat1.uniforms.percent)
              .to({ value: 0 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();

            new TWEEN.Tween(textMat2.uniforms.amplitude)
              .to({ value: 7 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();

            new TWEEN.Tween(textMat2.uniforms.percent)
              .to({ value: 0 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();

            new TWEEN.Tween(textMat3.uniforms.amplitude)
              .to({ value: 0 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();

            new TWEEN.Tween(textMat3.uniforms.percent)
              .to({ value: 1 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();

            new TWEEN.Tween(textMat4.uniforms.amplitude)
              .to({ value: 7 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();

            new TWEEN.Tween(textMat4.uniforms.percent)
              .to({ value: 0 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();
          }
        }
        if (this.$store.state.currentSlide == 0) {
          if (textMat1) {
            this.moveGalaxyOnSlider();
            new TWEEN.Tween(textMat1.uniforms.amplitude)
              .to({ value: 0 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();

            new TWEEN.Tween(textMat1.uniforms.percent)
              .to({ value: 1 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();

            new TWEEN.Tween(textMat2.uniforms.amplitude)
              .to({ value: 0 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();

            new TWEEN.Tween(textMat2.uniforms.percent)
              .to({ value: 1 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();

            new TWEEN.Tween(textMat3.uniforms.amplitude)
              .to({ value: 7 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();

            new TWEEN.Tween(textMat3.uniforms.percent)
              .to({ value: 0 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();

            new TWEEN.Tween(textMat4.uniforms.amplitude)
              .to({ value: 7 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();

            new TWEEN.Tween(textMat4.uniforms.percent)
              .to({ value: 0 }, 1000)
              .easing(TWEEN.Easing.Quadratic.In)
              .start();
          }
        }
      }
    },
    methods: {
      myScene: function () {
        this.scene = new THREE.Scene();
        var light = new THREE.AmbientLight(0xffffff);
        var width = window.innerWidth;
        var height = window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(50, width/height, 1, 5000);
        this.camera.position.x = -600;
        this.camera.position.y = -600;
        this.camera.position.z = 1000 + 1200;
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        document.getElementById("galaxy-container").appendChild(this.renderer.domElement);
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0px';
        document.getElementById("galaxy-container").appendChild(this.labelRenderer.domElement);
        this.clock = new THREE.Clock();
        this.clock.start();

        var sLight = new THREE.SpotLight(0xffffff);
        sLight.position.set(-100, 100, 100);
        this.scene.add(sLight);

        var aLight = new THREE.AmbientLight(0xffffff);
        this.scene.add(aLight);

        var directionalLight = new THREE.DirectionalLight("#fff", 2);
        directionalLight.position.set(0, 50, -20);
        this.scene.add(directionalLight);

        THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
        THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
        THREE.Mesh.prototype.raycast = acceleratedRaycast;

        const loader = new THREE.TextureLoader();
        const texture = loader.load(require("../assets/galaxySphere.png"));

        this.uniforms = {
          pointTexture: { type: "t", value: texture },
          uCameraPos: { type: "3f", value: new THREE.Vector3(0, 0, 1000) },
        };

        this.galaxyMat = new THREE.ShaderMaterial({
          uniforms:       this.uniforms,
          vertexShader:   this.galaxyVertex,
          fragmentShader: this.galaxyFragment,
          transparent:    true,
          depthTest:      false,
          blending:       THREE.AdditiveBlending
        });

        var variance = 2.5 * (Math.random() + Math.random() + Math.random()) / 3.0;
        var arms = this.count === 0 ? 7 : Math.floor(Math.random() * 4) + 3;
        var twist = 0.6 + 1.5 * (Math.random() + Math.random() + Math.random() + Math.random() + Math.random());
        var pinch = 0.7 + 1.5 * (Math.random() + Math.random() + Math.random() + Math.random()) / 4.0;

        var clouds = 500 * arms;
        var stars = 10000;
        var planets = 3;

        var vertices = new Float32Array((clouds + stars) * 3);
        var colors = new Float32Array((clouds + stars) * 3);
        var alphas = new Float32Array((clouds + stars) * 1);
        var sizes = new Float32Array((clouds + stars) * 1);

        var r1 = 1.0;
        var g1 = 1.0;
        var b1 = 0.8;

        var r2 = 0.65;
        var g2 = 0.85;
        var b2 = 1.0;

        var r3 = 0;
        var g3 = 0;
        var b3 = 0;

        for (let i = 0; i < clouds; ++i) {
          var f = (clouds - i) / clouds;
          var g = i / clouds;
          var a = (i % arms) / arms * 2.0 * 3.19149 + g * twist + variance * ((Math.random() + Math.random() + Math.random()) * 0.4 / 3.0 - 0.2);
          var r = Math.pow(g, pinch) * 700;
          var x = Math.cos(a) * r;
          var y = Math.sin(a) * r;
          var z = 0.0;

          vertices[i * 3 + 0] = x;
          vertices[i * 3 + 1] = y;
          vertices[i * 3 + 2] = z;

          var c = Math.pow(f, 0.8);
          colors[i * 3 + 0] = c * r1 + (1.0 - c) * r2;
          colors[i * 3 + 1] = c * g1 + (1.0 - c) * g2;
          colors[i * 3 + 2] = c * b1 + (1.0 - c) * b2;

          var s = Math.pow(512.0, Math.pow(f * Math.random(), 0.3));
          alphas[i] = Math.random() * (400.0 - s) / 5000.0 * Math.pow(g, 0.49);
          sizes[i] = s;
        }

        for (let i = clouds; i < clouds + stars; ++i) {
          var f = (clouds + stars - i) / (clouds + stars);
          var g = i / (clouds + stars);
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

          var c = Math.pow(f, 0.8);
          colors[i * 3 + 0] = 1.0;
          colors[i * 3 + 1] = 1.0;
          colors[i * 3 + 2] = 1.0;

          var s = Math.pow(512.0, Math.pow(f * Math.random(), 0.3));
          alphas[i] = 0.2 + Math.random() * 0.8;
          sizes[i] = Math.random() * Math.random() * 8.0;
        }

        this.galaxyGeo = new THREE.BufferGeometry();
        this.galaxyGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        this.galaxyGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        this.galaxyGeo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
        this.galaxyGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        this.particles = new THREE.Points(this.galaxyGeo, this.galaxyMat);

        for (let i = 0; i < planets; ++i) {
          const planetGeo = new THREE.SphereGeometry(50, 32, 32);
          const planetLoader = new THREE.TextureLoader();
          const planetTexture = planetLoader.load(require("../assets/moon.png"));
          planetGeo.computeBoundsTree();

          var uniforms = {
            planetTexture: { type: "t", value: planetTexture }
          };

          const planetMat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: `
              varying vec2 vUv;

              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              uniform sampler2D planetTexture;
              varying vec2 vUv;

              void main() {
                gl_FragColor = texture2D(planetTexture, vUv);
              }
            `,
            transparent: true,
            depthTest: false,
            blending: THREE.AdditiveBlending
          });

          const planet = new THREE.Mesh(planetGeo, planetMat);

          planet.name = "planet" + i;
          var tooltipText = "";

          if (i === 0) {
            planet.position.x = -100;
            planet.position.y = 400;
            planet.position.z = 5;
            tooltipText = "Main";
          } else if (i === 1) {
            planet.position.x = -400;
            planet.position.y = -300;
            planet.position.z = 100;
            tooltipText = "Statistics";
          } else if (i === 2) {
            planet.position.x = 210;
            planet.position.y = -500;
            planet.position.z = 5;
            tooltipText = "Story";
          }

          this.particles.add(planet);

          const tooltipLineMat = new THREE.LineBasicMaterial({
            color: 0xffffff
          });

          const linePoints = [];
          linePoints.push(new THREE.Vector3(0, 0, 100));
          linePoints.push(new THREE.Vector3(0, 0, 0));

          const tooltipLineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
          const tooltipLineMesh = new THREE.Line(tooltipLineGeo, tooltipLineMat, THREE.LineSegments);

          tooltipLineMesh.position.z = 100;
          tooltipLineMesh.scale.x = 0;
          tooltipLineMesh.scale.y = 0;
          tooltipLineMesh.scale.z = 0;

          planet.add(tooltipLineMesh);

          const planetDiv = document.createElement('div');
          planetDiv.id = 'planet-tooltip' + i;
          planetDiv.textContent = tooltipText;
          planetDiv.style.marginTop = '-1em';
          planetDiv.style.opacity = '0';

          const planetTooltip = new CSS2DObject(planetDiv);
          planetTooltip.position.set(0, 0, 100);
          tooltipLineMesh.add(planetTooltip);
        }

        this.scene.add(this.particles);
        this.changeSlide();
      },
      changeSlide: function(slide) {
        var textLoader = new THREE.FontLoader();
        var scene = this.scene;
        var camera = this.camera;

        for (let t = 0; t < 4; t++) {
          textLoader.load("./three_fonts/Kanit_Regular.json", function(
            font
          ) {
            let textMask = "CORE";
            let vectorColor = "vColor";

            if (t === 1) {
              textMask = "VISION";
              vectorColor = "vec3(1.,0.443,0.322)";
            }

            if (t === 2) {
              textMask = "Connect";
            }
            if (t === 3) {
              textMask = "Story";
            }

            var textGeo1 = new THREE.TextBufferGeometry(textMask, {
              font: font,
              size: 170,
              height: 5,
              curveSegments: 20,
              //bevelEnabled: true,
              bevelThickness: 2,
              bevelSize: 8,
              bevelSegments: 5
            });

            const tessellateModifier1 = new TessellateModifier(8, 6);
            textGeo1 = tessellateModifier1.modify(textGeo1);
            const numFaces = textGeo1.attributes.position.count / 3;
            const colors = new Float32Array( numFaces * 3 * 3 );
            const color = new THREE.Color();
            const displacement1 = new Float32Array(numFaces * 3 * 3);

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

                displacement1[index + (3 * i)] = d;
                displacement1[index + (3 * i) + 1] = d;
                displacement1[index + (3 * i) + 2] = d;
              }
            }

            textGeo1.setAttribute('customColor', new THREE.BufferAttribute(colors, 3 ));
            textGeo1.setAttribute('displacement', new THREE.BufferAttribute(displacement1, 3));

            var textUniforms1 = {
              amplitude: { value: textMask === "Connect" || textMask === "Story" ? 7 : 0 },
              percent: { type: "f", value: textMask === "Connect" || textMask === "Story" ? 0.0 : 1.0 }
            };

            const tShaderMat = new THREE.ShaderMaterial({
              uniforms: textUniforms1,
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

            var textMesh = new THREE.Mesh(textGeo1, tShaderMat);

            if(window.innerWidth > 1300) {
              if (textMask === "CORE" || textMask === "Connect" || textMask === "Story") {
                textMesh.position.x = -1300;
                textMesh.position.z = 500;
                textMesh.position.y = window.innerHeight / 2 - 500;
              } else {
                textMesh.position.x = -1100;
                textMesh.position.z = 500;
                textMesh.position.y = window.innerHeight / 2 - 700;
              }
            }
            if(window.innerWidth <= 1299 && window.innerWidth >= 1051){
              if (textMask === "CORE" || textMask === "Connect" || textMask === "Story") {
                textMesh.position.x = -1100;
                textMesh.position.z = 500;
                textMesh.position.y = window.innerHeight / 2 - 500;
              } else {
                textMesh.position.x = -900;
                textMesh.position.z = 500;
                textMesh.position.y = window.innerHeight / 2 - 700;
              }
            }
            if(window.innerWidth <= 1050 && window.innerWidth >= 767){
              if (textMask === "CORE" || textMask === "Connect" || textMask === "Story") {
                textMesh.position.x = -650;
                textMesh.position.z = 500;
                textMesh.position.y = window.innerHeight / 2 - 300;
                textMesh.scale.x = 0.7
                textMesh.scale.y = 0.7
                textMesh.scale.z = 0.7
              } else {
                textMesh.position.x = -550;
                textMesh.position.z = 500;
                textMesh.position.y = window.innerHeight / 2 - 450;
                textMesh.scale.x = 0.7
                textMesh.scale.y = 0.7
                textMesh.scale.z = 0.7
              }
            }
            if(window.innerWidth <= 767){
              if (textMask === "CORE" || textMask === "Connect" || textMask === "Story") {
                textMesh.position.x = -500;
                textMesh.position.z = 500;
                textMesh.position.y = window.innerHeight / 2 - 100;
                textMesh.scale.x = 0.5
                textMesh.scale.y = 0.5
                textMesh.scale.z = 0.5
              } else {
                textMesh.position.x = -400;
                textMesh.position.z = 500;
                textMesh.position.y = window.innerHeight / 2 - 200;
                textMesh.scale.x = 0.5
                textMesh.scale.y = 0.5
                textMesh.scale.z = 0.5
              }
            }

            textMesh.rotation.x = 0.35;
            textMesh.rotation.y = -0.3;
            textMesh.rotation.z = 0.085;
            textMesh.name = textMask;
            scene.add(textMesh);
          });
        }

        this.scene = scene;
        this.camera = camera;
      },
      moveGalaxyOnSlider: function () {
        var A = new TWEEN.Tween(this.particles.position).to({ x: -1000, y: -1500, z: 3000 }, 500)
          .easing(TWEEN.Easing.Quadratic.In);

        var B = new TWEEN.Tween(this.particles.position).to({ x: -280, y: -900, z: 748 }, 500)
          .easing(TWEEN.Easing.Quadratic.In);

        A.chain(B);

        A.start();
      },
      animate: function () {
        if (this.$store.state.stopGalactic == false){
          requestAnimationFrame(this.animate);
        }
        // this.requestAnimation;
        var plRot = 0.01;

        var planet0 = this.scene.getObjectByName("planet0");
        var planet1 = this.scene.getObjectByName("planet1");
        var planet2 = this.scene.getObjectByName("planet2");

        planet0.rotation.z += plRot;
        planet1.rotation.z += plRot;
        planet2.rotation.z += plRot;

        var zRot = 0.01;

        if (this.particles.position.y < -790) {
          this.translateGalaxy = false;
          zRot = 0.0015;
        }

        var xRot = 0.01;
        var zPos = 4;
        var yPos = 3;
        var xPos = 1.5;

        this.particles.rotation.z -= zRot;

        if (this.moveGalaxy) {
          this.particles.position.y -= yPos;
          this.particles.position.z += zPos;
          this.particles.position.x -= xPos;
        }

        if (this.particles.position.x < -280) {
          this.moveGalaxy = false;

          if (this.rotateGalaxy) {
            this.particles.position.y -= yPos;
            this.particles.rotation.x -= xRot;
          }

          if (this.translateGalaxy) {
            this.particles.position.y -= yPos * 2;
          }
        }

        if (this.particles.rotation.x < -0.6) {
          this.$store.commit('setFirstAnimation', true);
          this.rotateGalaxy = false;
          if (this.isPointerDown) {
            this.particles.rotation.z += (this.targetRotation - this.particles.rotation.z) * 0.05;
          } else {
            this.particles.rotation.z -= zRot;
          }
        }

        TWEEN.update();
        this.camera.lookAt(this.scene.position);
        this.render();
      },
      planetClick: function () {
        this.int0 = this.raycaster.intersectObjects([this.particles.children[0]]);
        this.int1 = this.raycaster.intersectObjects([this.particles.children[1]]);
        this.int2 = this.raycaster.intersectObjects([this.particles.children[2]]);
        if (this.int0.length > 0) {
          this.$store.commit('changeSlide', 0);
        }
        if (this.int1.length > 0) {
          this.$store.commit('changeSlide', 1);
        }
        if (this.int2.length > 0) {
          this.$store.commit('changeSlide', 2);
        }
      },
      onPointerMove: function (event) {
        if (event.isPrimary === false) return;
        if(this.$store.state.stopGalactic){
          return false
        }

        this.pointerX = event.clientX - this.windowHalfX;
        this.targetRotation = this.targetRotationOnPointerDown + (this.pointerX - this.pointerXOnPointerDown) * 0.02;

        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.raycaster.firstHitOnly = true;
        const intersects = this.raycaster.intersectObjects(this.particles.children);
        this.int0 = this.raycaster.intersectObjects([this.particles.children[0]]);
        this.int1 = this.raycaster.intersectObjects([this.particles.children[1]]);
        this.int2 = this.raycaster.intersectObjects([this.particles.children[2]]);

        if (this.int0.length > 0) {
          var iMesh = this.int0[0].object;
          var tooltipClass = iMesh.children[0].children[0].element.id;
          var tooltip = document.getElementById(tooltipClass);
          tooltip.style.opacity = 1;

          new TWEEN.Tween(iMesh.children[0].scale)
            .to({ x: 1, y: 1, z: 1 }, 300)
            .easing(TWEEN.Easing.Quadratic.In)
            .start();

          new TWEEN.Tween(iMesh.scale)
            .to({ x: 2, y: 2, z: 2 }, 300)
            .easing(TWEEN.Easing.Quadratic.In)
            .start();
        } else {
          var tooltipClass = this.particles.children[0].children[0].children[0].element.id;
          var tooltip = document.getElementById(tooltipClass);
          tooltip.style.opacity = 0;

          new TWEEN.Tween(this.particles.children[0].children[0].scale)
            .to({ x: 0, y: 0, z: 0 }, 100)
            .easing(TWEEN.Easing.Quadratic.In)
            .start();

          new TWEEN.Tween(this.particles.children[0].scale)
            .to({ x: 1, y: 1, z: 1 }, 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
        }

        if (this.int1.length > 0) {
          var iMesh = this.int1[0].object;
          var tooltipClass = iMesh.children[0].children[0].element.id;
          var tooltip = document.getElementById(tooltipClass);
          tooltip.style.opacity = 1;

          new TWEEN.Tween(iMesh.children[0].scale)
            .to({ x: 1, y: 1, z: 1 }, 300)
            .easing(TWEEN.Easing.Quadratic.In)
            .start();

          new TWEEN.Tween(iMesh.scale)
            .to({ x: 2, y: 2, z: 2 }, 300)
            .easing(TWEEN.Easing.Quadratic.In)
            .start();
        } else {
          var tooltipClass = this.particles.children[1].children[0].children[0].element.id;
          var tooltip = document.getElementById(tooltipClass);
          tooltip.style.opacity = 0;


          new TWEEN.Tween(this.particles.children[1].children[0].scale)
            .to({ x: 0, y: 0, z: 0 }, 100)
            .easing(TWEEN.Easing.Quadratic.In)
            .start();

          new TWEEN.Tween(this.particles.children[1].scale)
            .to({ x: 1, y: 1, z: 1 }, 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
        }

        if (this.int2.length > 0) {
          var iMesh = this.int2[0].object;
          var tooltipClass = iMesh.children[0].children[0].element.id;
          var tooltip = document.getElementById(tooltipClass);
          tooltip.style.opacity = 1;

          new TWEEN.Tween(iMesh.children[0].scale)
            .to({ x: 1, y: 1, z: 1 }, 300)
            .easing(TWEEN.Easing.Quadratic.In)
            .start();

          new TWEEN.Tween(iMesh.scale)
            .to({ x: 2, y: 2, z: 2 }, 300)
            .easing(TWEEN.Easing.Quadratic.In)
            .start();
        } else {
          var tooltipClass = this.particles.children[2].children[0].children[0].element.id;
          var tooltip = document.getElementById(tooltipClass);
          tooltip.style.opacity = 0;

          new TWEEN.Tween(this.particles.children[2].children[0].scale)
            .to({ x: 0, y: 0, z: 0 }, 100)
            .easing(TWEEN.Easing.Quadratic.In)
            .start();

          new TWEEN.Tween(this.particles.children[2].scale)
            .to({ x: 1, y: 1, z: 1 }, 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
        }
      },
      onPointerDown: function (event) {
        if (event.isPrimary === false) return;
        this.isPointerDown = true;
      },
      onPointerUp: function () {
        if (event.isPrimary === false) return;
        this.isPointerDown = false;
      },
      render: function () {
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.physicallyCorrectLights = true;
        this.renderer.render(this.scene, this.camera);
        this.labelRenderer.render(this.scene, this.camera);
      },
      onWindowResize: function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
        this.render();
        if(window.innerWidth > 1300){
          this.scene.children[4].position.x = -1300
          this.scene.children[4].position.y = window.innerHeight / 2 - 500;
          this.scene.children[5].position.x = -1100
          this.scene.children[5].position.y = window.innerHeight / 2 - 700;
          this.scene.children[6].position.x = -1300
          this.scene.children[6].position.y = window.innerHeight / 2 - 500;
          this.scene.children[7].position.x = -1300
          this.scene.children[7].position.y = window.innerHeight / 2 - 500;
        }
        if(window.innerWidth <= 1299 && window.innerWidth >= 1051){
          this.scene.children[4].position.x = -1100;
          this.scene.children[4].position.y = window.innerHeight / 2 - 500;
          this.scene.children[4].scale.x = 1
          this.scene.children[4].scale.y = 1
          this.scene.children[4].scale.z = 1
          this.scene.children[5].position.x = -900;
          this.scene.children[5].position.y = window.innerHeight / 2 - 700;
          this.scene.children[5].scale.x = 1
          this.scene.children[5].scale.y = 1
          this.scene.children[5].scale.z = 1
          this.scene.children[6].position.x = -1100;
          this.scene.children[6].position.y = window.innerHeight / 2 - 500;
          this.scene.children[6].scale.x = 1
          this.scene.children[6].scale.y = 1
          this.scene.children[6].scale.z = 1
          this.scene.children[7].position.x = -1100;
          this.scene.children[7].position.y = window.innerHeight / 2 - 500;
          this.scene.children[7].scale.x = 1
          this.scene.children[7].scale.y = 1
          this.scene.children[7].scale.z = 1
        }
        if(window.innerWidth <= 1050 && window.innerWidth >= 767){
          this.scene.children[4].position.x = -650;
          this.scene.children[4].position.y = window.innerHeight / 2 - 300;
          this.scene.children[4].scale.x = 0.7
          this.scene.children[4].scale.y = 0.7
          this.scene.children[4].scale.z = 0.7
          this.scene.children[5].position.x = -550;
          this.scene.children[5].position.y = window.innerHeight / 2 - 450;
          this.scene.children[5].scale.x = 0.7
          this.scene.children[5].scale.y = 0.7
          this.scene.children[5].scale.z = 0.7
          this.scene.children[6].position.x = -650;
          this.scene.children[6].position.y = window.innerHeight / 2 - 350;
          this.scene.children[6].scale.x = 0.7
          this.scene.children[6].scale.y = 0.7
          this.scene.children[6].scale.z = 0.7
          this.scene.children[7].position.x = -650;
          this.scene.children[7].position.y = window.innerHeight / 2 - 350;
          this.scene.children[7].scale.x = 0.7
          this.scene.children[7].scale.y = 0.7
          this.scene.children[7].scale.z = 0.7
        }
        if(window.innerWidth <= 767){
          this.scene.children[4].position.x = -500;
          this.scene.children[4].position.y = window.innerHeight / 2 - 100;
          this.scene.children[4].scale.x = 0.5
          this.scene.children[4].scale.y = 0.5
          this.scene.children[4].scale.z = 0.5
          this.scene.children[5].position.x = -400;
          this.scene.children[5].position.y = window.innerHeight / 2 - 200;
          this.scene.children[5].scale.x = 0.5
          this.scene.children[5].scale.y = 0.5
          this.scene.children[5].scale.z = 0.5
          this.scene.children[6].position.x = -500;
          this.scene.children[6].position.y = window.innerHeight / 2 - 100;
          this.scene.children[6].scale.x = 0.5
          this.scene.children[6].scale.y = 0.5
          this.scene.children[6].scale.z = 0.5
          this.scene.children[7].position.x = -500;
          this.scene.children[7].position.y = window.innerHeight / 2 - 100;
          this.scene.children[7].scale.x = 0.5
          this.scene.children[7].scale.y = 0.5
          this.scene.children[7].scale.z = 0.5
        }
      },
    },
    mounted () {
      const promise = new Promise((resolve, reject) => {
        resolve ( this.myScene())
      });
      promise.then((value) => {
        this.animate()
      });
      document.addEventListener('mouseup', this.onPointerUp, false);
      document.addEventListener('mousedown', this.onPointerDown, false);
      document.addEventListener('mousedown', this.planetClick, false);
      document.addEventListener('pointermove', this.onPointerMove);
      window.addEventListener('resize', this.onWindowResize, false);
      this.$store.commit('setHeader', true);
    },
    beforeDestroy () {
      this.scene.remove(this.scene.children[0]);
      this.$store.commit('stopGalactic', true);
      document.removeEventListener('mouseup', this.onPointerUp, false);
      document.removeEventListener('mousedown', this.onPointerDown, false);
      document.removeEventListener('mousedown', this.planetClick, false);
      document.removeEventListener('pointermove', this.onPointerMove);
      window.removeEventListener('resize', this.onWindowResize, false);
      this.renderer = null;
    }
  }
</script>
<style scoped>
  #galaxy-container{
    position: fixed;
    z-index: 1;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100vh;
  }
  #planet-tooltip0,
  #planet-tooltip1,
  #planet-tooltip2 {
    color: #FFF;
    /*font-family: "Kanit_Regular";*/
    padding: 2px;
  }
  /*Ipad 1024*/
  @media (max-width: 1365px){
  }
  /*Ipad 768*/
  @media (max-width: 1023px){
  }
  /*Mobile 320*/
  @media (max-width: 767px){}
</style>
