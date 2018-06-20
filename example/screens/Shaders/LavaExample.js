import ExpoTHREE, { THREE } from 'expo-three';

import Assets from '../../Assets';
import ThreeStage from '../ThreeStage';

const fragmentShader = `
uniform float time;
uniform vec2 resolution;
uniform float fogDensity;
uniform vec3 fogColor;
uniform sampler2D texture1;
uniform sampler2D texture2;
varying vec2 vUv;
void main( void ) {
  vec2 position = -1.0 + 2.0 * vUv;
  vec4 noise = texture2D( texture1, vUv );
  vec2 T1 = vUv + vec2( 1.5, -1.5 ) * time  *0.02;
  vec2 T2 = vUv + vec2( -0.5, 2.0 ) * time * 0.01;
  T1.x += noise.x * 2.0;
  T1.y += noise.y * 2.0;
  T2.x -= noise.y * 0.2;
  T2.y += noise.z * 0.2;
  float p = texture2D( texture1, T1 * 2.0 ).a;
  vec4 color = texture2D( texture2, T2 * 2.0 );
  vec4 temp = color * ( vec4( p, p, p, p ) * 2.0 ) + ( color * color - 0.1 );
  if( temp.r > 1.0 ){ temp.bg += clamp( temp.r - 2.0, 0.0, 100.0 ); }
  if( temp.g > 1.0 ){ temp.rb += temp.g - 1.0; }
  if( temp.b > 1.0 ){ temp.rg += temp.b - 1.0; }
  gl_FragColor = temp;
  float depth = gl_FragCoord.z / gl_FragCoord.w;
  const float LOG2 = 1.442695;
  float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );
  fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );
  gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );
}
`;
const vertexShader = `
uniform vec2 uvScale;
varying vec2 vUv;
void main()
{
  vUv = uvScale * uv;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
}
`;

class LavaExample extends ThreeStage {
  static url = 'screens/Shaders/LavaExample.js';
  async setupModels() {
    await super.setupModels();

    const cloud = await ExpoTHREE.loadTextureAsync({
      asset: Assets.images.lava['cloud.png'],
    });

    cloud.wrapS = THREE.RepeatWrapping;
    cloud.wrapT = THREE.RepeatWrapping;

    const lavatile = await ExpoTHREE.createTextureAsync({
      asset: Assets.images.lava['lavatile.jpg'],
    });

    lavatile.wrapS = THREE.RepeatWrapping;
    lavatile.wrapT = THREE.RepeatWrapping;

    this.uniforms = {
      fogDensity: { value: 0.45 },
      fogColor: { value: new THREE.Vector3(0, 0, 0) },
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
      uvScale: { value: new THREE.Vector2(3.0, 1.0) },
      texture1: { value: cloud },
      texture2: { value: lavatile },
    };

    const size = 0.65;
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(size, 0.3, 30, 30),
      material
    );
    mesh.rotation.x = 0.3;
    this.scene.add(mesh);
    this.mesh = mesh;

    this.scene.add(new THREE.AmbientLight(0xcccccc));
    this.light = new THREE.DirectionalLight(0xffffff, 2);
    this.light.position.set(1, 1, 0.5);
    this.scene.add(this.light);

    // this.renderer.autoClear = false;

    require('three/examples/js/postprocessing/EffectComposer');
    require('three/examples/js/postprocessing/RenderPass');
    require('three/examples/js/postprocessing/ShaderPass');
    require('three/examples/js/postprocessing/MaskPass');
    require('three/examples/js/shaders/ConvolutionShader');
    require('three/examples/js/shaders/FilmShader');
    require('three/examples/js/postprocessing/BloomPass');
    require('three/examples/js/postprocessing/FilmPass');
    require('three/examples/js/shaders/CopyShader');

    const renderModel = new THREE.RenderPass(this.scene, this.camera);
    const effectBloom = new THREE.BloomPass(1.25);
    const effectFilm = new THREE.FilmPass(0.35, 0.95, 2048, false);
    effectFilm.renderToScreen = true;
    this.effect = new THREE.EffectComposer(this.renderer);
    this.effect.addPass(renderModel);
    this.effect.addPass(effectBloom);
    this.effect.addPass(effectFilm);

    // const { width, height } = this.renderer.getSize();
    // this.effect.setSize(width, height);
  }

  setupScene() {
    super.setupScene();
    this.scene.fog = new THREE.Fog(0xcccccc, 1, 1000);
  }

  setupCamera({ width, height }) {
    this.camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 200);
    // this.camera.position.z = 400;
    this.camera.position.set(0, 0, 2);

    this.camera.lookAt(new THREE.Vector3());
  }

  onRender(delta) {
    this.uniforms.time.value += 0.2 * delta;
    this.mesh.rotation.y += 0.0125 * delta;
    this.mesh.rotation.x += 0.05 * delta;
    // this.renderer.clear();
    this.effect.render(this.scene, this.camera, delta);
  }
}

export default LavaExample;
