import '@expo/browser-polyfill';
import * as AR from './AR';
import * as utils from './utils';
import Renderer from './Renderer';
export { default as loadAsync } from './loadAsync';
import { loadTextureAsync } from './loaders/loadTextureAsync';
export * from './loaderClassForExtension';
/*
 Legacy
*/
export function createRenderer(props) {
    console.log('Warning: `ExpoTHREE.createRenderer(props)` is deprecated, use: `new ExpoTHREE.Renderer(props)`');
    return new Renderer(props);
}
export function renderer(props) {
    console.log('Warning: `ExpoTHREE.renderer(props)` is deprecated, use: `new ExpoTHREE.Renderer(props)`');
    return new Renderer(props);
}
export function createTextureAsync({ asset }) {
    console.log('Warning: `ExpoTHREE.createTextureAsync({ asset })` is deprecated, use: `new ExpoTHREE.loadAsync(asset, onLoad, onAssetRequested)`');
    return loadTextureAsync({ asset });
}
export function createARBackgroundTexture(renderer) {
    console.log('Warning: `ExpoTHREE.createTextureAsync({ asset })` is deprecated, use: `ExpoTHREE.loadAsync(asset, onLoad, onAssetRequested)`');
    return new AR.BackgroundTexture(renderer);
}
export function createARCamera(arSession, width, height, zNear, zFar) {
    console.log('Warning: `ExpoTHREE.createARCamera(arSession, width, height, zNear, zFar)` is deprecated, use: `new ExpoTHREE.AR.Camera(width, height, zNear, zFar)`');
    return new AR.Camera(width, height, zNear, zFar);
}
/*
 Exports
*/
export { default as CubeTexture } from './CubeTexture';
export { default as loadCubeTextureAsync } from './loadCubeTextureAsync';
export { default as parseAsync } from './parseAsync';
export { default as THREE } from './Three';
export { default as TextureLoader } from './TextureLoader';
export const ThreeAR = AR;
export { AR, utils, Renderer };
export * from './loaders/loadModelsAsync';
export * from './loaders/loadTextureAsync';
//# sourceMappingURL=ExpoTHREE.js.map