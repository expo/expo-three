import { loadTextureAsync } from './loaders/loadTextureAsync';
import THREE from './Three';
import parseAssetCallback from './loaders/parseAssetCallback';

export function loadTexture(url, onLoad, onProgress, onError) {
  const texture = new THREE.Texture();
  if (
    // @ts-ignore
    typeof this.path === 'function' ||
    // @ts-ignore
    (this.path !== null && typeof this.path === 'object')
  ) {
    (async () => {
      url = url.split('/').pop();
      // @ts-ignore
      const asset = await parseAssetCallback(url, this.path);
      const { minFilter, image } = await loadTextureAsync({ asset });
      texture.image = image;
      texture.needsUpdate = true;
      texture['isDataTexture'] = true; // Forces passing to `gl.texImage2D(...)` verbatim
      texture.minFilter = minFilter; // Pass-through non-power-of-two

      if (onLoad !== undefined) {
        console.warn('loaded tex', texture);
        onLoad(texture);
      }
    })();
  }

  return texture;
}
