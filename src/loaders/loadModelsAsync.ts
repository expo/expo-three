import { resolveAsync } from 'expo-asset-utils';
import { Platform } from 'react-native';
import { FileLoader } from 'three';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import readAsStringAsync from './readAsStringAsync';

async function loadFileAsync({ asset, funcName }): Promise<string | null> {
  if (!asset) {
    throw new Error(`ExpoTHREE.${funcName}: Cannot parse a null asset`);
  }
  return (await resolveAsync(asset)).localUri ?? null;
}

export async function loadMtlAsync({ asset, onAssetRequested }): Promise<any> {
  const uri = await loadFileAsync({
    asset,
    funcName: 'loadMtlAsync',
  });
  if (!uri) return;

  const loader = new MTLLoader();
  loader.setPath(onAssetRequested);

  if (Platform.OS === 'web') {
    return await new Promise((resolve, reject) =>
      loader.load(uri, resolve, () => {}, reject)
    );
  }

  return loadFileContentsAsync(loader, uri, 'loadMtlAsync');
}

export async function loadObjAsync(options: {
  asset: any;
  onAssetRequested?: (...args: any[]) => any;
  onMtlAssetRequested?: (...args: any[]) => any;
  mtlAsset?: any;
  materials?: any;
}): Promise<any> {
  const { asset, onAssetRequested, onMtlAssetRequested, mtlAsset, materials } =
    options;
  let nextMaterials = materials;
  if (nextMaterials == null && mtlAsset != null) {
    nextMaterials = await loadMtlAsync({
      asset: mtlAsset,
      onAssetRequested: onMtlAssetRequested || onAssetRequested,
    });
    nextMaterials.preload();
  }

  const uri = await loadFileAsync({
    asset,
    funcName: 'loadObjAsync',
  });
  if (!uri) return;

  const loader = new OBJLoader();
  if (onAssetRequested) {
    loader.setPath(onAssetRequested as any);
  }
  if (nextMaterials != null) {
    loader.setMaterials(nextMaterials);
  }

  if (Platform.OS === 'web') {
    return await new Promise((resolve, reject) =>
      loader.load(uri, resolve, () => {}, reject)
    );
  }

  return loadFileContentsAsync(loader, uri, 'loadObjAsync');
}

export async function loadDaeAsync({
  asset,
  onAssetRequested,
  onProgress,
}): Promise<any> {
  const uri = await loadFileAsync({
    asset,
    funcName: 'loadDaeAsync',
  });
  if (typeof uri !== 'string' || uri == null) {
    return;
  }

  return new Promise((res, rej) =>
    new FileLoader().load(
      uri!,
      (text) => {
        // @ts-ignore
        const loader = new ColladaLoader();
        const parsedResult = (loader.parse as any)(text, onAssetRequested);
        res(parsedResult);
      },
      onProgress,
      rej
    )
  );
}

async function loadFileContentsAsync(loader, uri, funcName): Promise<any> {
  try {
    const fileContents = await readAsStringAsync(uri);
    return loader.parse(fileContents);
  } catch ({ message }) {
    // Or model loader THREE.OBJLoader failed to parse fileContents
    throw new Error(
      `ExpoTHREE.${funcName}: Expo.FileSystem Failed to read uri: ${uri}. ${message}`
    );
  }
}

export async function loadArrayBufferAsync({ uri, onProgress }): Promise<any> {
  const loader = new FileLoader();
  loader.setResponseType('arraybuffer');
  return new Promise((res, rej) => loader.load(uri, res, onProgress, rej));
}
