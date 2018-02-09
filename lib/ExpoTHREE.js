// @flow
import { NativeModules } from 'react-native';
import './polyfill';
import THREE from './Three';

export const renderer = ({ gl, canvas, ...extra }) =>
  new THREE.WebGLRenderer({
    canvas: canvas || {
      width: gl.drawingBufferWidth,
      height: gl.drawingBufferHeight,
      style: {},
      addEventListener: () => {},
      removeEventListener: () => {},
      clientHeight: gl.drawingBufferHeight,
    },
    context: gl,
    ...extra,
  });

export const createRenderer = props => renderer(props);
export const createTextureAsync = ({ asset }) => loadAsync(asset);

export { default as loadCubeTextureAsync } from './loadCubeTextureAsync';
export { default as loadAsync } from './loadAsync';
export { default as parseAsync } from './parseAsync';
export { default as utils } from './utils';
export { default as THREE } from './Three';
export { default as Car } from './Car';

export { default as WorldAlignment } from './AR/WorldAlignment';
import {createARCamera, createARBackgroundTexture, getARLightEstimation, getRawFeaturePoints, getPlanes, setIsLightEstimationEnabled, setWorldAlignment, setIsPlaneDetectionEnabled} from './AR';
export {
  createARCamera, createARBackgroundTexture, getARLightEstimation, getRawFeaturePoints, getPlanes, setIsLightEstimationEnabled, setWorldAlignment, setIsPlaneDetectionEnabled
}