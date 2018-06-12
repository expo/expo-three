import THREE from './Three';
import loadAsync from './loadAsync';

function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
  );
}

function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

const getAssetAsync = (name, callbackOrDictionary) => {
  if (isFunction(callbackOrDictionary)) {
    return assetProvider(name);
  } else if (isObject(callbackOrDictionary)) {
    if (name in callbackOrDictionary) {
      return callbackOrDictionary[name];
    } else {
      console.error(
        "getAssetAsync: object `callbackOrDictionary` doesn't contain key",
        name
      );
    }
  } else {
    console.error(
      'getAssetAsync: prop `callbackOrDictionary` must be a function or object'
    );
  }
};

class CubeTexture extends THREE.CubeTexture {
  static format = {
    direct_s: ['lf', 'rt', 'up', 'dn', 'ft', 'bk'],
    coord_s: ['px', 'nx', 'py', 'ny', 'pz', 'nz'],
    coord_m: ['xpos', 'xneg', 'ypos', 'yneg', 'zpos', 'zneg'],
  };
  loadAsync = async ({ assetForDirection, directions }) => {
    const nextDirections = directions || CubeTexture.format.coord_s;

    for (let direction of nextDirections) {
      const asset = await getAssetAsync(direction, assetForDirection);
      const texture = await loadAsync(asset);
      this.images.push(texture);
    }
    this.needsUpdate = true;
  };
}

export default CubeTexture;
