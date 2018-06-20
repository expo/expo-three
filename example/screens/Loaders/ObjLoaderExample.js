import ExpoTHREE, { THREE } from 'expo-three';
import Assets from '../../Assets';
import ThreeStage from '../ThreeStage';

class ObjLoaderExample extends ThreeStage {
  static url = 'screens/Loaders/ObjLoaderExample.js';

  async setupModels() {
    await super.setupModels();

    //https://github.com/mrdoob/three.js/blob/4e8a8c113eedc5402445de0e90cc6226c458dd01/examples/webgl_materials_channels.html
    const model = Assets.models.obj.ninja;

    const SCALE = 2.436143; // from original model
    const BIAS = -0.428408; // from original model

    const normalMap = await ExpoTHREE.loadAsync(model['normal.jpg']);
    const aoMap = await ExpoTHREE.loadAsync(model['ao.jpg']);
    const displacementMap = await ExpoTHREE.loadAsync(
      model['displacement.jpg']
    );

    const object = await ExpoTHREE.loadObjAsync({
      asset: model['ninjaHead_Low.obj'],
    });

    const materialStandard = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0.6,
      displacementMap: displacementMap,
      displacementScale: SCALE,
      displacementBias: BIAS,
      aoMap: aoMap,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(1, -1),
      //flatShading: true,
      side: THREE.DoubleSide,
    });

    const geometry = object.children[0].geometry;
    geometry.attributes.uv2 = geometry.attributes.uv;
    geometry.center();
    const mesh = new THREE.Mesh(geometry, materialStandard);
    mesh.scale.multiplyScalar(0.25);

    ExpoTHREE.utils.scaleLongestSideToSize(mesh, 1);
    ExpoTHREE.utils.alignMesh(mesh, { y: 1 });
    this.scene.add(mesh);
    this.mesh = mesh;
  }

  onRender(delta) {
    super.onRender(delta);
    this.mesh.rotation.y += 0.5 * delta;
  }
}

export default ObjLoaderExample;
