<template>
  <div class="game__container" :class="gameStart ? 'active' : ''">
    <div class="game-sound-button" @click="soundFunc()">
      <svg class="volume__icon" v-if="$store.state.sound" width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M26.5145 13.3979C26.3826 13.4817 26.2684 13.5906 26.1787 13.7185C26.0889 13.8464 26.0252 13.9907 25.9913 14.1433C25.9573 14.2958 25.9538 14.4535 25.9809 14.6074C26.008 14.7613 26.0651 14.9084 26.1491 15.0401C27.2899 16.8299 27.8998 18.9065 27.908 21.0289C27.9161 23.1514 27.3223 25.2326 26.1953 27.0311C26.0282 27.2985 25.9742 27.6212 26.045 27.9284C26.1159 28.2356 26.3059 28.5021 26.5733 28.6691C26.8406 28.8362 27.1634 28.8903 27.4706 28.8194C27.7778 28.7485 28.0442 28.5585 28.2113 28.2911C29.5742 26.1127 30.2921 23.5926 30.2817 21.0229C30.2713 18.4533 29.533 15.9391 28.1525 13.7717C27.9849 13.5086 27.7205 13.3218 27.4164 13.2519C27.1123 13.182 26.7928 13.2344 26.5271 13.3979H26.5145ZM36.4769 5.27514C36.2803 5.02841 35.9937 4.86988 35.6802 4.83444C35.3667 4.799 35.052 4.88953 34.8053 5.08614C34.5586 5.28274 34.4 5.56931 34.3646 5.8828C34.3291 6.19628 34.4197 6.51101 34.6163 6.75774C37.8484 10.8127 39.6133 15.842 39.624 21.0275C39.6347 26.213 37.8905 31.2495 34.6751 35.3177C34.5662 35.4387 34.4834 35.5808 34.4316 35.7351C34.3799 35.8894 34.3604 36.0527 34.3744 36.2148C34.3884 36.377 34.4355 36.5345 34.5128 36.6777C34.5902 36.8209 34.6961 36.9467 34.8241 37.0473C34.952 37.1479 35.0993 37.2211 35.2567 37.2625C35.4141 37.3038 35.5783 37.3124 35.7392 37.2876C35.9001 37.2629 36.0541 37.2054 36.1919 37.1187C36.3296 37.032 36.448 36.9179 36.5399 36.7835C40.0865 32.2951 42.0105 26.7389 41.999 21.0184C41.9876 15.2978 40.0414 9.74938 36.4769 5.27514ZM32.4701 9.34074C32.3771 9.21526 32.2604 9.10932 32.1265 9.02896C31.9926 8.94859 31.8442 8.89539 31.6898 8.87238C31.5354 8.84937 31.3779 8.857 31.2264 8.89485C31.0749 8.93269 30.9324 9 30.8069 9.09294C30.6814 9.18588 30.5755 9.30262 30.4951 9.4365C30.4147 9.57038 30.3615 9.71878 30.3385 9.87322C30.3155 10.0277 30.3231 10.1851 30.361 10.3366C30.3988 10.4881 30.4661 10.6307 30.5591 10.7561C32.7584 13.7273 33.95 17.3238 33.9599 21.0204C33.9697 24.7169 32.7972 28.3198 30.6137 31.3025C30.5167 31.428 30.4458 31.5715 30.4051 31.7248C30.3644 31.878 30.3548 32.0379 30.3769 32.1949C30.3989 32.3519 30.4521 32.5029 30.5334 32.6391C30.6147 32.7752 30.7224 32.8937 30.8502 32.9876C30.978 33.0814 31.1233 33.1488 31.2775 33.1857C31.4317 33.2226 31.5917 33.2282 31.7481 33.2023C31.9046 33.1764 32.0542 33.1194 32.1883 33.0348C32.3224 32.9502 32.4382 32.8396 32.5289 32.7095C35.0133 29.3176 36.3477 25.2199 36.3372 21.0155C36.3266 16.811 34.9715 12.7201 32.4701 9.34074Z" fill="#FF7152"/>
        <path d="M10.7772 15.1766H11.1497L11.4315 14.9329L21.7045 6.04526C21.7049 6.04488 21.7053 6.04451 21.7058 6.04414C21.7327 6.02153 21.7654 6.0069 21.8003 6.00191C21.8345 5.99701 21.8693 6.00159 21.901 6.01512C21.9327 6.03039 21.9594 6.05421 21.9783 6.08392C21.9978 6.11467 22.008 6.15041 22.0076 6.18682L22.0076 6.18682V6.19661V36.4366H22.0075L22.0077 36.4467C22.008 36.483 21.9979 36.5186 21.9785 36.5493L22.824 37.0833L21.9785 36.5493C21.9591 36.58 21.9313 36.6044 21.8984 36.6197C21.8655 36.635 21.8288 36.6404 21.7929 36.6354C21.757 36.6303 21.7232 36.615 21.6958 36.5913L11.2802 27.5827L10.9985 27.339H10.626H1.1886C1.13858 27.339 1.09061 27.3191 1.05524 27.2838C1.01987 27.2484 1 27.2004 1 27.1504V15.3602C1.00129 15.3116 1.02129 15.2654 1.05589 15.2311C1.0912 15.1962 1.13887 15.1766 1.18855 15.1766H1.1886H10.7772Z" stroke="white" stroke-width="2"/>
      </svg>
      <svg class="volume__icon" v-if="!$store.state.sound" width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.7772 15.1766H11.1497L11.4315 14.9329L21.7045 6.04526C21.7049 6.04488 21.7053 6.04451 21.7058 6.04414C21.7327 6.02153 21.7654 6.0069 21.8003 6.00191C21.8345 5.99701 21.8693 6.00159 21.901 6.01512C21.9327 6.03039 21.9594 6.05421 21.9783 6.08392C21.9978 6.11467 22.008 6.15041 22.0076 6.18682L22.0076 6.18682V6.19661V36.4366H22.0075L22.0077 36.4467C22.008 36.483 21.9979 36.5186 21.9785 36.5493L22.824 37.0833L21.9785 36.5493C21.9591 36.58 21.9313 36.6044 21.8984 36.6197C21.8655 36.635 21.8288 36.6404 21.7929 36.6354C21.757 36.6303 21.7232 36.615 21.6958 36.5913L11.2802 27.5827L10.9985 27.339H10.626H1.1886C1.13858 27.339 1.09061 27.3191 1.05524 27.2838C1.01987 27.2484 1 27.2004 1 27.1504V15.3602C1.00129 15.3116 1.02129 15.2654 1.05589 15.2311C1.0912 15.1962 1.13887 15.1766 1.18855 15.1766H1.1886H10.7772Z" stroke="white" stroke-width="2"/>
        <path d="M27 14L41 28" stroke="#FF7152" stroke-width="2" stroke-linecap="round"/>
        <path d="M41 14L27 28" stroke="#FF7152" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    <div id="target_capture">
      <div id="target_capture_outer_circle"></div>
      <div id="target_capture_inner_circle"></div>
      <img id="target_capture_logo" src="../assets/capture_logo.png" alt="logo" />
    </div>
    <div class="start-timer" :class="mainTaimer == null ? 'deactivated' : ''">
      <div class="level__container-outer">
        <div class="level__container" :style="{
          transform: `translateY(-${(mainTaimer - 1) * 60}px)`
        }">
          <div class="level__num">3</div>
          <div class="level__num">2</div>
          <div class="level__num">1</div>
          <div class="level__num">Start</div>
          <div class="level__num"></div>
        </div>
      </div>

    </div>
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
    <div class="roadmap-hepler__container" :class="help !== null ? 'active' : ''">
      <div class="roadmap-hepler__outer">
        <div class="roadmap-hepler" :key="1" :class="help == 1 ? 'active' : ''">
          <div class="roadmap-hepler__drag">
            <div class="roadmap-hepler__drag-line"></div>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 128 128" style="enable-background:new 0 0 512 512" xml:space="preserve" class="roadmap-hepler__click-icon"><g><g xmlns="http://www.w3.org/2000/svg"><path d="M64,0a64,64,0,1,0,64,64A64.073,64.073,0,0,0,64,0Zm60.5,64C124.5,71,99.653,78.8,64,78.8c-5.018,0-9.812-.159-14.362-.444-.285-4.551-.445-9.345-.445-14.363C49.193,28.344,57,3.5,64,3.5A60.569,60.569,0,0,1,124.5,64ZM57.4,3.864c-5.818,7.29-9.561,24.028-11.015,42.5-3.681.286-7.279.659-10.7,1.12a1.75,1.75,0,0,0,.231,3.484,1.878,1.878,0,0,0,.235-.015c3.2-.431,6.555-.783,9.99-1.059-.291,4.666-.441,9.407-.441,14.1s.15,9.446.441,14.115C20.322,76.057,3.5,69.758,3.5,64A60.582,60.582,0,0,1,57.4,3.864ZM3.867,70.6c7.292,5.82,24.037,9.563,42.513,11.016,1.453,18.477,5.2,35.221,11.016,42.513A60.6,60.6,0,0,1,3.867,70.6ZM64,124.5c-5.761,0-12.059-16.822-14.114-42.634,4.669.292,9.413.441,14.114.441s9.438-.149,14.1-.44c-.289,3.585-.66,7.082-1.116,10.4a1.749,1.749,0,0,0,1.5,1.972,1.784,1.784,0,0,0,.241.016,1.748,1.748,0,0,0,1.731-1.511c.488-3.548.881-7.289,1.18-11.126,18.47-1.454,35.208-5.2,42.5-11.015A60.582,60.582,0,0,1,64,124.5Z" fill="#ffffff" data-original="#000000" style=""/><path d="M12.586,56.411a1.756,1.756,0,0,0,.635-.12A78.43,78.43,0,0,1,24.474,53a1.75,1.75,0,0,0-.76-3.417,82.072,82.072,0,0,0-11.763,3.448,1.751,1.751,0,0,0,.635,3.382Z" fill="#ffffff" data-original="#000000" style=""/><path d="M107.043,53.843a70.6,70.6,0,0,1,7.737,2.448,1.75,1.75,0,0,0,1.268-3.262,73.814,73.814,0,0,0-8.126-2.574,1.75,1.75,0,0,0-.879,3.388Z" fill="#ffffff" data-original="#000000" style=""/><path d="M58.089,47.507a1.75,1.75,0,0,0,1.749,1.72h.031c3.925-.068,7.977-.038,11.911.093h.06a1.75,1.75,0,0,0,.057-3.5c-3.992-.133-8.1-.163-12.088-.094A1.75,1.75,0,0,0,58.089,47.507Z" fill="#ffffff" data-original="#000000" style=""/><path d="M83.661,50.04c4.1.366,8.07.85,11.794,1.438a1.727,1.727,0,0,0,.275.022A1.75,1.75,0,0,0,96,48.021c-3.8-.6-7.85-1.094-12.03-1.467a1.75,1.75,0,1,0-.311,3.486Z" fill="#ffffff" data-original="#000000" style=""/><path d="M78.691,56.637c.077,2.412.116,4.888.116,7.36q0,2.3-.044,4.549a1.75,1.75,0,0,0,1.715,1.784h.036a1.751,1.751,0,0,0,1.749-1.716q.043-2.288.044-4.617c0-2.508-.039-5.022-.118-7.472a1.75,1.75,0,0,0-3.5.112Z" fill="#ffffff" data-original="#000000" style=""/><path d="M77,102.608a1.751,1.751,0,0,0-2.093,1.321,77.439,77.439,0,0,1-3.2,10.848,1.75,1.75,0,1,0,3.262,1.268A80.9,80.9,0,0,0,78.322,104.7,1.75,1.75,0,0,0,77,102.608Z" fill="#ffffff" data-original="#000000" style=""/><path d="M76.144,30.275c.486,2.791.914,5.756,1.272,8.811a1.749,1.749,0,0,0,1.736,1.546,1.792,1.792,0,0,0,.206-.012,1.751,1.751,0,0,0,1.535-1.942c-.367-3.119-.8-6.148-1.3-9a1.75,1.75,0,1,0-3.448.6Z" fill="#ffffff" data-original="#000000" style=""/><path d="M74.318,21.6a1.751,1.751,0,0,0,3.395-.855,75.356,75.356,0,0,0-2.745-8.794,1.75,1.75,0,0,0-3.262,1.269A71.646,71.646,0,0,1,74.318,21.6Z" fill="#ffffff" data-original="#000000" style=""/></g></g></svg>
          </div>
          <div class="roadmap-hepler__drag-ttl">
            CLICK ON SPHERES <br>TO SHOOT
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {
  target_vertex,
  wave_vertex,
  galaxy_vertex,
  spiral_part_vertex
} from '../assets/shaders/vertex.js';
import {
  target_fragment,
  wave_fragment,
  galaxy_fragment,
  spiral_part_fragment
} from '../assets/shaders/fragment.js';
const TWEEN = require('@tweenjs/tween.js');
export default {
  name: 'ThreeTest',
  data () {
    return {
      threeMounted: true,
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
      particles: null,
      level: 1,
      totalLevels: 4,
      score: 0,
      help: null,
      mainTaimer: 1,
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
      gameStart: false,
      stars: null,
      bloomPass: null,
      composer: null,
      renderScene: null,
      params: {
        exposure: 0,
        bloomStrength: 5,
        bloomThreshold: 0,
        bloomRadius: 0
      },
      direction: "",
      directionX: "",
      oldX: 0,
      oldY: 0,
      galMesh: null,
      galUniforms: null,
      gSMesh: null,
      audio: null,
      mainTrack: false,
      audioExplosion: null,
      audioTunnel: null,
      spinnerDelta: 0,
      controls: null,
      colors: [
        new THREE.Color(0xFF7152),
        new THREE.Color(0xF59337),
        new THREE.Color(0xE10FEC),
        new THREE.Color(0x5910C5),
        new THREE.Color(0x3F057E)
      ],
      tunnelAnim: false,
      spiralUniform: null,
      spiralParticlesMesh: null,
      tubePercentage: 0,
      tubePath: null,
      tubeLight: null
    }
  },
  methods: {
    soundFunc () {
      if(this.$store.state.sound) {
        this.$store.commit('setSound',false);
      }
      else{
        this.$store.commit('setSound',true);
      }
    },
    mainTimerStart () {
      setTimeout(() => {
        this.mainTaimer = 2;
      }, 1000);
      setTimeout(() => {
        this.mainTaimer = 3;
      }, 2000);
      setTimeout(() => {
        this.mainTaimer = 4;
      }, 3000);
      setTimeout(() => {
        this.mainTaimer = 5;
        this.help = 1;
      }, 4000);
      setTimeout(() => {
        this.mainTaimer = 6;
      }, 6000);
      setTimeout(() => {
        this.mainTaimer = null;
      }, 7000);
      setTimeout(() => {
        this.help = null;
      }, 10000);
    },
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
      this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 10000);
      if (this.intro) {
        this.camera.position.z = 1;
      } else {
        this.camera.position.z = 18;
      }

      var listener = new THREE.AudioListener();
      var listener2 = new THREE.AudioListener();
      var listener3 = new THREE.AudioListener();
      this.camera.add(listener);
      this.camera.add(listener2);
      this.camera.add(listener3);

      var audioLoader = new THREE.AudioLoader();
      var audioLoader2 = new THREE.AudioLoader();
      var audioLoader3 = new THREE.AudioLoader();

      let lAudio = new THREE.Audio(listener);
      let explosion = new THREE.Audio(listener2);
      let tunnelWhoop = new THREE.Audio(listener3);

      let sound = this.$store.state.sound;
      audioLoader.load( './three_sounds/main_track.mp3', function(buffer) {
        lAudio.setBuffer(buffer);
        lAudio.setLoop(true);
        lAudio.setVolume(1);
          if (sound) {
            lAudio.play();
          }
      },
        function (xhr) {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (err) {
          console.log('Error: ' + err);
        }
      );

      audioLoader2.load( './three_sounds/explosion.mp3', function(buffer) {
        explosion.setBuffer(buffer);
        explosion.setLoop(true);
        explosion.setVolume(1);
      },
        function (xhr) {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (err) {
          console.log('Error: ' + err);
        }
      );

      audioLoader3.load( './three_sounds/portal.mp3', function(buffer) {
        tunnelWhoop.setBuffer(buffer);
        tunnelWhoop.setLoop(true);
        tunnelWhoop.setVolume(1);
        tunnelWhoop.playbackRate = 5;
      },
        function (xhr) {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (err) {
          console.log('Error: ' + err);
        }
      );

      this.audio = lAudio;
      this.audioExplosion = explosion;
      this.audioTunnel = tunnelWhoop;

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(width, height);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableZoom = true;
      this.controls.screenSpacePanning = false;

      this.renderScene = new RenderPass(this.scene, this.camera);

      this.bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 0.85);
      this.bloomPass.threshold = this.params.bloomThreshold;
      this.bloomPass.strength = this.params.bloomStrength;
      this.bloomPass.radius = this.params.bloomRadius;
      this.bloomPass.exposure = this.params.exposure;

      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(this.renderScene);
      this.composer.addPass(this.bloomPass);

      document.getElementById("webgl-container").appendChild(this.renderer.domElement);
      this.clock = new THREE.Clock();
      var sLight = new THREE.SpotLight(0xffffff);
      sLight.position.set(-100, 100, 100);
      this.scene.add(sLight);
      var aLight = new THREE.AmbientLight( 0xffffff );
      this.scene.add(aLight);

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
        let sprite = new THREE.TextureLoader().load(require("../assets/circle2.png"));
        let starMaterial = new THREE.PointsMaterial({
          color: 0xaaaaaa,
          size: 3,
          map: sprite
        });
        this.stars = new THREE.Points(starsGeometry, starMaterial);
        this.stars.position.z = -2000;
        this.scene.add(this.stars);
      }
    },
    spiralParticles: function () {
      const particleCount = 20000;
      const radius = 600;

      const loader = new THREE.TextureLoader();
	    const sprite = loader.load(require('../assets/spiral_circle.png'));
      this.spiralUniform = {
        map: {
          value: sprite
        },
        globalTime: {
          value: 0
        },
        baseColor: {
          value: new THREE.Color( 0xffffff )
        }
      };

      const material = new THREE.ShaderMaterial( {
        uniforms: this.spiralUniform,
        vertexShader: spiral_part_vertex,
        fragmentShader: spiral_part_fragment,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent : true,
        vertexColors: THREE.VertexColors
      });

      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      const colors = [];
      const times = [];

      const point = new THREE.Vector3();
      const color = new THREE.Color();

      for (let i = 0; i < particleCount; i++) {
        getRandomPointOnSphere(radius, point);

        color.setHSL(i / particleCount, 0.7, 0.7);

        vertices.push(point.x, point.y, point.z);
        colors.push(color.r, color.g, color.b);
        times.push(i / particleCount);
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.setAttribute('time', new THREE.Float32BufferAttribute(times, 1));

      function getRandomPointOnSphere(r, v) {
        var angle = Math.random() * Math.PI * 2;
        var u = Math.random() * 2 - 1;

        v.x = Math.cos( angle ) * Math.sqrt( 1 - Math.pow( u, 2 ) ) * r;
        v.y = Math.sin( angle ) * Math.sqrt( 1 - Math.pow( u, 2 ) ) * r;
        v.z = u * r;
      }

      this.spiralParticlesMesh = new THREE.Points(geometry, material);
      this.spiralParticlesMesh.position.z = -2000;
      this.spiralParticlesMesh.position.x = 500;
      this.scene.add(this.spiralParticlesMesh);
    },
    secondLevelTunnel: function () {
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
      let sprite = new THREE.TextureLoader().load(require("../assets/circle2.png"));
      let starMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 3,
        map: sprite
      });
      this.stars = new THREE.Points(starsGeometry, starMaterial);
      this.stars.position.z = -1000;
      this.scene.add(this.stars);

      const spaceLoader = new THREE.TextureLoader();
      const space = spaceLoader.load(require("../assets/space.jpg"));

      const tunnelGeo = new THREE.CylinderGeometry(100, 100, 1800, 32, 1, true);
      const tunnelMat = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        //map: space,
        //side: THREE.DoubleSide
      });
      const tunnel = new THREE.Mesh(tunnelGeo, tunnelMat);
      tunnel.rotation.x = 1.57;
      tunnel.position.z = -4000;
      this.scene.add(tunnel);

      let step = 2200;
      let colorStep = 0;
      for (let i = 0; i < 18; i++) {
        let pGeo = new THREE.RingGeometry(98, 100, 10);
        let pMat = new THREE.MeshBasicMaterial({
          color: this.colors[colorStep]
        });
        let portalRing = new THREE.Mesh(pGeo, pMat);
        portalRing.rotation.x = 275;
        portalRing.position.y = step;
        tunnel.add(portalRing);
        step = step - 100;
        colorStep++;
        if (colorStep > 5) {
          colorStep = 0;
        }
      }

      new TWEEN.Tween(this.stars.position)
      .to({ z: 2000 }, 15000)
      .easing(TWEEN.Easing.Linear.None)
      .start();

      new TWEEN.Tween(tunnel.position)
      .to({ z: 100 }, 12000)
      .easing(TWEEN.Easing.Linear.None)
      .onComplete(() => {
        this.audioTunnel.stop();
      })
      .start();

      let A = new TWEEN.Tween(this.bloomPass)
      .to({ strength: 4 }, 3000)
      .easing(TWEEN.Easing.Linear.None);

      let B = new TWEEN.Tween(this.bloomPass)
      .to({ strength: 0.5 }, 6000)
      .easing(TWEEN.Easing.Linear.None);

      A.chain(B);
      A.start();

      setTimeout(() => {
        this.audioTunnel.play();
      }, 6100);
    },
    thirdLevelTunnel: function () {
      var points = [
        [68.5,185.5],
        [1,262.5],
        [270.9,281.9],
        [345.5,212.8],
        [178,155.7],
        [240.3,72.3],
        [153.4,0.6],
        [52.6,53.3],
        [68.5,185.5]
      ];

      for (var i = 0; i < points.length; i++) {
        var x = points[i][0];
        var y = 0;
        var z = points[i][1];
        points[i] = new THREE.Vector3(x, y, z);
      }

      this.tubePath = new THREE.CatmullRomCurve3(points);

      var colors = [0xFF6138,0xFFFF9D,0xBEEB9F,0x79BD8F,0x00A388];

      for (var i = 0; i < colors.length; i++) {
        var geometry = new THREE.TubeBufferGeometry(this.tubePath, 100, (i * 2) + 4, 10, true);
        var material = new THREE.MeshBasicMaterial({
          color: colors[i],
          transparent: true,
          wireframe: true,
          opacity: ((1 - i / 5) * 0.5 + 0.1)
        });
        var tube = new THREE.Mesh(geometry, material);
        this.scene.add(tube);
      }

      this.tubeLight = new THREE.PointLight(0xffffff,1, 50);
      this.scene.add(this.tubeLight);
    },
    fourthLevelTunnel: function () {
      var points = [
        [68.5,185.5],
        [1,262.5],
        [270.9,281.9],
        [345.5,212.8],
        [178,155.7],
        [240.3,72.3],
        [153.4,0.6],
        [52.6,53.3],
        [68.5,185.5]
      ];

      for (var i = 0; i < points.length; i++) {
        var x = points[i][0];
        var y = 0;
        var z = points[i][1];
        points[i] = new THREE.Vector3(x, y, z);
      }

      this.tubePath = new THREE.CatmullRomCurve3(points);

      var colors = [0xFF6138,0xFFFF9D,0xBEEB9F,0x79BD8F,0x00A388];

      for (var i = 0; i < colors.length; i++) {
        var geometry = new THREE.TubeBufferGeometry(this.tubePath, 100, (i * 2) + 4, 10, true);
        var material = new THREE.MeshBasicMaterial({
          color: colors[i],
          transparent: true,
          wireframe: false,
          opacity: ((1 - i / 5) * 0.5 + 0.1)
        });
        var tube = new THREE.Mesh(geometry, material);
        this.scene.add(tube);
      }

      this.tubeLight = new THREE.PointLight(0xffffff,1, 50);
      this.scene.add(this.tubeLight);
    },
    randomPointSphere: function (radius) {
      if (!this.intro && !this.tunnelAnim) {
        let theta = 2 * Math.PI * Math.random();
        let phi = Math.acos(2 * Math.random() - 1);
        let dx = 0 + (radius * Math.sin(phi) * Math.cos(theta));
        let dy = 0 + (radius * Math.sin(phi) * Math.sin(theta));
        let dz = 0 + (radius * Math.cos(phi));
        return new THREE.Vector3(dx, dy, dz);
      }
    },
    mathRandom: function (num = 1) {
      if (!this.intro && !this.tunnelAnim) {
        var setNumber = - Math.random() * num + Math.random() * num;
        return setNumber;
      }
    },
    addHolder: function () {
      if (!this.intro && !this.tunnelAnim) {
        this.holder = new THREE.Object3D();
        this.holder.name = "holder"
        let loader = new OBJLoader();

        for (var i = 0; i < this.totalTargets; i++) {
          this.geometry = new THREE.IcosahedronGeometry(15, 16);
          var targetTexLoader = new THREE.TextureLoader();
          var targetTexture = targetTexLoader.load(require("../assets/moon.png"));
          this.uniforms = {
            targetTex: { type: "t", value: targetTexture },
            amplitude: { value: 0.0 }
          };
          const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.vertex,
            fragmentShader: this.fragment,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            wireframe: true
          });
          var cube = new THREE.Mesh(this.geometry, material);
          cube.position.x = i === 0 ? 100 : i * Math.random() * 50;
          cube.position.y = i === 0 ? 100 : i * Math.random() * 50;
          cube.name = "cubeName" + i;
          let objInst = cube;
          loader.load('./three_models/man.obj', function(obj){
            obj.position.y = -5;
            objInst.add(obj);
          });
          cube = objInst;

          var spinner = new THREE.Object3D();
          spinner.rotation.x = i * 2.5 * Math.PI;
          spinner.name = "spinnerName" + i;
          spinner.add(cube);
          this.holder.add(spinner);
        }
        this.scene.add(this.holder);

        const partLoader = new THREE.TextureLoader();
        const partTexture = partLoader.load(require("../assets/circle2.png"));

        let starsGeometry = new THREE.BufferGeometry();
        const vertices = [];
        const materials = [];
        for (let i = 0; i < 20000; i++) {
          const x = Math.random() * 1000 - 500;
          const y = Math.random() * 1000 - 500;
          const z = Math.random() * 1000 - 500;
          vertices.push(x, y, z);
        }
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        const starsMaterial = new THREE.PointsMaterial({
          size: 0.7,
          blending: THREE.AdditiveBlending,
          depthTest: false,
          transparent: true,
          map: partTexture,
          alphaTest: 0.5,
          sizeAttenuation: true
        });

        starsMaterial.color.setHSL(1.0, 0.3, 0.7);
        this.particles = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(this.particles);
        this.galaxy();
        this.spiralParticles();
      }
    },
    animate: function() {
      if (this.threeMounted) {
        if (this.intro) {
          this.scene.children[2].position.z += 20;
        }

        this.controls.update();
        requestAnimationFrame(this.animate);
        TWEEN.update();
        this.render();
      }
    },
    render: function () {
      if (!this.intro) {
        if (this.spiralParticlesMesh !== null) {
          this.spiralUniform.globalTime.value += this.clock.getDelta() * 0.1;
          this.spiralParticlesMesh.rotation.z += 0.0005;

          if (this.spiralParticlesMesh.position.z === -2000) {
            new TWEEN.Tween(this.spiralParticlesMesh.position)
            .to({ z: -1000, x: 500 }, 5000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .start();
          }

          if (this.spiralParticlesMesh.position.z === -1000) {
            new TWEEN.Tween(this.spiralParticlesMesh.position)
            .to({ z: -2000, x: 0 }, 5000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .start();
          }
        }

        const time = Date.now() * 0.00005;
        const dTime = Date.now() * 0.001;
        this.galMesh.rotation.z += -0.01;
        this.galMesh.position.x = Math.sin(time);

        const h = (360 * (1.0 + time * 2) % 360) / 360;
        this.particles.material.color.setHSL(h, 0.5, 0.5);

        if (!this.tunnelAnim) {
          this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.005;
          this.camera.position.y += (- this.mouseY - this.camera.position.y) * 0.005;
          this.camera.lookAt(this.scene.position);

          for (let i = 0; i < this.scene.children.length; i++) {
          const object = this.scene.children[i];
            if (object instanceof THREE.Points) {
              object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
            }
          }

          this.holder.children.forEach(function (elem, index, array) {
            let x = 0;
            let y = 0;

            if (index === 0) {
              x = 100;
              y = 100;
            } else {
              x = index * 50;
              y = index * 50;
            }

            if (elem.position.x === 0 || elem.position.x === -x) {
              new TWEEN.Tween(elem.position)
              .to({ x: x }, 5000)
              .easing(TWEEN.Easing.Cubic.InOut)
              .start();
            }

            if (elem.position.x === x) {
              new TWEEN.Tween(elem.position)
              .to({ x: -x }, 5000)
              .easing(TWEEN.Easing.Cubic.InOut)
              .start();
            }

            if (elem.position.y === 0 || elem.position.y === -y) {
              new TWEEN.Tween(elem.position)
              .to({ y: y}, 5000)
              .easing(TWEEN.Easing.Cubic.InOut)
              .start();
            }

            if (elem.position.y === y) {
              new TWEEN.Tween(elem.position)
              .to({ y: -y }, 5000)
              .easing(TWEEN.Easing.Cubic.InOut)
              .start();
            }

            elem.rotation.y += (0.001 * (6 - index));
            elem.children[0].rotation.x += 0.01;
            elem.children[0].rotation.y += 0.01;
          });
        } else {
          if (this.level == 1) {
            this.camera.position.x = 0;
            this.camera.position.y = 0;
            this.camera.position.z = 500;
          }

          if (this.level == 2 || this.level == 3) {
            if (this.tubePath !== null) {
              this.tubePercentage += 0.003;
              var p1 = this.tubePath.getPointAt(this.tubePercentage % 1);
              var p2 = this.tubePath.getPointAt((this.tubePercentage + 0.01) % 1);
              this.camera.position.set(p1.x,p1.y,p1.z);
              this.camera.lookAt(p2);
              this.tubeLight.position.set(p2.x, p2.y, p2.z);
            }
          }
        }

        var delta = this.clock.getDelta();

        this.renderer.autoClear = false;
        this.renderer.clear();
        this.renderer.setScissorTest(true);
        this.renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
        this.renderer.render(this.scene, this.camera);
        this.composer.render();
        let badgesParent = document.getElementById('badges-container');
        badgesParent = badgesParent.hasChildNodes() === null ? false : badgesParent.hasChildNodes();

        if (this.badgeScenes.length > 0 && badgesParent) {
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
        this.composer.render();
      }
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.physicallyCorrectLights = true;
    },
    addExplosion: function (point) {
      //Object Explosion
      var geometry = new THREE.IcosahedronGeometry(1.5, 60);
      var timeNow = this.clock.getElapsedTime();

      var targetTexLoader = new THREE.TextureLoader();
      var targetTexture = targetTexLoader.load(require("../assets/moon.png"));

      this.uniforms = {
        targetTex: { type: "t", value: targetTexture },
        time: { type: "f", value: 0.0 },
        distortion: { type: "f", value: 0.0 },
        alpha: { type: "f", value: 1.0 }
      };

      const material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: wave_vertex,
        fragmentShader: wave_fragment,
        transparent: true,
        opacity: 0
      });

      var part = new THREE.Points(geometry, material);
      part.position.x = point.x;
      part.position.y = point.y;
      part.position.z = point.z;
      this.scene.add(part);

      new TWEEN.Tween(this.uniforms.distortion)
      .to({ value: 60 }, 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();

      new TWEEN.Tween(this.uniforms.alpha)
      .to({ value: 0 }, 800)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();

      let bloomA = new TWEEN.Tween(this.bloomPass)
      .to({ strength: 30 }, 300)
      .easing(TWEEN.Easing.Quintic.Out);

      let bloomB = new TWEEN.Tween(this.bloomPass)
      .to({ strength: 0.5 }, 300)
      .easing(TWEEN.Easing.Quintic.Out);

      bloomA.chain(bloomB);
      bloomA.start();

      setTimeout(() => {
        this.scene.remove(part);
      }, 1200);

      this.audioExplosion.play();

      setTimeout(() => {
        this.audioExplosion.stop();
      }, 3000);

      //End of Object Explosion
    },
    onDocumentMouseUp: function(event) {
      event.preventDefault();

      if (!this.intro && !this.tunnelAnim) {
        let catchTarget = document.getElementById('target_capture_inner_circle');
        let catchTargetLogo = document.getElementById('target_capture_logo');

        catchTarget.style['transform'] = 'scale(1)';
        catchTargetLogo.style['transform'] = 'scale(1)';
      }
    },
    onDocumentMouseDown: function(event) {
      event.preventDefault();

      if (!this.intro && !this.tunnelAnim) {
        let catchTarget = document.getElementById('target_capture_inner_circle');
        let catchTargetLogo = document.getElementById('target_capture_logo');

        catchTarget.style['transform'] = 'scale(0.2)';
        catchTargetLogo.style['transform'] = 'scale(0.2)';

        if (this.complete) {
          this.complete = false;
          this.score = 0;
          this.tunnelAnim = true;
          this.badgeAnimation = false;
          if (this.level == 1) {
            this.secondLevelTunnel();
            setTimeout(() => {
              while(this.scene.children.length > 2){
                this.scene.remove(this.scene.children[2]);
                this.scene.remove(this.scene.children[3]);
              }
              this.tunnelAnim = false;
              this.params.bloomStrength = 0.5;
              this.bloomPass.strength = this.params.bloomStrength;
              this.restartScene();
            }, 13000);
          } else if (this.level == 2) {
            this.thirdLevelTunnel();
            setTimeout(() => {
              while(this.scene.children.length > 2){
                this.scene.remove(this.scene.children[2]);
                this.scene.remove(this.scene.children[3]);
              }
              this.tunnelAnim = false;
              this.params.bloomStrength = 0.5;
              this.bloomPass.strength = this.params.bloomStrength;
              this.restartScene();
            }, 13000);
          } else if (this.level == 3) {
            this.fourthLevelTunnel();
            setTimeout(() => {
              while(this.scene.children.length > 2){
                this.scene.remove(this.scene.children[2]);
                this.scene.remove(this.scene.children[3]);
              }
              this.tunnelAnim = false;
              this.params.bloomStrength = 0.5;
              this.bloomPass.strength = this.params.bloomStrength;
              this.restartScene();
            }, 13000);
          } else {
            this.tunnelAnim = false;
            this.restartScene();
          }

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
                  bCamera = new THREE.PerspectiveCamera(50, 1, 1, 10);
                  bCamera.position.z = 4;
                  bScene.userData.camera = bCamera;

                  const badgeLoader = new THREE.TextureLoader();
                  const badgeTex = badgeLoader.load(badgeTextures[i]);
                  bMat = new THREE.MeshBasicMaterial({
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
      if (this.level < this.totalLevels) {
        this.speed += 0.005;
        this.totalTargets += 1;
        this.level += 1;
      } else {
        this.speed = 0.01;
        this.totalTargets = 3;
        this.level = 1;
      }
      console.log(this.comments[this.level-1] +  ": Level " + this.level + " of " + this.totalLevels)
      this.animateText = true;
      setTimeout(() => {
        this.commentNow = this.comments[this.level-1];
        this.playerStatusNow = this.playerStatuses[this.level-1];
      },1500)
      setTimeout(() => {
        this.animateText = false
      },2500)
      this.scene.remove(this.holder);
      //this.scene.remove(this.pointer);
      if (this.level == 1) {
        this.badgeScenes = [];
      }

      this.scene.remove(this.particles);
      this.scene.remove(this.gSMesh);
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

      let targetAnim = document.getElementById('target_capture_outer_circle');

      if (event.pageY < this.oldY) {
        this.direction = "up";
        targetAnim.style['transform'] = 'rotateX(55deg)';
      } else if (event.pageY > this.oldY) {
        this.direction = "down";
        targetAnim.style['transform'] = 'rotateX(0deg)';
      } else if (event.pageX < this.oldX) {
        this.directionX = "left";
        targetAnim.style['transform'] = 'rotateY(-50deg)';
      } else if (event.pageX > this.oldX) {
        this.directionX = "right";
        targetAnim.style['transform'] = 'rotateY(50deg)';
      }

      this.oldY = event.pageY;
      this.oldX = event.pageX;

      if (!this.intro && !this.tunnelAnim) {
        this.pointerMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointerMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.mouseX = event.clientX - this.windowHalfX;
        this.mouseY = event.clientY - this.windowHalfY;
        let vector = new THREE.Vector3(this.pointerMouse.x, this.pointerMouse.y, 0.5);
        vector.unproject(this.camera);
        let dir = vector.sub(this.camera.position).normalize();
        let distance = -this.camera.position.z / dir.z;
        let pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
        this.vectors.push(pos);
        this.drawCurve(this.vectors);

        let x = event.clientX;
        let y = event.clientY;
        let targetCapture = document.getElementById('target_capture');

        let newposX = x - 40;
        let newposY = y - 40;

        targetCapture.style['transform'] = 'translate3d(' + newposX + 'px,' + newposY + 'px,0px)';
      }
    },
    galaxy: function () {
      const loader = new THREE.TextureLoader();
      const texture = loader.load(require("../assets/galaxySphere.png"));

      this.galUniforms = {
        pointTexture: { type: "t", value: texture },
        uCameraPos: { type: "3f", value: new THREE.Vector3(0, 0, 1000) },
      };

      const galaxyMat = new THREE.ShaderMaterial({
        uniforms:       this.galUniforms,
        vertexShader:   galaxy_vertex,
        fragmentShader: galaxy_fragment,
        transparent:    true,
        depthTest:      false,
        blending:       THREE.AdditiveBlending
      });

      var variance = 5.0 * (Math.random() + Math.random() + Math.random()) / 3.0;
      var arms = 7;
      var twist = 0.6 + 1.5 * (Math.random() + Math.random() + Math.random() + Math.random() + Math.random());
      var pinch = 0.7 + 1.5 * (Math.random() + Math.random() + Math.random() + Math.random()) / 4.0;

      var clouds = 50 * arms;
      var stars = 1000;

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
        var r = Math.pow(g, pinch) * 500;
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

        var s = Math.pow(512.0, Math.pow(f * Math.random(), 0.5));
        alphas[i] = Math.random() * (400.0 - s) / 5000.0 * Math.pow(g, 0.3);
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
          var r = 5.0 + Math.pow(f, 1.5) / Math.pow(0.2, 1.5) * 900;
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
        alphas[i] = 0.02 + Math.random() * 0.1;
        sizes[i] = Math.random() * Math.random() * 1.0;
      }

      const galaxyGeo = new THREE.BufferGeometry();
      galaxyGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      galaxyGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      galaxyGeo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
      galaxyGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      this.galMesh = new THREE.Points(galaxyGeo, galaxyMat);
      this.galMesh.rotateX(30);
      let gSGeo = new THREE.SphereBufferGeometry(20, 30, 30);
      let gSMat = new THREE.MeshBasicMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false
      });
      this.gSMesh = new THREE.Mesh(gSGeo, gSMat);
      this.gSMesh.position.x = -300;
      this.gSMesh.add(this.galMesh);

      this.scene.add(this.gSMesh);
    }
  },
  mounted() {
    this.mainTimerStart();
    // firstAnimation
    setInterval(this.setTime, 1000);
    document.getElementById("webgl-container").addEventListener('mousedown', this.onDocumentMouseDown, false);
    document.getElementById("webgl-container").addEventListener('mouseup', this.onDocumentMouseUp, false);
    document.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('resize', this.onWindowResize, false);

    this.$store.commit('setHeader', false);
    // this.myLevel.innerText = this.comments[this.level-1] +  ": Level " + this.level + " of " + this.totalLevels;

    this.myScene();
    this.addHolder();
    this.animate();

    setTimeout(() => {
      document.getElementById('target_capture').style['opacity'] = 1;
      this.intro = false;
      this.scene.remove(this.scene.children[2]);
      this.addHolder();
      this.gameStart = true;
      this.params.bloomStrength = 0.5;
      this.bloomPass.strength = this.params.bloomStrength;
    }, 3000);
  },
  beforeDestroy () {
    document.getElementById("webgl-container").removeEventListener('mousedown', this.onDocumentMouseDown, false);
    document.getElementById("webgl-container").removeEventListener('mouseup', this.onDocumentMouseUp, false);
    document.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('resize', this.onWindowResize, false);
    this.threeMounted = false;
    this.audio.stop();

    while(this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
  },
  watch: {
    'badgeIndex': function () {
      if(this.badgeIndex == 4){
        this.statistic = true;
      }
      if(this.badgeIndex !== 4 && this.oldBadgeIndex + 1 == this.badgeIndex){
        this.oldBadgeIndex++;
        this.badgeAnimation = true;
      }
    },
    '$store.state.sound': function () {
      if (this.$store.state.sound) {
        this.audio.play();
      } else {
        this.audio.stop();
      }
    }
  }
}
</script>

<style scoped>
  .game-sound-button{
    position: absolute;
    z-index: 5;
    left: 40px;
    top: 40px;
    cursor: pointer;
  }
  .game-sound-button svg{
    width: 16px;
  }
  #music-sound{
    width: 100px;
    height: 30px;
    border: 1px solid #FFFFFF;
    position: absolute;
    right: 90%;
    top: 10%;
    cursor: pointer;
  }
  #target_capture{
    width: 80px;
    height: 80px;
    border-radius: 50%;
    position: absolute;
    transform: translate3d(-50%,-50%,0);
    pointer-events: none;
    opacity: 0;
  }
  #target_capture_outer_circle{
    width: 100%;
    height: 100%;
    border: 2px solid #ffffff;
    border-radius: 50%;
    position: absolute;
    top: 0px;
    left: 0px;
    transition: 0.5s;
  }
  #target_capture_inner_circle{
    width: 75%;
    height: 75%;
    border-style: solid;
    border-width: 2px;
    border-color: #FF7152;
    border-radius: 50%;
    position: absolute;
    top: 10px;
    left: 10px;
    transition: 0.2s;
  }
  #target_capture_logo{
    width: 40%;
    height: 40%;
    border-radius: 50%;
    position: absolute;
    top: 25px;
    left: 25px;
    transition: 0.2s;
  }
  .start-timer{
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  }
  .start-timer.deactivated{
    display: none;
    pointer-events: none;
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
  .level__container{
    display: flex;
    flex-direction: column;
    transition: 1s cubic-bezier(.79,.01,.15,.99);
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
    cursor: none;
  }
  .hit {
    font-weight: bold;
    color: red;
  }
</style>
