import { AR } from 'expo';
import THREE from '../Three';
// @ts-ignore
const ARFrameAttribute = AR.FrameAttribute || AR.FrameAttributes;
export default class Points extends THREE.Object3D {
    constructor() {
        super(...arguments);
        this.common = {};
        this._data = [];
        this.material = new THREE.PointsMaterial({ size: 5, sizeAttenuation: false });
        this.update = () => {
            const { rawFeaturePoints } = AR.getCurrentFrame({
                [ARFrameAttribute.RawFeaturePoints]: true,
            });
            if (rawFeaturePoints) {
                this.data = rawFeaturePoints;
            }
            else {
                this.data = [];
            }
        };
    }
    get data() {
        return this._data;
    }
    set data(points) {
        this._data = points;
        let nextPoints = {};
        for (let point of points) {
            const { x, y, z, id } = point;
            let object = this.common[id];
            nextPoints[id] = object;
            delete this.common[id];
            if (!object) {
                const geometry = new THREE.Geometry();
                geometry.vertices.push(new THREE.Vector3(0, 0, 0));
                object = new THREE.Points(geometry, this.material);
                nextPoints[id] = object;
                this.add(object);
            }
            object.position.set(x, y, z);
        }
        for (const point of Object.values(this.common)) {
            this.remove(point);
        }
        this.common = nextPoints;
    }
}
//# sourceMappingURL=Points.js.map