import ExpoTHREE, { THREE } from 'expo-three';
import Assets from '../../Assets';
import ThreeStage from './ThreeStage';

class TdsLoaderExample extends ThreeStage {
  async setupModels() {
    await super.setupModels();

    const model = Assets.models['3ds'].portalgun;

    const mesh = await ExpoTHREE.loadAsync(
      model['portalgun.3ds'],
      null,
      name => model.textures[name]
    );
    const normal = await ExpoTHREE.loadAsync(model.textures['normal.jpg']);

    mesh.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material.normalMap = normal;
      }
    });
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

export default TdsLoaderExample;
