import THREE from '../Three';
declare class MagneticObject extends THREE.Object3D {
    recentMagneticPositions: any[];
    anchorsOfVisitedPlanes: any[];
    maintainScale: boolean;
    maintainRotation: boolean;
    constructor();
    updateForAnchor: (position: any, planeAnchor: any, camera: any) => void;
    update: (camera: any, screenPosition: any) => void;
    isValidVector: (vector: any) => boolean;
    updateTransform: (position: any, camera: any) => void;
    normalize: (angle: number, ref: number) => number;
    readonly worldPosition: THREE.Vector3;
    scaleBasedOnDistance: (camera: any) => number;
}
export default MagneticObject;
