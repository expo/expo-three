import ExpoTHREE, { THREE } from 'expo-three';
import Assets from '../../Assets';
import ThreeStage from './ThreeStage';

class StlBinaryLoaderExample extends ThreeStage {
  async setupModels() {
    await super.setupModels();
    /// This works for both `ASCII` & `Binary` `.stl` files
    /// STL files will return a geometry, we must add it to a mesh with a material.
    const model = Assets.models.stl.binary['pr2_head_pan.stl'];

    const geometry = await ExpoTHREE.loadAsync(model);

    const material = new THREE.MeshPhongMaterial({
      color: 0xff5533,
      specular: 0x111111,
      shininess: 200,
    });

    const mesh = new THREE.Mesh(geometry, material);
    ExpoTHREE.utils.scaleLongestSideToSize(mesh, 3);
    ExpoTHREE.utils.alignMesh(mesh, { y: 1 });

    this.scene.add(mesh);
  }
}

export default StlBinaryLoaderExample;
