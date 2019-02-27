import { readAsStringAsync } from 'expo-file-system';

declare var global: any;

export default async function readFromFileSystemAsStringAsync(
  localUri: string
): Promise<string | null> {
  if (global.__expo_three_log_loading) {
    console.time('loadAsset');
  }
  try {
    return await readAsStringAsync(localUri);
  } catch ({ message }) {
    throw new Error(`ExpoTHREE: FileSystem.readAsStringAsync(${localUri}) ${message}`);
  } finally {
    if (global.__expo_three_log_loading) {
      console.timeEnd('loadAsset');
    }
  }
}
