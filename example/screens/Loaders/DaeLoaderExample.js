import ExpoTHREE, { THREE } from 'expo-three';
import Assets from '../../Assets';
import ThreeStage from '../ThreeStage';

async function loading_method_1() {
  const model = Assets.models.collada.elf;
  const onProgressUpdate = () => {};
  const onAssetRequested = assetName => model[assetName];
  const collada = await ExpoTHREE.loadAsync(
    model['elf.dae'],
    onProgressUpdate,
    onAssetRequested
  );
  return collada;
}

async function loading_method_2() {
  const model = Assets.models.collada.elf;
  const onProgress = () => {};
  const onAssetRequested = assetName => model[assetName];
  const collada = await ExpoTHREE.loadDaeAsync({
    asset: model['elf.dae'],
    onProgress,
    onAssetRequested,
  });
  return collada;
}

async function loading_method_3() {
  const model = Assets.models.collada.elf;
  const collada = await ExpoTHREE.loadDaeAsync({
    asset: model['elf.dae'],
    onAssetRequested: model,
  });
  return collada;
}

class DaeLoaderExample extends ThreeStage {
  static url = 'screens/Loaders/DaeLoaderExample.js';

  async setupModels() {
    await super.setupModels();

    const { scene: mesh } = await loading_method_3();

    ExpoTHREE.utils.scaleLongestSideToSize(mesh, 3);
    ExpoTHREE.utils.alignMesh(mesh, { y: 1 });
    this.scene.add(mesh);
    this.mesh = mesh; // Save reference for rotation
  }

  onRender(delta) {
    super.onRender(delta);
    this.mesh.rotation.z += 0.4 * delta;
  }
}

export default DaeLoaderExample;
