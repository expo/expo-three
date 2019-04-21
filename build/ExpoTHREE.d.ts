import * as AR from './AR';
import * as utils from './utils';
import Renderer from './Renderer';
export { default as loadAsync } from './loadAsync';
export * from './loaderClassForExtension';
export declare function createRenderer(props: any): Renderer;
export declare function renderer(props: any): Renderer;
export declare function createTextureAsync({ asset }: {
    asset: any;
}): Promise<any>;
export declare function createARBackgroundTexture(renderer: THREE.WebGLRenderer): AR.BackgroundTexture;
export declare function createARCamera(arSession: any, width: number, height: number, zNear: number, zFar: number): AR.Camera;
export { default as CubeTexture } from './CubeTexture';
export { default as loadCubeTextureAsync } from './loadCubeTextureAsync';
export { default as parseAsync } from './parseAsync';
export { default as THREE } from './Three';
export declare const ThreeAR: typeof AR;
export { AR, utils, Renderer, };
export * from './loaders/loadModelsAsync';
