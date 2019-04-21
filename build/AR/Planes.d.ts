import { PlaneAnchor } from 'expo/src/AR';
import THREE from '../Three';
declare class Planes extends THREE.Object3D {
    common: {};
    _data: PlaneAnchor[];
    segments: number;
    defaultRotationX: number;
    planeMaterial: any;
    data: PlaneAnchor[];
    update: () => void;
}
export default Planes;
