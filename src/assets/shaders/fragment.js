export let galaxy_fragment = `
varying vec3 vColor;
uniform sampler2D pointTexture;
varying float vAlpha;

void main() {
  gl_FragColor = vec4(vColor, vAlpha);
  gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
}
`;

export let roadmap_fragment = `
varying vec2 vUv;
varying vec3 vPosition;
varying float noise;
uniform vec3 curveColor;
uniform vec3 pointColor1;
uniform vec3 pointColor2;
uniform vec3 pointColor3;
uniform vec3 pointColor4;
uniform vec3 pointColor5;
uniform vec3 uColor;
uniform float time;
uniform bool displayCurve;
varying float vAlpha;
uniform bool fadeOut;
varying float x;
varying float y;
varying float z;

void main() {
  float disc = 1. - smoothstep(-0.2, 0.5, length(gl_PointCoord - vec2(0.5)));
  disc *= 0.5;

  if (fadeOut) {
    gl_FragColor = vec4(uColor, disc * vAlpha);
  } else {
    gl_FragColor = vec4(uColor, disc);
  }

  if (displayCurve) {
    if (x > -695. && x < -640. && y > 15. && y < 20.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > -650. && x < -640. && y > 20.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > -650. && x < -540. && y > 56.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > -550. && x < -540. && y > 0.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > -550. && x < -445. && y > 0. && y < 5.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > -450. && x < -440. && y > 0. && y < 40.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > -445. && x < -390. && y > 35. && y < 40.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > -395. && x < -385. && y > 35. && y < 55.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > -390. && x < -300. && y > 50. && y < 55.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > -305. && x < -295. && y > 20. && y < 55.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > -300. && x < -200. && y > 20. && y < 25.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > -205. && x < -195. && y > -10. && y < 25.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > -200. && x < -95. && y > -10. && y < -5.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > -100. && x < -90. && y > -5. && y < 50.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > -95. && x < -45. && y > 45. && y < 50.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > -55. && x < -45. && y > -10. && y < 50.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > -50. && x < 5. && y > -10. && y < -5.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > -5. && x < 5. && y > -10. && y < 30.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > 0. && x < 105. && y > 25. && y < 30.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > 95. && x < 105. && y > 25.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > 100. && x < 200. && y > 56.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > 195. && x < 205. && y > 15.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > 200. && x < 605. && y > 15. && y < 20.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > 595. && x < 605. && y > 20.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > 600. && x < 700. && y > 56.) gl_FragColor = vec4(curveColor, disc * vAlpha);
    if (x > 695. && x < 705. && y > 5.) gl_FragColor = vec4(curveColor, disc * vAlpha);
  }
  
  if (x > -695. && x < -690. && y < 20. && y > 15.) gl_FragColor = vec4(pointColor1, disc * vAlpha);
  if (x > -605. && x < -600. && y > 56.) gl_FragColor = vec4(pointColor2, disc * vAlpha);
  if (x > -500. && x < -495. && y > 0. && y < 5.) gl_FragColor = vec4(pointColor2, disc * vAlpha);
  if (x > -410. && x < -405. && y > 35. && y < 40.) gl_FragColor = vec4(pointColor2, disc * vAlpha);
  if (x > -300. && x < -295. && y > 20. && y < 25.) gl_FragColor = vec4(pointColor3, disc * vAlpha);
  if (x > -200. && x < -195. && y > -10. && y < -5.) gl_FragColor = vec4(pointColor3, disc * vAlpha);
  if (x > -100. && x < -95. && y > -10. && y < -5.) gl_FragColor = vec4(pointColor3, disc * vAlpha);
  if (x > -60. && x < -55. && y > 45. && y < 50.) gl_FragColor = vec4(pointColor3, disc * vAlpha);
  if (x > -5. && x < 5. && y > 0. && y < 5.) gl_FragColor = vec4(pointColor3, disc * vAlpha);
  if (x > 50. && x < 55. && y > 25. && y < 30.) gl_FragColor = vec4(pointColor4, disc * vAlpha);
  if (x > 100. && x < 105. && y > 56.) gl_FragColor = vec4(pointColor4, disc * vAlpha);
  if (x > 200. && x < 205. && y > 15. && y < 20.) gl_FragColor = vec4(pointColor4, disc * vAlpha);
  if (x > 300. && x < 305. && y > 15. && y < 20.) gl_FragColor = vec4(pointColor4, disc * vAlpha);
  if (x > 400. && x < 405. && y > 15. && y < 20.) gl_FragColor = vec4(pointColor4, disc * vAlpha);
  if (x > 500. && x < 505. && y > 15. && y < 20.) gl_FragColor = vec4(pointColor5, disc * vAlpha);
  if (x > 600. && x < 605. && y > 56.) gl_FragColor = vec4(pointColor5, disc * vAlpha);
  if (x > 695. && x < 705. && y > 5. && y < 10.) vec4(pointColor5, disc * vAlpha);
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

export let buble_fragment = `
uniform float time;

