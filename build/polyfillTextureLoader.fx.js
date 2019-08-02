/*
  **Super Hack:**
  Override Texture Loader to use the `path` component as a callback to get resources or Expo `Asset`s
*/
import THREE from './Three';
import { loadTexture } from './loadTexture';
THREE.TextureLoader.prototype.load = loadTexture;
//# sourceMappingURL=polyfillTextureLoader.fx.js.map