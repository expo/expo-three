import { THREE } from 'expo-three';

import ThreeStage from '../ThreeStage';
import RandomJunkNode from './RandomJunkNode';

class VirtualBoyExample extends ThreeStage {
  async setupModels() {
    await super.setupModels();

    this.mesh = new RandomJunkNode();
    await this.mesh.loadAsync();
    this.scene.add(this.mesh);
    this.scene.add(new THREE.AmbientLight(0x222222));
    this.light = new THREE.DirectionalLight(0xffffff);
    this.light.position.set(1, 1, 1);
    this.scene.add(this.light);

    if (!THREE.VirtualBoyEffect) require('../../Effects/VirtualBoyEffect');

    this.effect = new THREE.VirtualBoyEffect(this.renderer);

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

export default VirtualBoyExample;
