import AssetUtils from 'expo-asset-utils';
import THREE from './Three';
import { Platform } from '@unimodules/core';

// JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
function formatFromURI(uri: string) {
  const isJPEG =
    uri.search(/\.jpe?g($|\?)/i) > 0 || uri.search(/^data\:image\/jpeg/) === 0;

  return isJPEG ? THREE.RGBFormat : THREE.RGBAFormat;
}

export default class ExpoTextureLoader extends THREE.TextureLoader {
  load(
    asset: any,
    onLoad?: (texture: THREE.Texture) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (event: ErrorEvent) => void,
  ): THREE.Texture {
    if (!asset) {
      throw new Error(
        'ExpoTHREE.TextureLoader.load(): Cannot parse a null asset',
      );
    }

    let texture = new THREE.Texture();

    const loader = new THREE.ImageLoader(this.manager);
    loader.setCrossOrigin(this.crossOrigin);
    loader.setPath(this.path);

    (async () => {
      const nativeAsset = await AssetUtils.resolveAsync(asset);

      function parseAsset(image) {
        texture.image = image;

        // JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
        texture.format = formatFromURI(nativeAsset.localUri);
        texture.needsUpdate = true;

        if (onLoad !== undefined) {
          onLoad(texture);
        }
      }

      if (Platform.OS === 'web') {
        loader.load(
          nativeAsset.localUri,
          image => {
            parseAsset(image);
          },
          onProgress,
          onError,
        );
      } else {
        texture['isDataTexture'] = true; // Forces passing to `gl.texImage2D(...)` verbatim
        texture.minFilter = THREE.LinearFilter; // Pass-through non-power-of-two

        parseAsset({
          data: nativeAsset,
          width: nativeAsset.width,
          height: nativeAsset.height,
        });
      }
    })();

    return texture;
  }
}
