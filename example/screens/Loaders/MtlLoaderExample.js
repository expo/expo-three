import ExpoTHREE, { THREE } from 'expo-three';

import Assets from '../../Assets';
import ThreeStage from '../ThreeStage';

/// Long form general purpose loading with ExpoTHREE.loadAsync
async function loading_method_1() {
  const model = Assets.models.batman;
  const onProgressUpdate = () => {};
  const onAssetRequested = assetName => model[assetName];
  const mesh = await ExpoTHREE.loadAsync(
    [
      model['B-AO_iOS_HERO_Bruce_Wayne_Batman_Arkham_Origins.obj'],
      model['B-AO_iOS_HERO_Bruce_Wayne_Batman_Arkham_Origins.mtl'],
    ],
    onProgressUpdate,
    onAssetRequested
  );
  return mesh;
}

/// Short hand general purpose loading with ExpoTHREE.loadAsync
async function loading_method_2() {
  const model = Assets.models.batman;
  const mesh = await ExpoTHREE.loadAsync(
    [
      model['B-AO_iOS_HERO_Bruce_Wayne_Batman_Arkham_Origins.obj'],
      model['B-AO_iOS_HERO_Bruce_Wayne_Batman_Arkham_Origins.mtl'],
    ],
    null, /// Don't need a progress update
    model
  ); /// Can just pass in dictionary of model assets
  return mesh;
}

// Long form reliable way to load without using other file types. A good way to debug problems...
async function loading_method_3() {
  const model = Assets.models.batman;

  /// Load MTL Materials
  const materials = await ExpoTHREE.loadMtlAsync({
    asset: model['B-AO_iOS_HERO_Bruce_Wayne_Batman_Arkham_Origins.mtl'],
    onAssetRequested: name => {
      console.log(name);
      return model[name];
    },
  });

  /// Load OBJ Mesh with materials
  const mesh = await ExpoTHREE.loadObjAsync({
    asset: model['B-AO_iOS_HERO_Bruce_Wayne_Batman_Arkham_Origins.obj'],
    materials,
  });
  return mesh;
}

/// Short hand without checking for other file types. Possibly the best method...
async function loading_method_4() {
  const model = Assets.models.batman;
  const mesh = await ExpoTHREE.loadObjAsync({
    asset: model['B-AO_iOS_HERO_Bruce_Wayne_Batman_Arkham_Origins.obj'],
    mtlAsset: model['B-AO_iOS_HERO_Bruce_Wayne_Batman_Arkham_Origins.mtl'],
    onAssetRequested: model,
  });
  return mesh;
}

class MtlLoaderExample extends ThreeStage {
  async setupModels() {
    await super.setupModels();
    const model = Assets.models.batman;

    const mesh = await loading_method_4();

    mesh.traverse(async child => {
      if (child instanceof THREE.Mesh) {
        /// Smooth geometry
        const tempGeo = new THREE.Geometry().fromBufferGeometry(child.geometry);
        tempGeo.mergeVertices();
        // after only mergeVertices my textrues were turning black so this fixed normals issues
        tempGeo.computeVertexNormals();
        tempGeo.computeFaceNormals();

        child.geometry = new THREE.BufferGeometry().fromGeometry(tempGeo);

        child.material.side = THREE.FrontSide;

        /// Apply other maps - maybe this is supposed to be automatic :[
        child.material.normalMap = await ExpoTHREE.loadAsync(
          model['B-AO_iOS_HERO_Bruce_Wayne_Batman_Arkham_Origins_Body_N.png']
        );
        child.material.specularMap = await ExpoTHREE.loadAsync(
          model['B-AO_iOS_HERO_Bruce_Wayne_Batman_Arkham_Origins_Body_S.png']
        );
        child.material.envMap = await ExpoTHREE.loadAsync(
          model['B-AO_iOS_HERO_Bruce_Wayne_Batman_Arkham_Origins_DM_ENV.png']
        );
      }
    });

    ExpoTHREE.utils.scaleLongestSideToSize(mesh, 5);
    ExpoTHREE.utils.alignMesh(mesh, { y: 1 });
    this.scene.add(mesh);
    this.mesh = mesh; // Save reference for rotation
  }

  onRender(delta) {
    super.onRender(delta);
    this.mesh.rotation.y += 0.7 * delta;
  }
}

export default MtlLoaderExample;
