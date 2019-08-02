import { Platform } from '@unimodules/core';
import AssetUtils from 'expo-asset-utils';
import THREE from '../Three';
import readAsStringAsync from './readAsStringAsync';
async function loadFileAsync({ asset, funcName }) {
    if (!asset) {
        throw new Error(`ExpoTHREE.${funcName}: Cannot parse a null asset`);
    }
    return await AssetUtils.uriAsync(asset);
}
export async function loadMtlAsync({ asset, onAssetRequested }) {
    const uri = await loadFileAsync({
        asset,
        funcName: 'loadMtlAsync',
    });
    if (!uri)
        return;
    // @ts-ignore
    if (THREE.MTLLoader == null) {
        require('./MTLLoader');
    }
    // @ts-ignore
    const loader = new THREE.MTLLoader();
    loader.setPath(onAssetRequested);
    if (Platform.OS === 'web') {
        return await new Promise((resolve, reject) => loader.load(uri, resolve, () => { }, reject));
    }
    return loadFileContentsAsync(loader, uri, 'loadMtlAsync');
}
export async function loadObjAsync(options) {
    const { asset, onAssetRequested, onMtlAssetRequested, mtlAsset, materials, } = options;
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
    if (!uri)
        return;
    // @ts-ignore
    if (THREE.OBJLoader == null) {
        require('three/examples/js/loaders/OBJLoader');
    }
    // @ts-ignore
    const loader = new THREE.OBJLoader();
    if (onAssetRequested) {
        loader.setPath(onAssetRequested);
    }
    if (nextMaterials != null) {
        loader.setMaterials(nextMaterials);
    }
    if (Platform.OS === 'web') {
        return await new Promise((resolve, reject) => loader.load(uri, resolve, () => { }, reject));
    }
    return loadFileContentsAsync(loader, uri, 'loadObjAsync');
}
export async function loadDaeAsync({ asset, onAssetRequested, onProgress, }) {
    const uri = await loadFileAsync({
        asset,
        funcName: 'loadDaeAsync',
    });
    if (typeof uri !== 'string' || uri == null) {
        return;
    }
    // @ts-ignore
    if (THREE.ColladaLoader == null) {
        require('three/examples/js/loaders/ColladaLoader');
    }
    return new Promise((res, rej) => new THREE.FileLoader().load(uri, text => {
        // @ts-ignore
        const loader = new THREE.ColladaLoader();
        const parsedResult = loader.parse(text, onAssetRequested);
        res(parsedResult);
    }, onProgress, rej));
}
async function loadFileContentsAsync(loader, uri, funcName) {
    try {
        const fileContents = await readAsStringAsync(uri);
        return loader.parse(fileContents);
    }
    catch ({ message }) {
        // Or model loader THREE.OBJLoader failed to parse fileContents
        throw new Error(`ExpoTHREE.${funcName}: Expo.FileSystem Failed to read uri: ${uri}. ${message}`);
    }
}
export async function loadArrayBufferAsync({ uri, onProgress }) {
    const loader = new THREE.FileLoader();
    loader.setResponseType('arraybuffer');
    return new Promise((res, rej) => loader.load(uri, res, onProgress, rej));
}
//# sourceMappingURL=loadModelsAsync.js.map