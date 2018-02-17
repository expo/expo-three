import ExpoTHREE, { THREE } from 'expo-three'; // 2.2.2-alpha.1

const material = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  side: THREE.DoubleSide,
  wireframe: true,
});
const segments = 10;

class Planes extends THREE.Object3D {
  common = {};
  _data = {};
  get data() {
    return this._data;
  }

  set data(planes) {
    this._data = planes;
    let nextPlanes = {};
    for (let plane of planes) {
      const {
        center,
        extent: { width, length },
        transform,
        id,
      } = plane;
      let object = this.common[id];
      nextPlanes[id] = object;
      this.common[id] = null;
      if (!object) {
        const geometry = new THREE.PlaneBufferGeometry(
          width,
          length,
          segments,
          segments
        );
        object = new THREE.Mesh(geometry, material);
        object.matrixAutoUpdate = false;

        const matrix = new THREE.Matrix4();
        matrix.fromArray(transform);

        object.applyMatrix(matrix);
        object.updateMatrix();

        object.rotation.x = -Math.PI / 2;
        nextPlanes[id] = object;
        this.add(object);
      } else {
        object.geometry.width = width;
        object.geometry.height = length;
      }

      object.position.x = center.x;
      object.position.z = center.z;
      object.updateMatrix();
    }

    for (let key in this.common) {
      this.remove(this.common[key]);
    }
    this.common = nextPlanes;
  }

  updateWithSession = arSession => {
    const { planes } = ExpoTHREE.getPlanes(arSession);
    this.data = planes;
  };
}

export default Planes;
