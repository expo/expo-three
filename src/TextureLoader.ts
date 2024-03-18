import { resolveAsync } from 'expo-asset-utils';
import { Platform, Image } from 'react-native';

import THREE from './Three';

export default class ExpoTextureLoader extends THREE.TextureLoader {
  load(
    asset: any,
    onLoad?: (texture: THREE.Texture) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (event: unknown) => void
  ): THREE.Texture {
    if (!asset) {
      throw new Error(
        'ExpoTHREE.TextureLoader.load(): Cannot parse a null asset'
      );
    }

    const texture = new THREE.Texture();

    const loader = new THREE.ImageLoader(this.manager);
    loader.setCrossOrigin(this.crossOrigin);
    loader.setPath(this.path);

    (async () => {
      const nativeAsset = await resolveAsync(asset);

      function parseAsset(image) {
        texture.image = image;
        texture.needsUpdate = true;

        if (onLoad !== undefined) {
          onLoad(texture);
        }
      }

      if (Platform.OS === 'web') {
        loader.load(
          nativeAsset.localUri!,
          (image) => {
            parseAsset(image);
          },
          onProgress,
          onError
        );
      } else {
        if (!nativeAsset.width || !nativeAsset.height) {
          const { width, height } = await new Promise<{
            width: number;
            height: number;
          }>((res, rej) => {
            Image.getSize(
              nativeAsset.localUri!,
              (width: number, height: number) => res({ width, height }),
              rej
            );
          });
          nativeAsset.width = width;
          nativeAsset.height = height;
        }
        texture['isDataTexture'] = true; // Forces passing to `gl.texImage2D(...)` verbatim

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
