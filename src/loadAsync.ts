import { uriAsync } from 'expo-asset-utils';
import resolveAsset, { stringFromAsset } from './resolveAsset';
import { ProgressCallback } from './loading.types';
import { loadTexture } from './loadTexture';
import {
  loadDaeAsync,
  loadObjAsync,
  loadMtlAsync,
  loadArrayBufferAsync,
} from './loaders/loadModelsAsync';
import './polyfillTextureLoader.fx';

import { loadTextureAsync } from './loaders/loadTextureAsync';
import {
  loaderClassForExtension,
  loaderClassForUri,
} from './loaderClassForExtension';

export async function loadBasicModelAsync(options: {
  uri: string;
  onProgress?: ProgressCallback;
  onAssetRequested: any;
  loader?: any;
  LoaderClass: any;
}) {
  const { uri, onProgress, onAssetRequested, loader, LoaderClass } = options;
  const _loader = loader || new LoaderClass();
  if (_loader.setPath) {
    _loader.setPath(onAssetRequested);
  }
  return new Promise((res, rej) => _loader.load(uri, res, onProgress, rej));
}

export default async function loadAsync(
  res,
  onProgress?: ProgressCallback,
  onAssetRequested = function() {},
) {
  let urls = await resolveAsset(res);
  if (!urls) {
    throw new Error(
      `ExpoTHREE.loadAsync: Cannot parse undefined assets. Please pass valid resources for: ${res}.`,
    );
  }
  const asset = urls[0];
  let url: string | null = await uriAsync(asset);

  if (url == null) {
    throw new Error(
      `ExpoTHREE.loadAsync: this asset couldn't be downloaded. Be sure that your app.json contains the correct extensions.`,
    );
  }

  if (urls.length == 1) {
    if (url.match(/\.(jpeg|jpg|gif|png)$/)) {
      return loadTextureAsync({ asset });
    } else if (url.match(/\.assimp$/i)) {
      const arrayBuffer = await loadArrayBufferAsync({ uri: url, onProgress });
      const AssimpLoader = loaderClassForExtension('assimp');
      const loader = new AssimpLoader();
      return loader.parse(arrayBuffer, onAssetRequested);
    } else if (url.match(/\.dae$/i)) {
      return loadDaeAsync({
        asset: url,
        onProgress,
        onAssetRequested,
      });
    } else if (url.match(/\.fbx$/i)) {
      const arrayBuffer = await loadArrayBufferAsync({ uri: url, onProgress });
      const FBXLoader = loaderClassForExtension('fbx');
      const loader = new FBXLoader();
      return loader.parse(arrayBuffer, onAssetRequested);
    } else if (url.match(/\.glb|gltf$/i)) {
      const arrayBuffer = await loadArrayBufferAsync({ uri: url, onProgress });
      const GLTFLoader = loaderClassForExtension('gltf');
      const loader = new GLTFLoader();
      return new Promise((res, rej) =>
        loader.parse(arrayBuffer, onAssetRequested, res, rej),
      );
    } else if (url.match(/\.x$/i)) {
      const XLoader = loaderClassForExtension('x');

      const texLoader = {
        path: onAssetRequested,
        load: loadTexture,
      };
      const loader = new XLoader(undefined, texLoader);
      return new Promise((res, rej) =>
        loader.load([url, false], res, onProgress, rej),
      );
    } else if (url.match(/\.json$/i)) {
      throw new Error(
        'loadAsync: Please use ExpoTHREE.parseAsync({json}) instead, json can be loaded in lots of different ways.',
      );
    } else if (url.match(/\.obj$/i)) {
      return loadObjAsync({ asset: url, onAssetRequested });
    } else if (url.match(/\.mtl$/i)) {
      return loadMtlAsync({ asset: url, onAssetRequested });
    } else {
      const LoaderClass = loaderClassForUri(url);
      return loadBasicModelAsync({
        uri: url,
        onProgress,
        onAssetRequested,
        LoaderClass,
      });
    }
  } else if (urls.length === 2) {
    let urlB = await stringFromAsset(urls[1]);
    if (urlB != null) {
      if (url.match(/\.mtl$/i) && urlB.match(/\.obj$/i)) {
        return loadObjAsync({
          asset: urlB,
          mtlAsset: url,
          onAssetRequested,
        });
      } else if (url.match(/\.obj$/i) && urlB.match(/\.mtl$/i)) {
        return loadObjAsync({
          asset: url,
          mtlAsset: urlB,
          onAssetRequested,
        });
      }
    }

    throw new Error('Unrecognized File Type: ' + url);
  } else {
    throw new Error('Too many arguments passed: ' + urls);
  }
}
