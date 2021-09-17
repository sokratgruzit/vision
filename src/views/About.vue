<template>
  <div>
    <div id="about-container"></div>
  </div>
</template>

<script>
  import * as THREE from 'three';
  import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
  import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
  import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
  const TWEEN = require('@tweenjs/tween.js');
  export default {
    name: 'About',
    data () {
      return {
        scene: null,
        cube: null,
        camera: null,
        renderer: null,
        time: 0,
        raycaster: new THREE.Raycaster(),
        mouse: new THREE.Vector2(),
      }
    }
  }
</script>
<style scoped>
</style>
