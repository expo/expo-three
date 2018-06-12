import ExpoTHREE, { THREE } from 'expo-three';

import Assets from '../../Assets';
import ThreeStage from './ThreeStage';

class MtlLoaderExample extends ThreeStage {
  async setupModels() {
    await super.setupModels();

    const model = Assets.models.batman;

    const mesh = await ExpoTHREE.loadAsync(
      [
        model['B-AO_iOS_HERO_Bruce_Wayne_Batman_Arkham_Origins.obj'],
        model['B-AO_iOS_HERO_Bruce_Wayne_Batman_Arkham_Origins.mtl'],
      ],
      null,
      name => model[name]
    );

    mesh.traverse(async child => {
      if (child instanceof THREE.Mesh) {
        /// Smooth geometry
        const tempGeo = new THREE.Geometry().fromBufferGeometry(child.geometry);
        tempGeo.mergeVertices();
        // after only mergeVertices my textrues were turning black so this fixed normals issues
        tempGeo.computeVertexNormals();
        tempGeo.computeFaceNormals();

        child.geometry = new THREE.BufferGeometry().fromGeometry(tempGeo);

        child.material.shading = THREE.SmoothShading;
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

export default MtlLoaderExample;
