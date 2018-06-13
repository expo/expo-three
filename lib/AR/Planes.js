import { AR } from 'expo';

import THREE from '../Three';

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
        const geometry = new THREE.PlaneBufferGeometry(width, length, segments, segments);
        object = new THREE.Mesh(geometry, material);
        nextPlanes[id] = object;
        this.add(object);
      } else {
        object.geometry.width = width;
        object.geometry.height = length;
      }

      object.matrix.fromArray(transform);
      object.matrix.decompose(object.position, object.quaternion, object.scale);
      object.rotation.x = -Math.PI / 2;
      object.position.x = center.x;
      object.position.z = center.z;
      object.updateMatrix();
    }

    for (let key in this.common) {
      this.remove(this.common[key]);
    }
    this.common = nextPlanes;
  }

  update = () => {
    const { anchors } = AR.getCurrentFrame({ anchors: {} });
    const planes = anchors.filter(({ type }) => type === 'ARPlaneAnchor');
    this.data = planes;
  };
}

export default Planes;
