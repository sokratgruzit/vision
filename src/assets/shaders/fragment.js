export let roadmap_fragment = `
uniform sampler2D tex;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
varying float noise;

void main() {
  vec3 color = vec3( vUv * ( 1. - 2. * noise ), 0.0 );
  vec4 tt = texture2D(tex, vUv);
  gl_FragColor = vec4(vUv,0.,1.);
  gl_FragColor = tt;
}
`;

export let line_fragment = `
uniform sampler2D tex;
uniform vec4 resolution;
uniform float opacity;
varying vec2 vUv;
varying vec3 vPosition;
varying float noise;

void main() {
  //vec3 color = vec3( vUv * ( 5. - 2. * noise ), 0.0 );
  vec4 tt = texture2D(tex, vUv);
  gl_FragColor = vec4(vUv,0.,1.);
  gl_FragColor = tt * opacity;
}
`;

export let line_fragment1 = `
uniform sampler2D tex;
uniform vec4 resolution;
uniform float opacity;
varying vec2 vUv;
varying vec3 vPosition;
varying float noise;

void main() {
  //vec3 color = vec3( vUv * ( 5. - 2. * noise ), 0.0 );
  vec4 tt = texture2D(tex, vUv);
  gl_FragColor = vec4(vUv,0.,1.);
  gl_FragColor = tt * opacity;
}
`;

export let line_fragment2 = `
uniform sampler2D tex;
uniform vec4 resolution;
uniform float opacity;
varying vec2 vUv;
varying vec3 vPosition;
varying float noise;

void main() {
  //vec3 color = vec3( vUv * ( 5. - 2. * noise ), 0.0 );
  vec4 tt = texture2D(tex, vUv);
  gl_FragColor = vec4(vUv,0.,1.);
  gl_FragColor = tt * opacity;
}
`;

export let part_fragment = `
varying vec3 vColor;
uniform sampler2D pointTexture;
varying float vAlpha;

void main() {
  gl_FragColor = vec4(vColor, vAlpha);
  gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
}
`;