import ExpoTHREE, { THREE } from 'expo-three';
import Assets from '../../Assets';
import ThreeStage from '../ThreeStage';

class FbxLoaderExample extends ThreeStage {
  static url = 'screens/Loaders/FbxLoaderExample.js';

  async setupModels() {
    await super.setupModels();

    const model = Assets.models.fbx.samba;

    const object = await ExpoTHREE.loadAsync(
      model['dancing.fbx'],
      null,
      model
    );

    if (!object) {
      throw new Error('Failed to load model!');
    }

    this.mixer = new THREE.AnimationMixer(object);
    this.action = this.mixer.clipAction(object.animations[0]);
    this.action.play();

    ExpoTHREE.utils.scaleLongestSideToSize(object, 3);
    this.scene.add(object);
  }

  onRender(delta) {
    super.onRender(delta);
    this.mixer.update(delta);
    // this.animation && this.animation.setTime(Date.now() / 1000);
  }
}

export default FbxLoaderExample;
