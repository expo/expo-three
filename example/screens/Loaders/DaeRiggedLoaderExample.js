import ExpoTHREE, { THREE } from 'expo-three';
import Assets from '../../Assets';
import ThreeStage from './ThreeStage';

class DaeRiggedLoaderExample extends ThreeStage {
  async setupModels() {
    await super.setupModels();

    const model = Assets.models.collada.stormtrooper;

    const { scene: mesh } = await ExpoTHREE.loadAsync(
      model['stormtrooper.dae'],
      null,
      name => model[name]
    );

    ExpoTHREE.utils.scaleLongestSideToSize(mesh, 3);
    ExpoTHREE.utils.alignMesh(mesh, { y: 1 });
    this.scene.add(mesh);
    this.mesh = mesh;

    this.mixer = new THREE.AnimationMixer(mesh);
    this.mixer.clipAction(animations[0]).play();
  }

  onRender(delta) {
    super.onRender(delta);
    this.mixer.update(delta);
  }
}

export default DaeRiggedLoaderExample;
