import ExpoTHREE, { THREE } from 'expo-three';

import Assets from '../../Assets';
import ThreeStage from './ThreeStage';

class DracoLoaderExample extends ThreeStage {
  static url = 'screens/Loaders/DracoLoaderExample.js';

  async setupModels() {
    await super.setupModels();

    const model = Assets.models.draco['bunny.drc'];
    const geometry = await ExpoTHREE.loadAsync(model);

    geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      vertexColors: THREE.VertexColors,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

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

export default DracoLoaderExample;
