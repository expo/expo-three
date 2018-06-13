import ExpoTHREE, { THREE } from 'expo-three';
import Assets from '../../Assets';
import ThreeStage from '../ThreeStage';

class VtpNonCompressedLoaderExample extends ThreeStage {
  async setupModels() {
    await super.setupModels();

    const model = Assets.models.vtk['cube_no_compression.vtp'];

    const geometry = await ExpoTHREE.loadAsync(model);

    geometry.center();
    geometry.computeVertexNormals();
    const material = new THREE.MeshLambertMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
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

export default VtpNonCompressedLoaderExample;