uniform float fogDensity;
uniform vec3 fogColor;

uniform sampler2D texture1;
uniform sampler2D texture2;

varying vec2 vUv;

void main( void ) {

  vec2 position = - 1.0 + 2.0 * vUv;

  vec4 noise = texture2D( texture1, vUv );
  vec2 T1 = vUv + vec2( 1.5, - 1.5 ) * time * 0.02;
  vec2 T2 = vUv + vec2( - 0.5, 2.0 ) * time * 0.01;

  T1.x += noise.x * 2.0;
  T1.y += noise.y * 2.0;
  T2.x -= noise.y * 0.2;
  T2.y += noise.z * 0.2;

  float p = texture2D( texture1, T1 * 2.0 ).a;

  vec4 color = texture2D( texture2, T2 * 2.0 );
  vec4 temp = color * ( vec4( p, p, p, p ) * 2.0 ) + ( color * color - 0.1 );

  if( temp.r > 1.0 ) { temp.bg += clamp( temp.r - 2.0, 0.0, 100.0 ); }
  if( temp.g > 1.0 ) { temp.rb += temp.g - 1.0; }
  if( temp.b > 1.0 ) { temp.rg += temp.b - 1.0; }

  gl_FragColor = temp;

  float depth = gl_FragCoord.z / gl_FragCoord.w;
  const float LOG2 = 1.442695;
  float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );
  fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );

  gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );

}
`;

export let glow_fragment = `
uniform vec3 glowColor;
uniform float b;
uniform float p;
uniform float s;
varying vec3 vNormal;
varying vec3 vPositionNormal;
void main() 
{
  float a = pow( b + s * abs(dot(vNormal, vPositionNormal)), p );
  gl_FragColor = vec4( glowColor, a );
}
`;

export let target_fragment = `
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
`;

export let wave_fragment = `
varying vec2 vUv;
varying float noise;
uniform sampler2D tExplosion;
vec3 mod289(vec3 x) {
  return x - floor(x * (1.089.0)) * 289.0;
}
vec4 mod289(vec4 x) {
  return x - floor(x * (1.089.0)) * 289.0;
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
`;

export let slider_fragment = `
uniform float progress;
uniform sampler2D tex;
uniform sampler2D tex1;
uniform sampler2D tex2;
uniform sampler2D tex3;
uniform sampler2D tex4;
uniform sampler2D tex5;
uniform sampler2D tex6;
uniform sampler2D tex7;
uniform sampler2D tex8;
uniform sampler2D tex9;
uniform sampler2D tex10;
uniform sampler2D tex11;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;

void main() {
  vec4 tt = texture2D(tex, vUv);
  vec4 tt1 = texture2D(tex1, vUv);
  vec4 tt2 = texture2D(tex2, vUv);
  vec4 tt3 = texture2D(tex3, vUv);
  vec4 tt4 = texture2D(tex4, vUv);
  vec4 tt5 = texture2D(tex5, vUv);
  vec4 tt6 = texture2D(tex6, vUv);
  vec4 tt7 = texture2D(tex7, vUv);
  vec4 tt8 = texture2D(tex8, vUv);
  vec4 tt9 = texture2D(tex9, vUv);
  vec4 tt10 = texture2D(tex10, vUv);
  vec4 tt11 = texture2D(tex11, vUv);

  vec4 finalTexture = tt;
  if(progress == 0.) finalTexture = tt;
  if(progress == 1.) finalTexture = tt1;
  if(progress == 2.) finalTexture = tt2;
  if(progress == 3.) finalTexture = tt3;
  if(progress == 4.) finalTexture = tt4;
  if(progress == 5.) finalTexture = tt5;
  if(progress == 6.) finalTexture = tt6;
  if(progress == 7.) finalTexture = tt7;
  if(progress == 8.) finalTexture = tt8;
  if(progress == 9.) finalTexture = tt9;
  if(progress == 10.) finalTexture = tt10;
  if(progress == 11.) finalTexture = tt11;
  gl_FragColor = vec4(vUv,0.,1.);
  gl_FragColor = finalTexture;
  if(gl_FragColor.r<0.1 && gl_FragColor.b<0.1 && gl_FragColor.g<0.1) discard;
}
`;

export let arrow_fragment = `
uniform sampler2D tex;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;

void main() {
  vec4 tt = texture2D(tex, vUv);

  gl_FragColor = vec4(vUv,0.,1.);
  gl_FragColor = tt;
  if(gl_FragColor.r<0.1 && gl_FragColor.b<0.1 && gl_FragColor.g<0.1) discard;
}
`;

export let storm_fragment = `
uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform sampler2D u_noise;
  uniform sampler2D u_bg;
  uniform float u_scroll;
  
  const vec3 cloudcolour = vec3(.07,0.0,.24);
  const vec3 lightcolour = vec3(.25,0.6,1.);
  
  float mod289(float x){return x - floor(x * (1.089.0)) * 289.0;}
  vec4 mod289(vec4 x){return x - floor(x * (1.089.0)) * 289.0;}
  vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

  float noise(vec3 p){
      vec3 a = floor(p);
      vec3 d = p - a;
      d = d * d * (3.0 - 2.0 * d);

      vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
      vec4 k1 = perm(b.xyxy);
      vec4 k2 = perm(k1.xyxy + b.zzww);

      vec4 c = k2 + a.zzzz;
      vec4 k3 = perm(c);
      vec4 k4 = perm(c + 1.0);

      vec4 o1 = fract(k3 * (1.0 / 41.0));
      vec4 o2 = fract(k4 * (1.0 / 41.0));

      vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
      vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

      return o4.y * d.y + o4.x * (1.0 - d.y);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    
    float noise1 = noise(vec3(uv * 3. * noise(vec3(uv * 3. + 100., u_time * 3. + 10.)), u_time * 2.))  * 2.;
    
    float noise2 = noise(vec3(uv + 2.35, u_time * 1.357 - 10.));
    
    uv.y -= u_scroll * .0001;
    
    uv += texture2D(u_bg, uv * vec2(.5, 1.) - vec2(u_time * .05, 1.) - .5 * .05).rg * 0.08 + noise1 * .008 * (1. - clamp(noise1 * noise1 * 2. + .2, 0., 1.));
    
    vec3 tex = texture2D(u_bg, uv * vec2(.5, 1.) - vec2(u_time * .02, 1.) - .5).rgb;
    
    uv.y -= u_scroll * .0001;
    vec3 tex1 = texture2D(u_bg, uv * vec2(.5, 1.) - vec2(u_time * .08, 1.)).rgb;
    
    uv.y -= u_scroll * .0001;
    vec3 tex2 = texture2D(u_bg, (uv * .8 + .5) * vec2(.5, 1.) - vec2(u_time * .1, 1.)).rgb;
    
    vec3 fragcolour = tex;
    
    float shade = tex.r;
    shade *= clamp(noise1 * noise2 * sin(u_time * 3.), .2, 10.);
    shade += shade * shade * 3.;
    shade -= (1. - clamp(tex1 * 4., 0., 1.).r) * .2;
    shade -= (1. - clamp(tex2 * 4., 0., 1.).r) * .1;
    
    fragcolour = mix(cloudcolour, lightcolour, shade);

    gl_FragColor = vec4(fragcolour, 1.);
  }
`;

export let fractal_fragment = `
precision highp float;
uniform vec2 res;
uniform float aspect;
uniform float zoom;
uniform vec2 offset;
uniform vec3 color;
uniform float opacity;
varying vec3 vColor;
// gui parameters
uniform vec3 pset1;
uniform vec3 pset2;
vec2 cm (vec2 a, vec2 b){
  return vec2(a.x*b.x - a.y*b.y, a.x*b.y + b.x*a.y);
}
vec2 conj (vec2 a){
  return vec2(a.x, -a.y);
}
float mandelbrot(vec2 c){
  float alpha = 1.0;
  vec2 z = vec2(0.0 , 0.0);
  vec2 z_0;
  vec2 z_1;
  vec2 z_2;
  for(int i=0; i < 200; i++){  // i < max iterations
    z_2 = z_1;
    z_1 = z_0;
    z_0 = z;
    float x_0_sq = z_0.x*z_0.x;
    float y_0_sq = z_0.y*z_0.y;
    vec2 z_0_sq = vec2(x_0_sq - y_0_sq, 2.0*z_0.x*z_0.y);
    float x_1_sq = z_1.x*z_1.x;
    float y_1_sq = z_1.y*z_1.y;
    vec2 z_1_sq = vec2(x_1_sq - y_1_sq, 2.0*z_1.x*z_1.y);
    // the recurrence equation
    z = pset1.x*z_0_sq + c + pset1.y*z_1_sq
    + pset1.z*cm(z_1_sq, z_2) + pset2.x*cm(z_1_sq, z_0)
    + pset2.y*cm(z_2, z_0) + pset2.z*cm(z_1, z_2);
    float z_0_mag = x_0_sq + y_0_sq;
    float z_1_mag = x_1_sq + y_1_sq;
    if(z_0_mag > 12.0){
      float frac = (12.0 - z_1_mag) / (z_0_mag - z_1_mag);
      alpha = (float(i) - 1.0 + frac)/200.0; // should be same as max iterations
      break;
    }
  }
  return alpha;
}
void main(){ // gl_FragCoord in [0,1]
  vec2 uv = zoom * vec2(aspect, 1.0) * gl_FragCoord.xy / res + offset;
  float s = 1.0 - mandelbrot(uv);
  vec3 coord = vec3(s, s, s);
  gl_FragColor = vec4(pow(coord, color * vColor), opacity);
}
`;

export let logo_fragment = `
uniform vec3 color;
uniform sampler2D tex;
uniform float alphaTest;

varying vec3 vColor;

void main() {
  gl_FragColor = vec4( color * vColor, 1.0 );
  gl_FragColor = gl_FragColor * texture2D( tex, gl_PointCoord );
  if ( gl_FragColor.a < alphaTest ) discard;
}
`;

export let globe_fragment = `
uniform sampler2D tex;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;

void main() {
  vec4 tt = texture2D(tex, vUv);

  vec4 finalTexture = tt;
  gl_FragColor = vec4(vUv,0.,1.);
  gl_FragColor = finalTexture;
  if(gl_FragColor.r<0.7 && gl_FragColor.b<0.7 && gl_FragColor.g<0.7) discard;
}
`;