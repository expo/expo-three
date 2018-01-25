// @flow
import { NativeModules } from 'react-native';
import './polyfill';
import THREE from './Three';

export const renderer = ({ gl, ...extra }) =>
  new THREE.WebGLRenderer({
    ...extra,
    canvas: {
      width: gl.drawingBufferWidth,
      height: gl.drawingBufferHeight,
      style: {},
      addEventListener: () => {},
      removeEventListener: () => {},
      clientHeight: gl.drawingBufferHeight,
    },
    context: gl,
  });

export const createRenderer = props => renderer(props);
export const createTextureAsync = ({ asset }) => loadAsync(asset);

export const createARCamera = (arSession, width, height, near, far) => {
  const camera = new THREE.PerspectiveCamera();

  camera.width = width;
  camera.height = height;
  camera.aspect = height > 0 ? width / height : 0;
  camera.near = near;
  camera.far = far;

  camera.updateMatrixWorld = () => {
    if (width > 0 && height > 0) {
      const matrices = NativeModules.ExponentGLViewManager.getARMatrices(
        arSession.sessionId,
        camera.width,
        camera.height,
        camera.near,
        camera.far,
      );
      if (matrices && matrices.viewMatrix) {
        camera.matrixWorldInverse.fromArray(matrices.viewMatrix);
        camera.matrixWorld.getInverse(camera.matrixWorldInverse);
        camera.projectionMatrix.fromArray(matrices.projectionMatrix);
      }
    }
  };

  camera.updateProjectionMatrix = () => {
    camera.updateMatrixWorld();
  };

  return camera;
};

export const createARBackgroundTexture = (arSession, renderer) => {
  const texture = new THREE.Texture();
  const properties = renderer.properties.get(texture);
  properties.__webglInit = true;
  properties.__webglTexture = new WebGLTexture(arSession.capturedImageTexture);
  return texture;
};

/** 
 * ambientIntensity: number
 Ambient intensity of the lighting.
In a well lit environment, this value is close to 1000. It typically ranges from 0 (very dark) to around 2000 (very bright).

 * ambientColorTemperature: number
 The ambient color temperature of the lighting.
 This specifies the ambient color temperature of the lighting in Kelvin (6500 corresponds to pure white).
*/
export const getARLightEstimation = arSession => {
  return NativeModules.ExponentGLViewManager.getARLightEstimation(
    arSession.sessionId,
  );
};

/**
 Feature points in the scene with respect to the frame’s origin.
 @discussion The feature points are only provided for configurations using world tracking.
 */
export const getRawFeaturePoints = arSession => {
  return NativeModules.ExponentGLViewManager.getRawFeaturePoints(
    arSession.sessionId,
  );
};

/**
 Horizontal planes in the scene with respect to the frame’s origin.
 @discussion Planes are only provided for configurations using world tracking.
 */
export const getPlanes = arSession => {
  return NativeModules.ExponentGLViewManager.getPlanes(arSession.sessionId);
};

/**
 Enable or disable light estimation.
 @discussion Enabled by default.

 isLightEstimationEnabled
 */
export const setIsLightEstimationEnabled = (arSession, isEnabled) => {
  return NativeModules.ExponentGLViewManager.setIsLightEstimationEnabled(
    arSession.sessionId,
    isEnabled,
  );
};

/**
 Set scene world alignment. Possible values are:
  - ExpoTHREE.WorldAlignment.Gravity
  - ExpoTHREE.WorldAlignment.GravityAndHeading
  - ExpoTHREE.WorldAlignment.Camera
 
 @discussion By default ExpoTHREE.WorldAlignment.Gravity is used.

 setWorldAlignment
 */
export const setWorldAlignment = (arSession, worldAlignment) => {
  return NativeModules.ExponentGLViewManager.setWorldAlignment(
    arSession.sessionId,
    worldAlignment,
  );
};

export { default as WorldAlignment } from './WorldAlignment';

/**
 Type of planes to detect in the scene.
 @discussion If set, new planes will continue to be detected and updated over time. Detected planes will be added to the session as
 ARPlaneAnchor objects. In the event that two planes are merged, the newer plane will be removed. Defaults to ARPlaneDetectionNone.

 ARPlaneDetection planeDetection
 */
export const setIsPlaneDetectionEnabled = (arSession, isEnabled) => {
  return NativeModules.ExponentGLViewManager.setIsPlaneDetectionEnabled(
    arSession.sessionId,
    isEnabled,
  );
};

export { default as loadCubeTextureAsync } from './loadCubeTextureAsync';
export { default as loadAsync } from './loadAsync';
export { default as parseAsync } from './parseAsync';
export { default as utils } from './utils';
export { default as THREE } from './Three';
export { default as Car } from './Car';
