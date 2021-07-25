<template>
  <div class="game__container" :style="{
    backgroundImage: 'url(' + require(`@/assets/sphere.jpg`) + ')',
    backgroundSize: 'cover'
    }"
  >
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
      <p>Level
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
      </p>
      <p>Difficult<span>{{this.commentNow}}</span></p>
      <p>Time
        <countdown :time="6000" @finish="(vac) => counterFinish(vac)()">
          <div class="timer" slot-scope="props">
            <div class="timer-col">
              {{ props.minutes }}:
            </div>
            <div class="timer-col">
              {{ props.seconds }}
            </div>
          </div>
        </countdown>
      </p>
      <p>My Score<span>{{this.score}}</span></p>
      <p :style="{ position: 'relative' }">
        Player: <span :style="{ color: 'red' }">{{this.playerStatusNow}}</span>
      <div id="badges-container" class="badges"></div>
      </p>
    </div>
    <div id="webgl-container"></div>
  </div>
</template>

<script>
  import * as THREE from 'three';
  import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
  import { TessellateModifier } from 'three/examples/jsm/modifiers/TessellateModifier.js';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  const TWEEN = require('@tweenjs/tween.js');
  export default {
    name: 'ThreeTest',
    data () {
      return {
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
        vertex: `
        uniform float amplitude;
        attribute vec3 customColor;
        attribute vec3 displacement;
        varying vec3 vNormal;
        varying vec3 vColor;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vNormal = normal;
          vColor = customColor;
          vec3 newPosition = position + normal * amplitude * displacement;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
        fragment: `
        varying vec3 vNormal;
        varying vec3 vColor;
        uniform sampler2D targetTex;
        varying vec2 vUv;
        vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
        float mod289(float x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
        vec4 permute(vec4 x) {
        return mod289(((x*34.0)+1.0)*x);
        }
        float permute(float x) {
        return mod289(((x*34.0)+1.0)*x);
        }
        vec4 taylorInvSqrt(vec4 r)
        {
        return 1.79284291400159 - 0.85373472095314 * r;
        }
        float taylorInvSqrt(float r)
        {
        return 1.79284291400159 - 0.85373472095314 * r;
        }
        vec4 grad4(float j, vec4 ip)
        {
        const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
        vec4 p,s;
        p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
        p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
        s = vec4(lessThan(p, vec4(0.0)));
        p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;
        return p;
        }
        // (sqrt(5) - 1)/4 = F4, used once below
        #define F4 0.309016994374947451
        float snoise(vec4 v) {
          const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4
          0.276393202250021,  // 2 * G4
          0.414589803375032,  // 3 * G4
          -0.447213595499958); // -1 + 4 * G4
          // First corner
          vec4 i  = floor(v + dot(v, vec4(F4)) );
          vec4 x0 = v -   i + dot(i, C.xxxx);
          // Other corners
          // Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
          vec4 i0;
          vec3 isX = step( x0.yzw, x0.xxx );
          vec3 isYZ = step( x0.zww, x0.yyz );
          //  i0.x = dot( isX, vec3( 1.0 ) );
          i0.x = isX.x + isX.y + isX.z;
          i0.yzw = 1.0 - isX;
          //  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
          i0.y += isYZ.x + isYZ.y;
          i0.zw += 1.0 - isYZ.xy;
          i0.z += isYZ.z;
          i0.w += 1.0 - isYZ.z;
          // i0 now contains the unique values 0,1,2,3 in each channel
          vec4 i3 = clamp( i0, 0.0, 1.0 );
          vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
          vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );
          //  x0 = x0 - 0.0 + 0.0 * C.xxxx
          //  x1 = x0 - i1  + 1.0 * C.xxxx
          //  x2 = x0 - i2  + 2.0 * C.xxxx
          //  x3 = x0 - i3  + 3.0 * C.xxxx
          //  x4 = x0 - 1.0 + 4.0 * C.xxxx
          vec4 x1 = x0 - i1 + C.xxxx;
          vec4 x2 = x0 - i2 + C.yyyy;
          vec4 x3 = x0 - i3 + C.zzzz;
          vec4 x4 = x0 + C.wwww;
          // Permutations
          i = mod289(i);
          float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
          vec4 j1 = permute( permute( permute( permute (
          i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
          + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
          + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
          + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
          // Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
          // 7*7*6 = 294, which is close to the ring size 17*17 = 289.
          vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;
          vec4 p0 = grad4(j0,   ip);
          vec4 p1 = grad4(j1.x, ip);
          vec4 p2 = grad4(j1.y, ip);
          vec4 p3 = grad4(j1.z, ip);
          vec4 p4 = grad4(j1.w, ip);
          // Normalise gradients
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          p4 *= taylorInvSqrt(dot(p4,p4));
          // Mix contributions from the five corners
          vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
          vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)), 0.0);
          m0 = m0 * m0;
          m1 = m1 * m1;
          return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 ))) + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;
        }
        void main() {
          const float ambient = 0.4;
          vec3 light = vec3(1.0);
          light = normalize(light);
          float directional = max(dot(vNormal, light), 0.0);
          vec2 tPos = vec2(0, 1.3);
          gl_FragColor = texture2D(targetTex, vUv);
        }
      `,
        waveScaleUp: true,
        waveVertex: `
        varying vec2 vUv;
        varying float noise;
        uniform float time;
        vec3 mod289(vec3 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
        vec4 mod289(vec4 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
        vec4 permute(vec4 x) {
          return mod289(((x*34.0)+10.0)*x);
        }
        vec4 taylorInvSqrt(vec4 r) {
          return 1.79284291400159 - 0.85373472095314 * r;
        }
        vec3 fade(vec3 t) {
          return t*t*t*(t*(t*6.0-15.0)+10.0);
        }
        // Classic Perlin noise
        float cnoise(vec3 P) {
          vec3 Pi0 = floor(P); // Integer part for indexing
          vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
          Pi0 = mod289(Pi0);
          Pi1 = mod289(Pi1);
          vec3 Pf0 = fract(P); // Fractional part for interpolation
          vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
          vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
          vec4 iy = vec4(Pi0.yy, Pi1.yy);
          vec4 iz0 = Pi0.zzzz;
          vec4 iz1 = Pi1.zzzz;
          vec4 ixy = permute(permute(ix) + iy);
          vec4 ixy0 = permute(ixy + iz0);
          vec4 ixy1 = permute(ixy + iz1);
          vec4 gx0 = ixy0 * (1.0 / 7.0);
          vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
          gx0 = fract(gx0);
          vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
          vec4 sz0 = step(gz0, vec4(0.0));
          gx0 -= sz0 * (step(0.0, gx0) - 0.5);
          gy0 -= sz0 * (step(0.0, gy0) - 0.5);
          vec4 gx1 = ixy1 * (1.0 / 7.0);
          vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
          gx1 = fract(gx1);
          vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
          vec4 sz1 = step(gz1, vec4(0.0));
          gx1 -= sz1 * (step(0.0, gx1) - 0.5);
          gy1 -= sz1 * (step(0.0, gy1) - 0.5);
          vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
          vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
          vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
          vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
          vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
          vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
          vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
          vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
          vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
          g000 *= norm0.x;
          g010 *= norm0.y;
          g100 *= norm0.z;
          g110 *= norm0.w;
          vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
          g001 *= norm1.x;
          g011 *= norm1.y;
          g101 *= norm1.z;
          g111 *= norm1.w;
          float n000 = dot(g000, Pf0);
          float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
          float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
          float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
          float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
          float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
          float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
          float n111 = dot(g111, Pf1);
          vec3 fade_xyz = fade(Pf0);
          vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
          vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
          float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
          return 2.2 * n_xyz;
        }
        // Classic Perlin noise, periodic variant
        float pnoise(vec3 P, vec3 rep) {
          vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
          vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
          Pi0 = mod289(Pi0);
          Pi1 = mod289(Pi1);
          vec3 Pf0 = fract(P); // Fractional part for interpolation
          vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
          vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
          vec4 iy = vec4(Pi0.yy, Pi1.yy);
          vec4 iz0 = Pi0.zzzz;
          vec4 iz1 = Pi1.zzzz;
          vec4 ixy = permute(permute(ix) + iy);
          vec4 ixy0 = permute(ixy + iz0);
          vec4 ixy1 = permute(ixy + iz1);
          vec4 gx0 = ixy0 * (1.0 / 7.0);
          vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
          gx0 = fract(gx0);
          vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
          vec4 sz0 = step(gz0, vec4(0.0));
          gx0 -= sz0 * (step(0.0, gx0) - 0.5);
          gy0 -= sz0 * (step(0.0, gy0) - 0.5);
          vec4 gx1 = ixy1 * (1.0 / 7.0);
          vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
          gx1 = fract(gx1);
          vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
          vec4 sz1 = step(gz1, vec4(0.0));
          gx1 -= sz1 * (step(0.0, gx1) - 0.5);
          gy1 -= sz1 * (step(0.0, gy1) - 0.5);
          vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
          vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
          vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
          vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
          vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
          vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
          vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
          vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
          vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
          g000 *= norm0.x;
          g010 *= norm0.y;
          g100 *= norm0.z;
          g110 *= norm0.w;
          vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
          g001 *= norm1.x;
          g011 *= norm1.y;
          g101 *= norm1.z;
          g111 *= norm1.w;
          float n000 = dot(g000, Pf0);
          float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
          float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
          float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
          float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
          float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
          float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
          float n111 = dot(g111, Pf1);
          vec3 fade_xyz = fade(Pf0);
          vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
          vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
          float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
          return 2.2 * n_xyz;
        }
        float turbulence(vec3 p) {
          float w = 100.0;
          float t = -.5;
          for (float f = 1.0 ; f <= 10.0 ; f++ ){
            float power = pow( 2.0, f );
            t += abs(pnoise(vec3(power * p), vec3(10.0, 10.0, 10.0)) / power);
          }
          return t;
        }
        void main() {
          vUv = uv;
          // add time to the noise parameters so it's animated
          noise = 10.0 *  -.10 * turbulence(.5 * normal + time);
          float b = 5.0 * pnoise(0.05 * position + vec3(2.0 * time), vec3(100.0));
          float displacement = - noise + b;
          vec3 newPosition = position + normal * displacement;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
        waveFragment: `
        varying vec2 vUv;
        varying float noise;
        uniform sampler2D tExplosion;
        vec3 mod289(vec3 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
        vec4 mod289(vec4 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
        vec4 permute(vec4 x) {
          return mod289(((x*34.0)+10.0)*x);
        }
        vec4 taylorInvSqrt(vec4 r) {
          return 1.79284291400159 - 0.85373472095314 * r;
        }
        vec3 fade(vec3 t) {
          return t*t*t*(t*(t*6.0-15.0)+10.0);
        }
        // Classic Perlin noise
        float cnoise(vec3 P) {
          vec3 Pi0 = floor(P); // Integer part for indexing
          vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
          Pi0 = mod289(Pi0);
          Pi1 = mod289(Pi1);
          vec3 Pf0 = fract(P); // Fractional part for interpolation
          vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
          vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
          vec4 iy = vec4(Pi0.yy, Pi1.yy);
          vec4 iz0 = Pi0.zzzz;
          vec4 iz1 = Pi1.zzzz;
          vec4 ixy = permute(permute(ix) + iy);
          vec4 ixy0 = permute(ixy + iz0);
          vec4 ixy1 = permute(ixy + iz1);
          vec4 gx0 = ixy0 * (1.0 / 7.0);
          vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
          gx0 = fract(gx0);
          vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
          vec4 sz0 = step(gz0, vec4(0.0));
          gx0 -= sz0 * (step(0.0, gx0) - 0.5);
          gy0 -= sz0 * (step(0.0, gy0) - 0.5);
          vec4 gx1 = ixy1 * (1.0 / 7.0);
          vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
          gx1 = fract(gx1);
          vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
          vec4 sz1 = step(gz1, vec4(0.0));
          gx1 -= sz1 * (step(0.0, gx1) - 0.5);
          gy1 -= sz1 * (step(0.0, gy1) - 0.5);
          vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
          vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
          vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
          vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
          vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
          vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
          vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
          vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
          vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
          g000 *= norm0.x;
          g010 *= norm0.y;
          g100 *= norm0.z;
          g110 *= norm0.w;
          vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
          g001 *= norm1.x;
          g011 *= norm1.y;
          g101 *= norm1.z;
          g111 *= norm1.w;
          float n000 = dot(g000, Pf0);
          float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
          float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
          float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
          float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
          float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
          float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
          float n111 = dot(g111, Pf1);
          vec3 fade_xyz = fade(Pf0);
          vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
          vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
          float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
          return 2.2 * n_xyz;
        }
        // Classic Perlin noise, periodic variant
        float pnoise(vec3 P, vec3 rep) {
          vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
          vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
          Pi0 = mod289(Pi0);
          Pi1 = mod289(Pi1);
          vec3 Pf0 = fract(P); // Fractional part for interpolation
          vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
          vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
          vec4 iy = vec4(Pi0.yy, Pi1.yy);
          vec4 iz0 = Pi0.zzzz;
          vec4 iz1 = Pi1.zzzz;
          vec4 ixy = permute(permute(ix) + iy);
          vec4 ixy0 = permute(ixy + iz0);
          vec4 ixy1 = permute(ixy + iz1);
          vec4 gx0 = ixy0 * (1.0 / 7.0);
          vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
          gx0 = fract(gx0);
          vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
          vec4 sz0 = step(gz0, vec4(0.0));
          gx0 -= sz0 * (step(0.0, gx0) - 0.5);
          gy0 -= sz0 * (step(0.0, gy0) - 0.5);
          vec4 gx1 = ixy1 * (1.0 / 7.0);
          vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
          gx1 = fract(gx1);
          vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
          vec4 sz1 = step(gz1, vec4(0.0));
          gx1 -= sz1 * (step(0.0, gx1) - 0.5);
          gy1 -= sz1 * (step(0.0, gy1) - 0.5);
          vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
          vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
          vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
          vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
          vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
          vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
          vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
          vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
          vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
          g000 *= norm0.x;
          g010 *= norm0.y;
          g100 *= norm0.z;
          g110 *= norm0.w;
          vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
          g001 *= norm1.x;
          g011 *= norm1.y;
          g101 *= norm1.z;
          g111 *= norm1.w;
          float n000 = dot(g000, Pf0);
          float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
          float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
          float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
          float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
          float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
          float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
          float n111 = dot(g111, Pf1);
          vec3 fade_xyz = fade(Pf0);
          vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
          vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
          float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
          return 2.2 * n_xyz;
        }
        float random(vec3 scale, float seed) {
          return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
        }
        void main() {
          // get a random offset
          float r = .01 * random(vec3(12.9898, 78.233, 151.7182), 0.0);
          // lookup vertically in the texture, using noise and offset
          // to get the right RGB colour
          vec2 tPos = vec2(0, 1.3 * noise + r);
          vec4 color = texture2D(tExplosion, tPos);
          gl_FragColor = vec4(color.rgb, 1.0);
        }
      `,
        waveUniforms: {
          tExplosion: {
            type: "t",
            value: new THREE.TextureLoader().load(require("../assets/smoke.png"))
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
        badgeAnimation:false
      }
    },
    watch: {
      'badgeIndex': function () {
        if(this.oldBadgeIndex + 1 == this.badgeIndex){
          this.oldBadgeIndex++;
          this.badgeAnimation = true;
        }
      }
    },
    methods: {
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
        this.camera.position.z = 18;
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
          this.geometry = new THREE.IcosahedronGeometry(1.5,0);
          var targetTexLoader = new THREE.TextureLoader();
          var targetTexture = targetTexLoader.load(require("../assets/metal.jpg"));
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
      },
      animate: function() {
        //Sphere Beckground Animation
        this.sphereBg.rotation.x += 0.003;
        this.sphereBg.rotation.y += 0.001;
        this.sphereBg.rotation.z += 0.001;
        
        requestAnimationFrame(this.animate);
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
        this.pointer.rotation.x += 0.01;
        this.pointer.rotation.y += 0.01;
        var delta = this.clock.getDelta();
        this.waveUniforms.time.value += delta;
        if (this.waveMesh !== null && this.waveScaleUp) {
          this.waveMesh.scale.x = this.waveMesh.scale.x + 0.05;
          this.waveMesh.scale.y = this.waveMesh.scale.y + 0.05;
          this.waveMesh.scale.z = this.waveMesh.scale.z + 0.05;
          if(this.waveMesh.scale.x > 3) {
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
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.physicallyCorrectLights = true;
      },
      addExplosion: function (point) {
        //Object Explosion
        var geometry = new THREE.IcosahedronGeometry(1.5,0);
        const numFaces = geometry.attributes.position.count / 3;
        var timeNow = this.clock.getElapsedTime();
        const tessellateModifier = new TessellateModifier(8, 6);
        geometry = tessellateModifier.modify(geometry);
        const displacement = new Float32Array(numFaces * 3 * 3);
        var targetTexLoader = new THREE.TextureLoader();
        var targetTexture = targetTexLoader.load(require("../assets/metal.jpg"));
        for (let f = 0; f < numFaces; f++) {
          const index = 9 * f;
          const d = 50 * (0.5 - Math.random());
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
          fragmentShader: this.fragment
        });
        var part = new THREE.Mesh(geometry, material);
        part.position.x = point.x;
        part.position.y = point.y;
        part.position.z = point.z;
        part.name = "garbage";
        part.birthDay = timeNow;
        this.scene.add(part);
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
                  bEl.style.setProperty('width', '33%');
                  bEl.style.setProperty('height', '100%');

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
                    flatShading: true,
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
        for (let i = 0; i < this.scene.children.length; i++) {
          if (this.scene.children[i].name === 'garbage') {
            this.scene.remove(this.scene.children[i]);
          }
        }
        this.badgeAnimation = false;
        console.log(this.comments[this.level-1] +  ": Level " + this.level + " of " + this.totalLevels)
        this.commentNow = this.comments[this.level-1];
        this.playerStatusNow = this.playerStatuses[this.level-1];
        this.scene.remove(this.holder);
        this.scene.remove(this.pointer);
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
    width: 100%;
    height: 70px;
    z-index: 10000000;
    display: flex;
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
  .hud p{
    flex-direction: column;
    display: flex;
    align-items: flex-end;
    font-size: 18px;
    margin-bottom: 15px;
    color: #ABB0BC;
  }
  .hud p span{
    color: #FF7152;
    font-size: 50px;
    line-height: 60px;
    color: #fff;
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
