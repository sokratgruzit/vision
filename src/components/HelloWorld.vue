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
import * as THREE from 'three'

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
      nucleus: null,
      stars: null,
      controls: null,
      timeout_Debounce: null,
      //noise: new SimplexNoise(),
      blobScale: 3
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
    addHolder: function () {
      this.holder = new THREE.Object3D();
      this.holder.name = "holder"

      for (var i = 0; i < this.totalTargets; i++) {
        var ranCol = new THREE.Color();
        ranCol.setRGB( Math.random(), Math.random(), Math.random() );

        var geometry = new THREE.BoxGeometry(2,2,2);
        var material = new THREE.MeshPhongMaterial( {color: ranCol, ambient: ranCol } );

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
      const textureSphereBg = loader.load(require(`@/assets/sphere.jpeg`));
      const texturenucleus = loader.load(require(`@/assets/nucleus.jpeg`));
      const textureStar = loader.load(require(`@/assets/txtStar.png`));
      const texture1 = loader.load(require(`@/assets/star1.png`));
      const texture2 = loader.load(require(`@/assets/star2.png`));
      const texture4 = loader.load(require(`@/assets/star3.png`));
      console.log(loader)

      /*  Nucleus  */
      texturenucleus.anisotropy = 16;
      let icosahedronGeometry = new THREE.IcosahedronGeometry(30, 10);
      let lambertMaterial = new THREE.MeshPhongMaterial({ map: texturenucleus });
      this.nucleus = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
      this.scene.add(this.nucleus);

      /*    Sphere  Background   */
      textureSphereBg.anisotropy = 16;
      let geometrySphereBg = new THREE.SphereBufferGeometry(150, 40, 40);
      let materialSphereBg = new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
        map: textureSphereBg,
      });
      this.sphereBg = new THREE.Mesh(geometrySphereBg, materialSphereBg);
      this.scene.add(this.sphereBg);

      /*    Moving Stars   */
      let starsGeometry = new THREE.BufferGeometry();
      const points = [];

      for (let i = 0; i < 50; i++) {
        let particleStar = this.randomPointSphere(150);
        points.push(new THREE.Vector3(particleStar.x, particleStar.y, particleStar.z));
        particleStar.velocity = THREE.MathUtils.randInt(50, 200);
      }
      starsGeometry.setFromPoints(points);
      let starsMaterial = new THREE.PointsMaterial({
        size: 5,
        color: "#ffffff",
        transparent: true,
        opacity: 0.8,
        map: textureStar,
        blending: THREE.AdditiveBlending,
      });

      this.scene.add(this.createStars(texture1, 15, 20));
      this.scene.add(this.createStars(texture2, 5, 5));
      this.scene.add(this.createStars(texture4, 7, 5));

      starsMaterial.depthWrite = false;
      this.stars = new THREE.Points(starsGeometry, starsMaterial);
      this.scene.add(this.stars);

      //End David code
    },
    createStars: function (texture, size, total) {
      console.log(texture, size, total);
      let pointGeometry = new THREE.BufferGeometry();
      let pointMaterial = new THREE.PointsMaterial({
        size: size,
        map: texture,
        blending: THREE.AdditiveBlending,
      });
      let points = [];
      for (let i = 0; i < total; i++) {
        let radius = THREE.MathUtils.randInt(149, 70);
        let particles = this.randomPointSphere(radius);
        points.push(new THREE.Vector3(particles.x, particles.y, particles.z));
      }
      pointGeometry.setFromPoints(points);
      return new THREE.Points(pointGeometry, pointMaterial);
    },
    animate: function() {
      //Stars  Animation
      this.stars.forEach(function (v) {
        v.x += (0 - v.x) / v.velocity;
        v.y += (0 - v.y) / v.velocity;
        v.z += (0 - v.z) / v.velocity;

        v.velocity -= 0.3;

        if (v.x <= 5 && v.x >= -5 && v.z <= 5 && v.z >= -5) {
          v.x = v.startX;
          v.y = v.startY;
          v.z = v.startZ;
          v.velocity = THREE.MathUtils.randInt(50, 300);
        }
      });
      requestAnimationFrame( this.animate );
      this.render();
    },
    render: function () {
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
    }
  },
  mounted() {
    document.getElementById("webgl-container").addEventListener('mousedown', this.onDocumentMouseDown, false);

    // this.myLevel.innerText = this.comments[this.level-1] +  ": Level " + this.level + " of " + this.totalLevels;
    this.myScene();
    console.log(this.clock)
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
