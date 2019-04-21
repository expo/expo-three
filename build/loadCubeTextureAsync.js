import CubeTexture from './CubeTexture';
export default async function loadCubeTextureAsync(options) {
    const texture = new CubeTexture();
    await texture.loadAsync(options);
    return texture;
}
//# sourceMappingURL=loadCubeTextureAsync.js.map