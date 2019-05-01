import THREE from '../Three';
declare class ARCamera extends THREE.PerspectiveCamera {
    width: number;
    height: number;
    constructor(width: number, height: number, near: number, far: number);
    updateMatrixWorld(): void;
    updateProjectionMatrix: () => void;
}
export default ARCamera;
