import '@expo/browser-polyfill';

import * as AR from './AR';
import * as Nodes from './Nodes';
import * as utils from './utils';
import Renderer from './Renderer';
import loadAsync from './loadAsync';

/*
 Legacy
*/
export function createRenderer(props): Renderer {
  return new Renderer(props);
}

export function createTextureAsync({ asset }) {
  return loadAsync(asset);
}

export function createARBackgroundTexture(
  renderer: THREE.WebGLRenderer
): AR.BackgroundTexture {
  return new AR.BackgroundTexture(renderer);
}

/*
 Exports
*/
export { default as CubeTexture } from './CubeTexture';
export { default as loadCubeTextureAsync } from './loadCubeTextureAsync';
export { default as parseAsync } from './parseAsync';
export { default as THREE } from './Three';

export { AR, Nodes, utils, Renderer, loadAsync };
