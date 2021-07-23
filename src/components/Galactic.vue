<template>
  <div id="galaxy-container"></div>
</template>

<script>
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
  import { TessellateModifier } from 'three/examples/jsm/modifiers/TessellateModifier.js';
  const TWEEN = require('@tweenjs/tween.js');
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
        target: new THREE.Vector2(),
        mouseX: 0,
        mouseY: 0,
        count: 0,
        windowHalfX: window.innerWidth / 2,
        windowHalfY: window.innerHeight / 2,
        galaxyGeo: null,
        galaxyMat: null,
        uniforms: null,
        galaxyVertex: `
        uniform vec3 uCameraPos;
        attribute float alpha;
        attribute float size;
        attribute vec3 color;
        varying float vAlpha;
        varying vec3 vColor;
        void main() {
          float d = distance(position.xyz, uCameraPos);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vAlpha = alpha;
          vColor = color;
          gl_PointSize = size;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
        galaxyFragment: `
          varying vec3 vColor;
          uniform sampler2D pointTexture;
          varying float vAlpha;
          void main() {
            gl_FragColor = vec4(vColor, vAlpha);
            gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
          }
        `,
        moveGalaxy: true,
        rotateGalaxy: true,
        translateGalaxy: true,
        particles: null,
        targetRotation: 0,
        targetRotationOnPointerDown: 0,
        pointerX: 0,
        pointerXOnPointerDown: 0,
        isPointerDown: false,
        oldDisp: 0.0,
        oldPerc: 1.0,
        disp: 0.1,
        perc: 0.1,
        oldDispC: 6.0,
        oldPercC: 0.0
      }
    },
    watch: {
      '$store.state.playGame': function () {
        if (this.$store.state.playGame == false) {
          this.animate();
        }
      }
    },
    methods: {
      myScene: function () {
        this.scene = new THREE.Scene();
        var light = new THREE.AmbientLight(0xffffff);
        var width = window.innerWidth;
        var height = window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 5000);
        this.camera.position.x = -600;
        this.camera.position.y = -600;
        this.camera.position.z = 1000 + 1200;
        this.renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true
        });
        this.renderer.setSize(width, height);
        document.getElementById("galaxy-container").appendChild(this.renderer.domElement);
        this.clock = new THREE.Clock();
        this.clock.start();
        var sLight = new THREE.SpotLight(0xffffff);
        sLight.position.set(-100, 100, 100);
        this.scene.add(sLight);
        var aLight = new THREE.AmbientLight(0xffffff);
        this.scene.add(aLight);
        //David code
        var directionalLight = new THREE.DirectionalLight("#fff", 2);
        directionalLight.position.set(0, 50, -20);
        this.scene.add(directionalLight);
        //End David code
        const loader = new THREE.TextureLoader();
        const texture = loader.load(require("../assets/galaxySphere.png"));
        this.uniforms = {
          pointTexture: {
            type: "t",
            value: texture
          },
          uCameraPos: {
            type: "3f",
            value: new THREE.Vector3(0, 0, 1000)
          },
        };
        this.galaxyMat = new THREE.ShaderMaterial({
          uniforms: this.uniforms,
          vertexShader: this.galaxyVertex,
          fragmentShader: this.galaxyFragment,
          transparent: true,
          depthTest: false,
          blending: THREE.AdditiveBlending
        });
        var variance = 2.5 * (Math.random() + Math.random() + Math.random()) / 3.0;
        var arms = this.count === 0 ? 7 : Math.floor(Math.random() * 4) + 3;
        var twist = 0.6 + 1.5 * (Math.random() + Math.random() + Math.random() + Math.random() + Math.random());
        var pinch = 0.7 + 1.5 * (Math.random() + Math.random() + Math.random() + Math.random()) / 4.0;
        var clouds = 500 * arms;
        var stars = 10000;
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
  }
  this.galaxyGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  this.galaxyGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  this.galaxyGeo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
  this.galaxyGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  this.particles = new THREE.Points(this.galaxyGeo, this.galaxyMat);
  this.scene.add(this.particles);
  this.changeSlide();
  },
  wheelScroll: function(event) {
    var text1 = this.scene.getObjectByName("Core");
    var textMat1 = text1 === undefined ? false : text1.material;
    var text2 = this.scene.getObjectByName("Vision");
    var textMat2 = text2 === undefined ? false : text2.material;
    var text3 = this.scene.getObjectByName("Connect");
    var textMat3 = text3 === undefined ? false : text3.material;
    if (this.$store.state.currentSlide !== 0) {
      if (textMat1) {
        var tween = new TWEEN.Tween(textMat1.uniforms.amplitude)
          .to({
            value: 7
          }, 1000)
          .start();
        var tween2 = new TWEEN.Tween(textMat1.uniforms.percent)
          .to({
            value: 0
          }, 1000)
          .start();
        tween.easing(TWEEN.Easing.Quadratic.In);
        tween2.easing(TWEEN.Easing.Quadratic.In);
        var tween3 = new TWEEN.Tween(textMat2.uniforms.amplitude)
          .to({
            value: 7
          }, 1000)
          .start();
        var tween4 = new TWEEN.Tween(textMat2.uniforms.percent)
          .to({
            value: 0
          }, 1000)
          .start();
        tween3.easing(TWEEN.Easing.Quadratic.In);
        tween4.easing(TWEEN.Easing.Quadratic.In);
        var tween5 = new TWEEN.Tween(textMat3.uniforms.amplitude)
          .to({
            value: 0
          }, 1000)
          .start();
        var tween6 = new TWEEN.Tween(textMat3.uniforms.percent)
          .to({
            value: 1
          }, 1000)
          .start();
        tween5.easing(TWEEN.Easing.Quadratic.In);
        tween6.easing(TWEEN.Easing.Quadratic.In);
      }
    }
    if (this.$store.state.currentSlide == 0) {
      if (textMat1) {
        var tween = new TWEEN.Tween(textMat1.uniforms.amplitude)
          .to({
            value: 0
          }, 1000)
          .start();
        var tween2 = new TWEEN.Tween(textMat1.uniforms.percent)
          .to({
            value: 1
          }, 1000)
          .start();
        tween.easing(TWEEN.Easing.Quadratic.In);
        tween2.easing(TWEEN.Easing.Quadratic.In);
        var tween3 = new TWEEN.Tween(textMat2.uniforms.amplitude)
          .to({
            value: 0
          }, 1000)
          .start();
        var tween4 = new TWEEN.Tween(textMat2.uniforms.percent)
          .to({
            value: 1
          }, 1000)
          .start();
        tween3.easing(TWEEN.Easing.Quadratic.In);
        tween4.easing(TWEEN.Easing.Quadratic.In);
        var tween5 = new TWEEN.Tween(textMat3.uniforms.amplitude)
          .to({
            value: 7
          }, 1000)
          .start();
        var tween6 = new TWEEN.Tween(textMat3.uniforms.percent)
          .to({
            value: 0
          }, 1000)
          .start();
        tween5.easing(TWEEN.Easing.Quadratic.In);
        tween6.easing(TWEEN.Easing.Quadratic.In);
      }
    }
  },
  changeSlide: function(slide) {
    var textLoader = new THREE.FontLoader();
    var scene = this.scene;
    var camera = this.camera;

    for (let t = 0; t < 3; t++) {
      textLoader.load("./three_fonts/Kanit_Regular.json", function(
        font
      ) {
        let textMask = "Core";
        let vectorColor = "vColor";
        if (t === 1) {
          textMask = "Vision";
          vectorColor = "vec3(1.0,0.0,0.0)";
        }
        if (t === 2) {
          textMask = "Connect";
        }
        var textGeo1 = new THREE.TextBufferGeometry(textMask, {
          font: font,
          size: 170,
          height: 5,
          curveSegments: 12,
          bevelEnabled: true,
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
          amplitude: { value: textMask === "Connect" ? 7 : 0 },
          percent: { type: "f", value: textMask === "Connect" ? 0.0 : 1.0 }
        };
        const tShaderMat = new THREE.ShaderMaterial({
          uniforms: textUniforms1,
          vertexShader: `
              uniform float amplitude;
              attribute vec3 customColor;
              attribute vec3 displacement;
              varying vec3 vNormal;
              varying vec3 vColor;
              void main() {
                vNormal = normal;
                vColor = customColor;
                vec3 newPosition = position + normal * amplitude * displacement;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
              }
            `,
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
        if (textMask === "Core" || textMask === "Connect") {
          textMesh.position.x = -1100;
          textMesh.position.z = 500;
          textMesh.position.y = 50;
        } else {
          textMesh.position.x = -880;
          textMesh.position.z = 500;
          textMesh.position.y = -150;
        }
        textMesh.rotation.x = 0.35;
        textMesh.rotation.y = -0.3;
        textMesh.rotation.z = 0.085;
        textMesh.name = textMask;
        scene.add(textMesh);
      });
      var textMesh = new THREE.Mesh(textGeo1, tShaderMat);
      if (textMask === "Core" || textMask === "Connect") {
        textMesh.position.x = -1100;
        textMesh.position.z = 500;
        textMesh.position.y = 50;
      } else {
        textMesh.position.x = -880;
        textMesh.position.z = 500;
        textMesh.position.y = -150;
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
  animate: function () {
    TWEEN.update();
    if (this.$store.state.playGame == false){
      requestAnimationFrame(this.animate);
    }
    //console.log(this.$store.state.currentSlide)
    // this.requestAnimation;
    var zRot = 0.01;
    if (this.particles.position.y < -790) {
      this.translateGalaxy = false;
      zRot = 0.0015;
    }
    var xRot = 0.01;
    var zPos = 4;
    var yPos = 1;
    var xPos = 1;
    this.particles.rotation.z -= zRot;
    if (this.moveGalaxy) {
      this.particles.position.y -= yPos;
      this.particles.position.z += zPos;
      this.particles.position.x -= xPos;
    }
    if (this.particles.position.x < -280) {
      this.moveGalaxy = false;
      if (this.rotateGalaxy) {
        this.particles.rotation.x -= xRot;
      }
    }
    this.camera.lookAt(this.scene.position);
    this.render();
  },
  onPointerMove: function (event) {
    if (event.isPrimary === false) return;
    this.pointerX = event.clientX - this.windowHalfX;
    this.targetRotation = this.targetRotationOnPointerDown + (this.pointerX - this.pointerXOnPointerDown) * 0.02;
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
  },
  mounted () {
    this.myScene();
    this.animate();
    document.getElementById('app').addEventListener('wheel', this.wheelScroll, false);
    document.addEventListener('mouseup', this.onPointerUp, false);
    document.addEventListener('mousedown', this.onPointerDown, false);
    document.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('resize', this.onWindowResize, false);
  },
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
  /*Ipad 1024*/
  @media (max-width: 1365px){
  }
  /*Ipad 768*/
  @media (max-width: 1023px){
  }
  /*Mobile 320*/
  @media (max-width: 767px){}
</style>
