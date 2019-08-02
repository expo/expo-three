import { PlaneAnchor } from 'expo/build/AR';
import THREE from '../Three';
declare class Planes extends THREE.Object3D {
    common: {};
    _data: PlaneAnchor[];
    segments: number;
    defaultRotationX: number;
    planeMaterial: THREE.MeshBasicMaterial;
    data: PlaneAnchor[];
    update: () => void;
}
export default Planes;
