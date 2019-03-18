// @flow
import resolveAsset, { stringFromAsset } from './resolveAsset';
import THREE from './Three';

async function parseMaterials({ json, onProgress, assetProvider }) {
  if (json.materials === undefined || json.materials.length === 0) {
    return;
  } else {
    // var materials = Loader.prototype.initMaterials( json.materials, texturePath, this.crossOrigin );
    throw new Error(
      'ExpoTHREE.parseAsync: THREE.JSONLoader material parsing not yet implemented :/'
    );
  }
}

async function parseWithLoaderAsync({
  json,
  onProgress,
  assetProvider,
  loader,
}) {
  loader.setPath && loader.setPath(assetProvider);
  return loader.parse(json, assetProvider);
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
    case 'clara':
    case 'object':
      return parseWithLoaderAsync({
        json,
        onProgress,
        assetProvider,
        loader: new THREE.ObjectLoader(),
      });
    case 'json':
    case 'blender':
      return parseWithLoaderAsync({
        json,
        onProgress,
        assetProvider,
        loader: new THREE.JSONLoader(),
      });
    case 'buffer':
      return parseWithLoaderAsync({
        json,
        onProgress,
        assetProvider,
        loader: new THREE.BufferGeometryLoader(),
      });
    case 'scene':
    default:
      throw new Error(
        `ExpoTHREE.parseAsync: ${format} not supported yet! Tell someone to fix it :}`
      );
  }
});

function solveFormat({ metadata }) {
  if (metadata !== undefined) {
    const { type } = metadata;
    if (type !== undefined) {
      return type;
    }
  }
}
