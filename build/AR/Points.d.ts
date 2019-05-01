import { RawFeaturePoint } from 'expo/src/AR';
import THREE from '../Three';
export default class Points extends THREE.Object3D {
    common: {
        [id: string]: THREE.Points;
    };
    _data: RawFeaturePoint[];
    material: any;
    data: RawFeaturePoint[];
    update: () => void;
}
