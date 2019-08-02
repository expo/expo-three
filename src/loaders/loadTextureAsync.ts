import AssetUtils from 'expo-asset-utils';
import THREE from '../Three';

export async function loadTextureAsync({ asset }): Promise<any> {
  if (!asset) {
    throw new Error('ExpoTHREE.loadTextureAsync(): Cannot parse a null asset');
  }

  let nextAsset = asset;
  if (!nextAsset.localUri) {
    nextAsset = await AssetUtils.resolveAsync(asset);
  }
  const texture = new THREE.Texture();
  texture.image = {
    data: nextAsset,
    width: nextAsset.width,
    height: nextAsset.height,
  };
  texture.needsUpdate = true;
  texture['isDataTexture'] = true; // Forces passing to `gl.texImage2D(...)` verbatim
  texture.minFilter = THREE.LinearFilter; // Pass-through non-power-of-two
  return texture;
}
