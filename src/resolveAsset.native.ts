import { Asset } from 'expo-asset';
import { resolveAsync } from 'expo-asset-utils';

export default async function resolveAsset(
  fileReference: any
): Promise<Asset[]> {
  const urls: Asset[] = [];
  if (Array.isArray(fileReference)) {
    for (const file of fileReference) {
      const asset = await resolveAsync(file);
      urls.push(asset);
    }
  } else {
    const asset = await resolveAsync(fileReference);
    urls.push(asset);
  }
  return urls;
}

export async function stringFromAsset(
  asset: Asset | string
): Promise<string | null> {
  if (asset instanceof Asset) {
    if (!asset.localUri) {
      await asset.downloadAsync();
    }
    if (!asset.localUri) {
      console.log(
        "Error: You tried to download an Expo.Asset and for some reason it didn't cache... Known reasons are: it's an .mtl file"
      );
    }
    return asset.localUri || asset.uri;
  } else if (typeof asset === 'string') {
    return asset;
  }
  return null;
}
