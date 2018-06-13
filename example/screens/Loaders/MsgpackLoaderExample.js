import ExpoTHREE from 'expo-three';

import Assets from '../../Assets';
import ThreeStage from './ThreeStage';

class MsgpackLoaderExample extends ThreeStage {
  async setupModels() {
    await super.setupModels();
    const model = Assets.models.pack['robo_pigeon.pack'];
    const mesh = await ExpoTHREE.loadAsync(model);
    this.scene.add(mesh);
    this.mesh = mesh;
  }
}

export default MsgpackLoaderExample;
