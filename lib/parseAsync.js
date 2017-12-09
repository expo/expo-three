// @flow
import Expo from 'expo';

import resolveAsset, { stringFromAsset } from './resolveAsset';
import THREE from './Three';

async function loadBinAsync(binLocalUrl) {
  const bufferLoader = new THREE.FileLoader(THREE.DefaultLoadingManager);
  bufferLoader.setResponseType('arraybuffer');
  return new Promise((res, rej) =>
    bufferLoader.load(binLocalUrl, res, () => {}, rej),
  );
}

async function parseBinAsync({ json, onProgress, assetProvider }) {
  const { buffers, materials } = json;
  if (!buffers) {
    console.error(
      `ExpoTHREE.parseAsync: Invalid json! The json file must contain a "buffers" key.`,
    );
    return;
  }
  const bin = await assetProvider(buffers);
  if (bin === undefined) {
    console.error(
      `ExpoTHREE.parseAsync: Cannot parse undefined .bin. Using the assetProvider you must pass a valid reference for: ${
        buffers
      }.`,
    );
    return;
  }
  const assets = await resolveAsset(bin);
  const binLocalUrl = await stringFromAsset(assets[0]);
  const arrayBuffer = await loadBinAsync(binLocalUrl);

  require('three/examples/js/loaders/BinaryLoader');
  const loader = new THREE.BinaryLoader();
  loader.setPath && loader.setPath(assetProvider);
  return new Promise((res, rej) =>
    loader.parse(
      arrayBuffer,
      geometry => res({ geometry, materials }),
      '', //This is probs wrong
      materials,
    ),
  );
}

async function parseObjectAsync({ json, onProgress, assetProvider }) {
  const loader = new THREE.ObjectLoader();
  loader.setPath && loader.setPath(assetProvider);
  return new Promise(res => loader.parse(json, res));
}
async function parseJsonAsync({ json, onProgress, assetProvider }) {
  const loader = new THREE.JSONLoader();
  loader.setPath && loader.setPath(assetProvider);
  return loader.parse(json, assetProvider);
}
async function parseMaterials({ json, onProgress, assetProvider }) {
  if (json.materials === undefined || json.materials.length === 0) {
    return;
  } else {
    // var materials = Loader.prototype.initMaterials( json.materials, texturePath, this.crossOrigin );
    console.error(
      'ExpoTHREE.parseAsync: THREE.JSONLoader material parsing not yet implemented :/',
    );
  }
}

export default (parseAsync = async ({
  json,
  format,
  onProgress,
  assetProvider,
}) => {
  if (!format) {
    format = solveFormat(json);
  }

  switch (format) {
    case 'bin':
      return parseBinAsync({ json, onProgress, assetProvider });
      break;
    case 'clara':
    case 'object':
      return parseObjectAsync({ json, onProgress, assetProvider });
    case 'json':
    case 'blender':
      return parseJsonAsync({ json, onProgress, assetProvider });
    case 'scene':
    default:
      console.error(
        `ExpoTHREE.parseAsync: ${
          format
        } not supported yet! Tell someone to fix it :}`,
      );
      break;
  }
});
