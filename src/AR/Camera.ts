import { AR } from 'expo';
import THREE from '../Three';

class ARCamera extends THREE.PerspectiveCamera {
  width: number;
  height: number;

  constructor(width: number, height: number, near: number, far: number) {
    super();

    this.width = width;
    this.height = height;
    this.aspect = height > 0 ? width / height : 0;
    this.near = near;
    this.far = far;
  }

  updateMatrixWorld(): void {
    if (this.width > 0 && this.height > 0) {
      const matrices = AR.getARMatrices(this.near, this.far);
      if (matrices && matrices.viewMatrix) {
        this.matrixWorldInverse.fromArray(matrices.viewMatrix);
        this.matrixWorld.getInverse(this.matrixWorldInverse);
        this.projectionMatrix.fromArray(matrices.projectionMatrix);
      }
    }
  }

  updateProjectionMatrix = (): void => this.updateMatrixWorld();
}

export default ARCamera;
