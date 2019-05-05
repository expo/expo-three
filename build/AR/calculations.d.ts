import { AR } from 'expo';
import THREE from '../Three';
import ARCamera from './Camera';
export declare class HitTestRay {
    origin?: THREE.Vector3;
    direction?: THREE.Vector3;
    constructor(origin: THREE.Vector3, direction: THREE.Vector3);
}
export declare class FeatureHitTestResult {
    position: any;
    distanceToRayOrigin: any;
    featureHit: any;
    featureDistanceToHitResult: any;
}
export declare function suppressWarnings(): void;
export declare function hitTestWithFeatures(camera: ARCamera, point: THREE.Vector2, coneOpeningAngleInDegrees: number, minDistance?: number, maxDistance?: number, maxResults?: number, rawFeaturePoints?: any[]): FeatureHitTestResult[];
export declare function hitTestWithPoint(camera: ARCamera, point: THREE.Vector2): FeatureHitTestResult[];
export declare function unprojectPoint(camera: ARCamera, point: THREE.Vector3): THREE.Vector3;
export declare function hitTestRayFromScreenPos(camera: ARCamera, point: THREE.Vector2): HitTestRay;
export declare function hitTestFromOrigin(origin: THREE.Vector3, direction: THREE.Vector3, rawFeaturePoints?: any[]): FeatureHitTestResult | null;
export declare function hitTestWithInfiniteHorizontalPlane(camera: ARCamera, point: THREE.Vector2, pointOnPlane: THREE.Vector3): THREE.Vector3 | null;
export declare function rayIntersectionWithHorizontalPlane(rayOrigin: THREE.Vector3 | undefined, direction: THREE.Vector3, planeY: number): THREE.Vector3 | null;
export declare function convertTransformArray(transform: number[]): THREE.Matrix4;
export declare function positionFromTransform(transform: THREE.Matrix4): THREE.Vector3;
export declare function worldPositionFromScreenPosition(camera: ARCamera, position: THREE.Vector2, objectPos: THREE.Vector3, infinitePlane?: boolean, dragOnInfinitePlanesEnabled?: boolean, rawFeaturePoints?: any): null | {
    worldPosition?: THREE.Vector3;
    planeAnchor: AR.PlaneAnchor | null;
    hitAPlane: boolean;
};
export declare function positionFromAnchor({ worldTransform }: {
    worldTransform: any;
}): THREE.Vector3;
export declare function improviseHitTest(point: any, camera: ARCamera): THREE.Vector3;
