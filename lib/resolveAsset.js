// @flow
import Expo from 'expo';
import { Image } from 'react-native';
import AssetUtils from 'expo-asset-utils';

const resolveAsset = async fileReference => {
  let urls = [];
  if (Array.isArray(fileReference)) {
    for (let file of fileReference) {
      const asset = await AssetUtils.resolveAsync(file);
      urls.push(asset);
    }
  } else {
    const asset = await AssetUtils.resolveAsync(fileReference);
    urls.push(asset);
  }
  return urls;
};

export default resolveAsset;

export async function stringFromAsset(asset): string {
  let url: string;
  if (asset instanceof Expo.Asset) {
    if (!asset.localUri) {
      await asset.downloadAsync();
    }
    url = asset.localUri;
  } else if (typeof asset === 'string') {
    url = asset;
  }
  return url;
}
