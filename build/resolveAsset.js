import { Asset } from 'expo-asset';
import AssetUtils from 'expo-asset-utils';
export default async function resolveAsset(fileReference) {
    let urls = [];
    if (Array.isArray(fileReference)) {
        for (let file of fileReference) {
            const asset = await AssetUtils.resolveAsync(file);
            urls.push(asset);
        }
    }
    else {
        const asset = await AssetUtils.resolveAsync(fileReference);
        urls.push(asset);
    }
    return urls;
}
export async function stringFromAsset(asset) {
    if (asset instanceof Asset) {
        if (!asset.localUri) {
            await asset.downloadAsync();
        }
        if (!asset.localUri) {
            console.log("Error: You tried to download an Expo.Asset and for some reason it didn't cache... Known reasons are: it's an .mtl file");
        }
        return asset.localUri || asset.uri;
    }
    else if (typeof asset === 'string') {
        return asset;
    }
    return null;
}
//# sourceMappingURL=resolveAsset.js.map