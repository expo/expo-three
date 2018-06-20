import ExpoTHREE, { THREE } from 'expo-three';
import Assets from '../../Assets';

class RandomJunkNode extends THREE.Object3D {
  constructor() {
    super();
  }

  loadAsync = async () => {
    const material = new THREE.MeshBasicMaterial({
      map: await ExpoTHREE.loadTextureAsync({ asset: Assets.icons['ios.png'] }),
    });

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    for (var i = 0; i < 100; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position
        .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        .normalize();
      mesh.position.multiplyScalar(Math.random() * 400);
      mesh.rotation.set(
        Math.random() * 2,
        Math.random() * 2,
        Math.random() * 2
      );
      mesh.scale.multiplyScalar(Math.random() * 50);
      this.add(mesh);
    }
  };
}

export default RandomJunkNode;
