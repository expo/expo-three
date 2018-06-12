import ExpoTHREE, { THREE } from 'expo-three';
import Assets from '../../Assets';
import ThreeStage from './ThreeStage';

class DaeLoaderExample extends ThreeStage {
  async setupModels() {
    await super.setupModels();

    const model = Assets.models.collada.elf;
    const { scene: mesh } = await ExpoTHREE.loadAsync(
      model['elf.dae'],
      null,
      name => model[name]
    );

    ExpoTHREE.utils.scaleLongestSideToSize(mesh, 3);
    ExpoTHREE.utils.alignMesh(mesh, { y: 1 });
    this.scene.add(mesh);
    this.mesh = mesh; // Save reference for rotation
  }

  onRender(delta) {
    super.onRender(delta);
    this.mesh.rotation.x += 0.4 * delta;
  }
}

export default DaeLoaderExample;
