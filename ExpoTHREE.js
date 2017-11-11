import { NativeModules } from "react-native";

// Ignore yellow box warnings for now since they often have to do
// with GL extensions that we know we don't support.

// import YellowBox from 'react-native/Libraries/ReactNative/YellowBox';
// YellowBox.ignoreWarnings(['THREE']);

// THREE.js tries to add some event listeners to the window, for now
// just ignore them.

if (!window.addEventListener) {
  window.addEventListener = () => {};
}

const THREE = require("three");

export const createRenderer = ({ gl, ...extra }) =>
  new THREE.WebGLRenderer({
    ...extra,
    canvas: {
      width: gl.drawingBufferWidth,
      height: gl.drawingBufferHeight,
      style: {},
      addEventListener: () => {},
      removeEventListener: () => {},
      clientHeight: gl.drawingBufferHeight
    },
    context: gl
  });

export const createTextureAsync = async ({ asset }) => {
  if (!asset.localUri) {
    await asset.downloadAsync();
  }
  const texture = new THREE.Texture();
  texture.image = {
    data: asset,
    width: asset.width,
    height: asset.height
  };
  texture.needsUpdate = true;
  texture.isDataTexture = true; // Forces passing to `gl.texImage2D(...)` verbatim
  texture.minFilter = THREE.LinearFilter; // Pass-through non-power-of-two
  return texture;
};

export const createARCamera = (arSession, width, height, near, far) => {
  const camera = new THREE.PerspectiveCamera();

  camera.width = width;
  camera.height = height;
  camera.aspect = width / height;
  camera.near = near;
  camera.far = far;

  camera.updateMatrixWorld = () => {
    const matrices = NativeModules.ExponentGLViewManager.getARMatrices(
      arSession.sessionId,
      camera.width,
      camera.height,
      camera.near,
      camera.far
    );
    if (matrices && matrices.viewMatrix) {
      camera.matrixWorldInverse.fromArray(matrices.viewMatrix);
      camera.matrixWorld.getInverse(camera.matrixWorldInverse);
      camera.projectionMatrix.fromArray(matrices.projectionMatrix);
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
    arSession.sessionId
  );
};

/**
 Feature points in the scene with respect to the frame’s origin.
 @discussion The feature points are only provided for configurations using world tracking.
 */
export const getRawFeaturePoints = arSession => {
  return NativeModules.ExponentGLViewManager.getRawFeaturePoints(
    arSession.sessionId
  );
};

/**
 Enable or disable light estimation.
 @discussion Enabled by default.

 isLightEstimationEnabled
 */
export const enableLightEstimation = (arSession, enable) => {
  return NativeModules.ExponentGLViewManager.enableLightEstimation(
    arSession.sessionId,
    enable
  );
};

/**
 Type of planes to detect in the scene.
 @discussion If set, new planes will continue to be detected and updated over time. Detected planes will be added to the session as
 ARPlaneAnchor objects. In the event that two planes are merged, the newer plane will be removed. Defaults to ARPlaneDetectionNone.

 ARPlaneDetection planeDetection
 */
export const enablePlaneDetection = (arSession, enable) => {
  return NativeModules.ExponentGLViewManager.enablePlaneDetection(
    arSession.sessionId,
    enable
  );
};
