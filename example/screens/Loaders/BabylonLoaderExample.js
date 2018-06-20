import ExpoTHREE, { THREE } from 'expo-three';
import Assets from '../../Assets';
import ThreeStage from './ThreeStage';

class BabylonLoaderExample extends ThreeStage {
  static url = 'screens/Loaders/BabylonLoaderExample.js';

  async setupModels() {
    await super.setupModels();
    // Babylon files usually contain full scenes as opposed to single meshes
    const scene = await ExpoTHREE.loadAsync(
      Assets.models.babylon['skull.babylon']
    );

    scene.traverse(function(object) {
      if (object instanceof THREE.Mesh) {
        object.material = new THREE.MeshPhongMaterial({
          color: Math.random() * 0xffffff,
        });
      }
    });

    this.scene = scene;
    this.camera.position.z = 100;
  }
}

export default BabylonLoaderExample;
