import THREE from './Three';

async function parseWithLoaderAsync({ json, assetProvider, loader }): Promise<any> {
  loader.setPath && loader.setPath(assetProvider);
  return loader.parse(json, assetProvider);
}

type Parseable = {
  json: any;
  format?: string;
  onProgress?: (...args: any[]) => any;
  assetProvider: any;
};

export default async function parseAsync({ json, format, assetProvider }: Parseable): Promise<any> {
  if (!format && json.metadata && json.metadata.type) {
    format = json.metadata.type;
  }

  if (!format) {
    throw new Error('ExpoTHREE: parseAsync: Invalid null format provided');
  }

  switch (format) {
    case 'clara':
    case 'object':
      return parseWithLoaderAsync({
        json,
        assetProvider,
        loader: new THREE.ObjectLoader(),
      });
    case 'json':
    case 'blender':
      return parseWithLoaderAsync({
        json,
        assetProvider,
        loader: new THREE.JSONLoader(),
      });
    case 'buffer':
      return parseWithLoaderAsync({
        json,
        assetProvider,
        loader: new THREE.BufferGeometryLoader(),
      });
    case 'scene':
    default:
      throw new Error(`ExpoTHREE.parseAsync: ${format} not supported.`);
  }
}
