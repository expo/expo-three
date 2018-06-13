import ExpoTHREE, { THREE } from 'expo-three';
import Assets from '../../Assets';
import ThreeStage from '../ThreeStage';

class AmfLoaderExample extends ThreeStage {
  async setupModels() {
    await super.setupModels();
    /// This works for both `ASCII` & `Binary` `.stl` files
    /// STL files will return a geometry, we must add it to a mesh with a material.
    const model = Assets.models.amf['rook.amf'];

    const mesh = await ExpoTHREE.loadAsync(model);

    ExpoTHREE.utils.scaleLongestSideToSize(mesh, 3);
    ExpoTHREE.utils.alignMesh(mesh, { y: 1 });
    mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
    this.mesh = mesh;
    this.scene.add(mesh);
  }

  onRender(delta) {
    super.onRender(delta);
    this.mesh.rotation.z += 0.4 * delta;
  }
}

AmfLoaderExample.description = `Additive Manufacturing File Format (AMF) is an open standard for describing objects for additive manufacturing processes such as 3D printing. ... Unlike its predecessor STL format, AMF has native support for color, materials, lattices, and constellations.`;

export default AmfLoaderExample;
