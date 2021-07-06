<template>
  <div>
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
       mouse: new THREE.Vector2()
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

      this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: false } );
      this.renderer.setSize( width, height );
      document.getElementById("webgl-container").appendChild(this.renderer.domElement);
      this.clock = new THREE.Clock();

      var sLight = new THREE.SpotLight( 0xffffff );
      sLight.position.set( -100, 100, 100 );
      this.scene.add( sLight );

      var aLight = new THREE.AmbientLight( 0xffffff );
      this.scene.add( aLight );
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
    stars: function() {
      //David star bg
      let starGeo = new THREE.Geometry();
      for(let i=0;i<6000;i++) {
          let star = new THREE.Vector3(
          Math.random() * 600 - 300,
          Math.random() * 600 - 300,
          Math.random() * 600 - 300
        );
        starGeo.vertices.push(star);
      }

      let sprite = new THREE.TextureLoader().load(require("@/assets/circle.jpg"));
      console.log('fuck', sprite);
      let starMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.7,
        map: sprite
      });

      let stars = new THREE.Points(starGeo, starMaterial);
      this.scene.add(stars);
      //end David star bg
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
    },
    animate: function() {
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
    this.stars();
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
    background-color: #000;
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
