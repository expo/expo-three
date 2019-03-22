import { AR } from 'expo';

import THREE from '../Three';

const DEFAULT_MATERIAL = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  // side: THREE.DoubleSide,
  wireframe: true,
});

//TODO: Evan: Add vertical plane support
class Planes extends THREE.Object3D {

  constructor(props){
    super(props)

    this.material = props && props.material ? props.material : DEFAULT_MATERIAL;

    this.common = {};
    this._data = {};
    this.segments = 5;
    
    this.defaultRotationX = -Math.PI * 0.5;

  }

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
          this.segments,
          this.segments
        );
        const planeMesh = new THREE.Mesh(geometry, this.material);
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

  update = () => {
    const { anchors } = AR.getCurrentFrame({
      [ARFrameAttribute.Anchors]: {},
    });
    const planes = anchors.filter(({ type }) => type === AR.AnchorTypes.Plane);
    this.data = planes;
  };
}

export default Planes;
