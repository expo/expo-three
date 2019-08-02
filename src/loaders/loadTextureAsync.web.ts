import AssetUtils from 'expo-asset-utils';
import THREE from '../Three';

export async function loadTextureAsync({ asset }): Promise<any> {
  if (!asset) {
    throw new Error('ExpoTHREE.loadTextureAsync(): Cannot parse a null asset');
  }
  const assetUrl = await AssetUtils.uriAsync(asset);
  return new THREE.TextureLoader().load(assetUrl);
}
