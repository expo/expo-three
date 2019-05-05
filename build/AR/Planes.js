import { AR } from 'expo';
import THREE from '../Three';
// @ts-ignore
const AnchorTypes = AR.AnchorType || AR.AnchorTypes;
// @ts-ignore
const ARFrameAttribute = AR.FrameAttribute || AR.FrameAttributes;
//TODO: Evan: Add vertical plane support
class Planes extends THREE.Object3D {
    constructor() {
        super(...arguments);
        this.common = {};
        this._data = [];
        this.segments = 5;
        this.defaultRotationX = -Math.PI * 0.5;
        this.planeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            // side: THREE.DoubleSide,
            wireframe: true,
        });
        this.update = () => {
            const { anchors } = AR.getCurrentFrame({
                [ARFrameAttribute.Anchors]: {},
            });
            if (anchors) {
                const planes = anchors.filter(({ type }) => type === AnchorTypes.Plane);
                this.data = planes;
            }
            else {
                this.data = [];
            }
        };
    }
    get data() {
        return this._data;
    }
    set data(planes) {
        this._data = planes;
        let nextPlanes = {};
        for (let plane of planes) {
            const { center, extent: { width, length }, transform, id, } = plane;
            let object = this.common[id];
            nextPlanes[id] = object;
            this.common[id] = null;
            if (!object) {
                const geometry = new THREE.PlaneBufferGeometry(width, length, this.segments, this.segments);
                const planeMesh = new THREE.Mesh(geometry, this.planeMaterial);
                planeMesh.rotation.x = this.defaultRotationX;
                object = new THREE.Object3D();
                object.planeMesh = planeMesh;
                object.add(planeMesh);
                nextPlanes[id] = object;
                this.add(object);
            }
            else {
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
}
export default Planes;
//# sourceMappingURL=Planes.js.map