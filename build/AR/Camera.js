import { AR } from 'expo';
import THREE from '../Three';
class ARCamera extends THREE.PerspectiveCamera {
    constructor(width, height, near, far) {
        super();
        this.updateProjectionMatrix = () => this.updateMatrixWorld();
        this.width = width;
        this.height = height;
        this.aspect = height > 0 ? width / height : 0;
        this.near = near;
        this.far = far;
    }
    updateMatrixWorld() {
        if (this.width > 0 && this.height > 0) {
            const matrices = AR.getARMatrices(this.near, this.far);
            if (matrices && matrices.viewMatrix) {
                this.matrixWorldInverse.fromArray(matrices.viewMatrix);
                this.matrixWorld.getInverse(this.matrixWorldInverse);
                this.projectionMatrix.fromArray(matrices.projectionMatrix);
            }
        }
    }
}
export default ARCamera;
//# sourceMappingURL=Camera.js.map