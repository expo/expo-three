import { resolveAsync } from 'expo-asset-utils';

import {
  loaderClassForExtension,
  loaderClassForUri,
} from './loaderClassForExtension';
import {
  loadDaeAsync,
  loadObjAsync,
  loadMtlAsync,
  loadArrayBufferAsync,
} from './loaders/loadModelsAsync';
import './polyfillTextureLoader.fx';
import { loadTextureAsync } from './loaders/loadTextureAsync';
import { ProgressCallback } from './loading.types';
import resolveAsset, { stringFromAsset } from './resolveAsset';
import { matchUrlExtension, matchUrlExtensions } from './utils';

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
  onAssetRequested: (...args: any[]) => any = function () {}
) {
  const urls = await resolveAsset(res);
  if (!urls) {
    throw new Error(
      `ExpoTHREE.loadAsync: Cannot parse undefined assets. Please pass valid resources for: ${res}.`
    );
  }
  const asset = urls[0];
  const url: string | null = (await resolveAsync(asset)).localUri;

  if (url == null) {
    throw new Error(
      `ExpoTHREE.loadAsync: this asset couldn't be downloaded. Be sure that your app.json contains the correct extensions.`
    );
  }

  if (urls.length === 1) {
    if (matchUrlExtensions(url, ['jpeg', 'jpg', 'gif', 'png'])) {
      return loadTextureAsync({ asset });
    } else if (matchUrlExtension(url, 'dae')) {
      return loadDaeAsync({
        asset: url,
        onProgress,
        onAssetRequested,
      });
    } else if (matchUrlExtensions(url, ['glb', 'gltf'])) {
      const arrayBuffer = await loadArrayBufferAsync({ uri: url, onProgress });
      const GLTFLoader = loaderClassForExtension('gltf');
      const loader = new GLTFLoader();
      return new Promise((res, rej) =>
        loader.parse(arrayBuffer, onAssetRequested, res, rej)
      );
    } else if (matchUrlExtension(url, 'json')) {
      throw new Error(
        'loadAsync: Please use ExpoTHREE.parseAsync({json}) instead, json can be loaded in lots of different ways.'
      );
    } else if (matchUrlExtension(url, 'obj')) {
      console.log('loading obj');
      return loadObjAsync({ asset: url, onAssetRequested });
    } else if (matchUrlExtension(url, 'mtl')) {
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
    const urlB = await stringFromAsset(urls[1]);
    if (urlB != null) {
      if (matchUrlExtension(url, 'mtl') && matchUrlExtension(urlB, 'obj')) {
        return loadObjAsync({
          asset: urlB,
          mtlAsset: url,
          onAssetRequested,
        });
      } else if (
        matchUrlExtension(url, 'obj') &&
        matchUrlExtension(urlB, 'mtl')
      ) {
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
