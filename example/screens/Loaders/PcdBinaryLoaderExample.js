import ExpoTHREE, { THREE } from 'expo-three';
import Assets from '../../Assets';
import ThreeStage from '../ThreeStage';

class PcdBinaryLoaderExample extends ThreeStage {
  async setupModels() {
    await super.setupModels();

    /// This works for only `Binary` `.pcd` files - `ASCII` files don't work currently
    const model = Assets.models.pcd.binary['Zaghetto.pcd'];
    const mesh = await ExpoTHREE.loadAsync(model);

    mesh.material.color.setHex(Math.random() * 0xffffff); // Set point color
    mesh.material.size *= 2; // Make points bigger

    mesh.rotation.x = Math.PI;
    mesh.rotation.y = Math.PI;
    ExpoTHREE.utils.scaleLongestSideToSize(mesh, 3);
    // ExpoTHREE.utils.alignMesh(mesh, { y: 1, x: 0, z: 0 });
    this.scene.add(mesh);
    this.mesh = mesh; // Save reference for rotation
  }

  onRender(delta) {
    super.onRender(delta);
    this.mesh.rotation.y += 0.4 * delta;
  }
}

export default PcdBinaryLoaderExample;
