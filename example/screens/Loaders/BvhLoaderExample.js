import ExpoTHREE, { THREE } from 'expo-three';
import Assets from '../../Assets';
import ThreeStage from '../ThreeStage';

class BvhLoaderExample extends ThreeStage {
  static url = 'screens/Loaders/BvhLoaderExample.js';

  async setupModels() {
    await super.setupModels();

    const res = Assets.models.bvh['pirouette.bvh'];
    const { skeleton, clip } = await ExpoTHREE.loadAsync(res);

    const skeletonHelper = new THREE.SkeletonHelper(skeleton.bones[0]);
    skeletonHelper.skeleton = skeleton; // allow animation mixer to bind to SkeletonHelper directly

    const boneContainer = new THREE.Group();
    boneContainer.add(skeleton.bones[0]);

    this.scene.add(skeletonHelper);
    this.scene.add(boneContainer);

    this.mixer = new THREE.AnimationMixer(skeletonHelper);
    this.mixer
      .clipAction(clip)
      .setEffectiveWeight(1.0)
      .play();
  }

  onRender(delta) {
    super.onRender(delta);
    this.mixer.update(delta);
  }
}

export default BvhLoaderExample;
