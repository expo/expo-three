import THREE from './Three';
export declare function alignMesh(mesh: THREE.Mesh, axis?: {
    x: number;
    y: number;
    z: number;
}): void;
export declare function scaleLongestSideToSize(mesh: THREE.Mesh, size: number): void;
/** Used for smoothing imported meshes */
export declare function computeMeshNormals(mesh: THREE.Mesh): void;
export declare function toBufferGeometry(geometry: THREE.Geometry | THREE.BufferGeometry): THREE.BufferGeometry;
export declare function toGeometry(geometry: THREE.Geometry | THREE.BufferGeometry): THREE.Geometry;
