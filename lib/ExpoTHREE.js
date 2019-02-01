import '@expo/browser-polyfill';

import * as AR from './AR';
import * as Nodes from './Nodes';
import * as utils from './utils';
import Renderer from './Renderer';
import loadAsync from './loadAsync';
import {
  loadObjAsync,
  loadMtlAsync,
  loadDaeAsync,
  loadTextureAsync,
  loadArrayBufferAsync,
} from './loaders/loadModelsAsync';

import {
  loaderClassForUri,
  loaderClassForExtension,
} from './loaderClassForExtension';
/*
 Legacy
*/
export function createRenderer(props): Renderer {
  console.log(
    'Warning: `ExpoTHREE.createRenderer(props)` is deprecated, use: `new ExpoTHREE.Renderer(props)`'
  );
  return new Renderer(props);
}

export function renderer(props): Renderer {
  console.log(
    'Warning: `ExpoTHREE.renderer(props)` is deprecated, use: `new ExpoTHREE.Renderer(props)`'
  );

  return new Renderer(props);
}

export function createTextureAsync({ asset }) {
  console.log(
    'Warning: `ExpoTHREE.createTextureAsync({ asset })` is deprecated, use: `new ExpoTHREE.loadAsync(asset, onLoad, onAssetRequested)`'
  );
  return loadTextureAsync({ asset });
}

export function createARBackgroundTexture(
  renderer: THREE.WebGLRenderer
): AR.BackgroundTexture {
  console.log(
    'Warning: `ExpoTHREE.createTextureAsync({ asset })` is deprecated, use: `ExpoTHREE.loadAsync(asset, onLoad, onAssetRequested)`'
  );

  return new AR.BackgroundTexture(renderer);
}

export function createARCamera(arSession, width, height, zNear, zFar) {
  console.log(
    'Warning: `ExpoTHREE.createARCamera(arSession, width, height, zNear, zFar)` is deprecated, use: `new ExpoTHREE.AR.Camera(width, height, zNear, zFar)`'
  );

  return new AR.Camera(width, height, zNear, zFar);
}

/*
 Exports
*/
export { default as CubeTexture } from './CubeTexture';
export { default as loadCubeTextureAsync } from './loadCubeTextureAsync';
export { default as parseAsync } from './parseAsync';
export { default as THREE } from './Three';

const ThreeAR = AR;

export {
  AR,
  ThreeAR,
  Nodes,
  utils,
  Renderer,
  loadAsync,
  loadObjAsync,
  loadMtlAsync,
  loadDaeAsync,
  loadTextureAsync,
  loadArrayBufferAsync,
  loaderClassForExtension,
  loaderClassForUri,
};
