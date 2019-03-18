import ExpoTHREE, { THREE } from 'expo-three';
import Assets from '../../Assets';
import ThreeStage from '../ThreeStage';

class GltfLoaderExample extends ThreeStage {
  static url = 'screens/Loaders/GltfLoaderExample.js';

  async setupModels() {
    await super.setupModels();

    const model = Assets.models.gltf.robot;

    const gltf = await ExpoTHREE.loadAsync(model['robot.glb']);
    const object = gltf.scene;


    if (!object) {
      throw new Error('Failed to load model!');
    }

    this.mixer = new THREE.AnimationMixer(object);
    this.actions = {};

    gltf.animations.forEach(animation => {
      if(animation.name == 'Walking') {
        let action = this.mixer.clipAction(animation);
        action.play();
      }
    });

    ExpoTHREE.utils.scaleLongestSideToSize(object, 3);
    this.scene.add(object);
  }

  onRender(delta) {
    super.onRender(delta);
    this.mixer.update(delta);
  }
}

export default GltfLoaderExample;
