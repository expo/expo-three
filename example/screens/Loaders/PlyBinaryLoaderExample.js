import ExpoTHREE, { THREE } from 'expo-three';

import Assets from '../../Assets';
import ThreeStage from '../ThreeStage';

class PlyBinaryLoaderExample extends ThreeStage {
  async setupModels() {
    await super.setupModels();

    const model = Assets.models.ply.binary['Lucy100k.ply'];
    const geometry = await ExpoTHREE.loadAsync(model);

    geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      color: 0x0055ff,
      flatShading: true,
    });
    const mesh = new THREE.Mesh(geometry, material);

    ExpoTHREE.utils.scaleLongestSideToSize(mesh, 3);
    ExpoTHREE.utils.alignMesh(mesh, { y: 1 });
    this.scene.add(mesh);
    this.mesh = mesh; // Save reference for rotation
  }

  onRender(delta) {
    super.onRender(delta);
    this.mesh.rotation.y += 0.4 * delta;
  }
}

export default PlyBinaryLoaderExample;
