import resolveAsset, { stringFromAsset } from './resolveAsset';
import THREE from './Three';

async function loadBinAsync(binLocalUrl: string): Promise<any> {
  const bufferLoader = new THREE.FileLoader(THREE.DefaultLoadingManager);
  bufferLoader.setResponseType('arraybuffer');
  return new Promise((res, rej) => bufferLoader.load(binLocalUrl, res, () => {}, rej));
}

async function parseBinAsync({ json, onProgress, assetProvider }): Promise<any> {
  const { buffers, materials } = json;
  if (!buffers) {
    throw new Error(
      `ExpoTHREE.parseAsync: Invalid json! The json file must contain a "buffers" key.`
    );
  }
  const bin = await assetProvider(buffers);
  if (bin === undefined) {
    throw new Error(
      `ExpoTHREE.parseAsync: Cannot parse undefined .bin. Using the assetProvider you must pass a valid reference for: ${buffers}.`
    );
  }
  const assets = await resolveAsset(bin);
  const binLocalUrl = await stringFromAsset(assets[0]);
  if (binLocalUrl == null) {
    throw new Error(`ExpoTHREE.parseBinAsync(): Unable to parse asset: ` + assets[0]);
  }
  const arrayBuffer = await loadBinAsync(binLocalUrl);

  require('three/examples/js/loaders/BinaryLoader');
  // @ts-ignore
  const loader = new THREE.BinaryLoader();
  loader.setPath && loader.setPath(assetProvider);
  return new Promise((res, rej) =>
    loader.parse(
      arrayBuffer,
      geometry => res({ geometry, materials }),
      '', //This is probs wrong
      materials
    )
  );
}

// async function parseMaterials({ json, onProgress, assetProvider }): Promise<any> {
//   if (json.materials === undefined || json.materials.length === 0) {
//   } else {
//     // var materials = Loader.prototype.initMaterials( json.materials, texturePath, this.crossOrigin );
//     throw new Error(
//       'ExpoTHREE.parseAsync: THREE.JSONLoader material parsing not yet implemented :/'
//     );
//   }
// }

async function parseWithLoaderAsync({ json, onProgress, assetProvider, loader }): Promise<any> {
  loader.setPath && loader.setPath(assetProvider);
  return loader.parse(json, assetProvider);
}

type Parseable = {
  json: any;
  format?: string;
  onProgress?: (...args: any[]) => any;
  assetProvider: any;
};

export default async function parseAsync({
  json,
  format,
  onProgress,
  assetProvider,
}: Parseable): Promise<any> {
  if (!format && json.metadata && json.metadata.type) {
    format = json.metadata.type;
  }

  if (!format) {
    throw new Error('ExpoTHREE: parseAsync: Invalid null format provided');
  }

  switch (format.toLowerCase()) {
    case 'bin':
      return parseBinAsync({ json, onProgress, assetProvider });
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
      throw new Error(`ExpoTHREE.parseAsync: ${format} not supported.`);
  }
}
