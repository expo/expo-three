// Ignore yellow box warnings for now since they often have to do
// with GL extensions that we know we don't support.

import YellowBox from 'react-native/Libraries/ReactNative/YellowBox';
YellowBox.ignoreWarnings(['THREE']);


// THREE.js tries to add some event listeners to the window, for now
// just ignore them.

if (!window.addEventListener) {
  window.addEventListener = () => {};
}


const THREE = require('three');

export const createRenderer = ({ gl, ...extra }) =>
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

export const createTextureAsync = async ({ asset }) => {
  if (!asset.localUri) {
    await asset.downloadAsync();
  }
  const texture = new THREE.Texture();
  texture.image = {
    data: asset,
    width: asset.width,
    height: asset.height,
  };
  texture.needsUpdate = true;
  texture.isDataTexture = true; // Forces passing to `gl.texImage2D(...)` verbatim
  texture.minFilter = THREE.LinearFilter; // Pass-through non-power-of-two
  return texture;
};
