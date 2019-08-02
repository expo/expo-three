import { AR } from 'expo';
import { PlaneAnchor } from 'expo/build/AR';

import THREE from '../Three';

// @ts-ignore
const AnchorTypes = AR.AnchorType || AR.AnchorTypes;

// @ts-ignore
const ARFrameAttribute = AR.FrameAttribute || AR.FrameAttributes;

//TODO: Evan: Add vertical plane support
class Planes extends THREE.Object3D {
  common = {};
  _data: PlaneAnchor[] = [];
  segments = 5;
  defaultRotationX = -Math.PI * 0.5;

  planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    // side: THREE.DoubleSide,
    wireframe: true,
  });

  get data() {
    return this._data;
  }

  set data(planes: PlaneAnchor[]) {
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
          this.segments,
          this.segments,
        );
        const planeMesh = new THREE.Mesh(geometry, this.planeMaterial);
        planeMesh.rotation.x = this.defaultRotationX;

        object = new THREE.Object3D();
        object.planeMesh = planeMesh;
        object.add(planeMesh);

        nextPlanes[id] = object;
        this.add(object);
      } else {
        object.planeMesh.geometry.width = width;
        object.planeMesh.geometry.height = length;
      }
      object.planeMesh.position.x = center.x;
      object.planeMesh.position.z = center.z;

      object.matrix.fromArray(transform);
      object.matrix.decompose(object.position, object.quaternion, object.scale);
    }

    for (let key in this.common) {
      this.remove(this.common[key]);
    }
    this.common = nextPlanes;
  }

  update = (): void => {
    const { anchors } = AR.getCurrentFrame({
      [ARFrameAttribute.Anchors]: {},
    });
    if (anchors) {
      const planes = anchors.filter(({ type }) => type === AnchorTypes.Plane);
      this.data = planes as PlaneAnchor[];
    } else {
      this.data = [];
    }
  };
}

export default Planes;
