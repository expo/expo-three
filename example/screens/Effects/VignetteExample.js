import { THREE } from 'expo-three';

import ThreeStage from '../ThreeStage';
import RandomJunkNode from './RandomJunkNode';

class VignetteExample extends ThreeStage {
  static url = 'screens/Effects/VignetteExample.js';

  async setupModels() {
    await super.setupModels();

    this.mesh = new RandomJunkNode();
    await this.mesh.loadAsync();
    this.scene.add(this.mesh);
    this.scene.add(new THREE.AmbientLight(0x222222));
    this.light = new THREE.DirectionalLight(0xffffff);
    this.light.position.set(1, 1, 1);
    this.scene.add(this.light);

    require('three/examples/js/postprocessing/EffectComposer');
    require('three/examples/js/postprocessing/RenderPass');
    require('three/examples/js/postprocessing/ShaderPass');
    require('three/examples/js/postprocessing/MaskPass');
    require('three/examples/js/postprocessing/GlitchPass');
    require('three/examples/js/postprocessing/BloomPass');
    require('three/examples/js/postprocessing/FilmPass');
    require('three/examples/js/shaders/CopyShader');
    require('three/examples/js/shaders/ColorCorrectionShader');
    require('three/examples/js/shaders/VignetteShader');
    require('three/examples/js/shaders/DigitalGlitch');

    this.effect = new THREE.EffectComposer(this.renderer);

    const renderPass = new THREE.RenderPass(this.scene, this.camera);
    const copyPass = new THREE.ShaderPass(THREE.CopyShader);
    this.effect.addPass(renderPass);

    const vh = 1.4;
    const vl = 1.2;
    const colorCorrectionPass = new THREE.ShaderPass(
      THREE.ColorCorrectionShader
    );
    colorCorrectionPass.uniforms['powRGB'].value = new THREE.Vector3(
      vh,
      vh,
      vh
    );
    colorCorrectionPass.uniforms['mulRGB'].value = new THREE.Vector3(
      vl,
      vl,
      vl
    );
    this.effect.addPass(colorCorrectionPass);
    const vignettePass = new THREE.ShaderPass(THREE.VignetteShader);
    vignettePass.uniforms['darkness'].value = 1.0;
    this.effect.addPass(vignettePass);
    this.effect.addPass(copyPass);
    copyPass.renderToScreen = true;

    const { width, height } = this.renderer.getSize();
    this.effect.setSize(width, height);
  }

  setupScene() {
    super.setupScene();
    this.scene.fog = new THREE.Fog(0xcccccc, 1, 1000);
  }

  setupCamera({ width, height }) {
    this.camera = new THREE.PerspectiveCamera(70, width / height, 1, 5000);
    this.camera.position.z = 400;
    this.camera.lookAt(new THREE.Vector3());
  }

  onRender(delta) {
    this.mesh.rotation.z += 0.4 * delta;
    this.effect.render(this.scene, this.camera, delta);
  }
}

export default VignetteExample;
