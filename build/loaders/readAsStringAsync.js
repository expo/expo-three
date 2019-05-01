import { readAsStringAsync } from 'expo-file-system';
export default async function readFromFileSystemAsStringAsync(localUri) {
    if (global.__expo_three_log_loading) {
        console.time('loadAsset');
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