import { Platform } from '@unimodules/core';
import { readAsStringAsync } from 'expo-file-system';
import THREE from '../Three';
export default async function readFromFileSystemAsStringAsync(localUri) {
    if (global.__expo_three_log_loading) {
        console.time('loadAsset');
    }
    if (Platform.OS === 'web') {
        const loader = new THREE.FileLoader();
        return new Promise((resolve, reject) => loader.load(localUri, async (value) => {
            // @ts-ignore
            resolve(await value);
        }, () => { }, reject));
    }
    try {
        return await readAsStringAsync(localUri);
    }
    catch ({ message }) {
        throw new Error(`ExpoTHREE: FileSystem.readAsStringAsync(${localUri}) ${message}`);
    }
    finally {
        if (global.__expo_three_log_loading) {
            console.timeEnd('loadAsset');
        }
    }
}
//# sourceMappingURL=readAsStringAsync.js.map