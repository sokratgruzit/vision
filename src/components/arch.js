//render func
if (this.badgeScenes.length > 0) {
  for (let i = 0; i < this.badgeScenes.length; i++) {
    const badgeCont = document.getElementById('badges-container');
    const rect = badgeCont.getBoundingClientRect();
    console.log(this.b)
    if (this.badgeMesh.scale.x < 1) {
      this.badgeMesh.scale.x += 0.01;
      this.badgeMesh.scale.y += 0.01;
      this.badgeMesh.scale.z += 0.01;
    } else {
      this.badgeMesh.rotation.y += 0.01;
    }

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
      this.renderer.render(this.badgeScene, this.badgeCamera);
    }
  }
}

//this.renderer.autoClear = false;
      //this.renderer.clear();
      //this.renderer.setScissorTest(true);
//restart scene
let badgeTextures = [
  require("../assets/badge_star.png"),
  require("../assets/badge_star2.png"),
];

let bIndex = 0;

if (this.level == 2) {
  bIndex = 1;
} else if (this.level == 3) {
  bIndex = 2;
}

for (let i = 0; i < bIndex; i++) {
  this.badgeScene = new THREE.Scene();
  this.badgeGeo = new THREE.CylinderGeometry(1, 1, 0.1, 25);
  this.badgeCamera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 1, 100);
  this.badgeCamera.position.set(0,0,5);
  this.badgeCamera.lookAt(this.badgeScene.position);

  const badgeLoader = new THREE.TextureLoader();
  const badgeTex = badgeLoader.load(badgeTextures[i]);

  this.badgeMat = new THREE.MeshBasicMaterial({
    roughness: 0.5,
    metalness: 1,
    flatShading: true,
    map: badgeTex
  });

  this.badgeMesh = new THREE.Mesh(this.badgeGeo, this.badgeMat);
  this.badgeMesh.rotation.z = Math.PI / 2;
  this.badgeMesh.rotation.y = Math.PI / 2;
  this.badgeMesh.scale.x = 0;
  this.badgeMesh.scale.y = 0;
  this.badgeMesh.scale.z = 0;

  this.badgeScene.add(this.badgeMesh);
  this.badgeScene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444));

  const blight = new THREE.DirectionalLight(0xffffff, 0.5);
  blight.position.set(1, 1, 1);
  this.badgeScene.add(blight);
  this.badgeScenes.push(this.badgeScene);
}