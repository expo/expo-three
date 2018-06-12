import ExpoTHREE, { THREE } from 'expo-three';
import Assets from '../../Assets';
import ThreeStage from './ThreeStage';

class AssimpLoaderExample extends ThreeStage {
  async setupModels() {
    await super.setupModels();

    const model = Assets.models.assimp.octaminator;

    const object = await ExpoTHREE.loadAsync(
      model['Octaminator.assimp'],
      null,
      name => model[name]
    );

    if (!object) {
      console.error('Failed to load model!');
    }

    const { object: mesh, animation } = object;
    ExpoTHREE.utils.scaleLongestSideToSize(mesh, 3);
    this.scene.add(mesh);
    this.animation = animation;
  }

  onRender(delta) {
    super.onRender(delta);
    this.animation && this.animation.setTime(Date.now() / 1000);
  }
}

export default AssimpLoaderExample;
