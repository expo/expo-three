import { readAsStringAsync } from 'expo-file-system';
import { Platform } from 'react-native';

import THREE from '../Three';

declare let global: any;

export default async function readFromFileSystemAsStringAsync(
  localUri: string
): Promise<string | null> {
  if (global.__expo_three_log_loading) {
    console.time('loadAsset');
  }

  if (Platform.OS === 'web') {
    const loader = new THREE.FileLoader();
    return new Promise((resolve, reject) =>
      loader.load(
        localUri,
        async (value) => {
          // @ts-ignore
          resolve(await value);
        },
        () => {},
        reject
      )
    );
  }
  try {
    return await readAsStringAsync(localUri);
  } catch ({ message }) {
    throw new Error(
      `ExpoTHREE: FileSystem.readAsStringAsync(${localUri}) ${message}`
    );
  } finally {
    if (global.__expo_three_log_loading) {
      console.timeEnd('loadAsset');
    }
  }
}
