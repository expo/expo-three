import CubeTexture from './CubeTexture';

export default async function loadCubeTextureAsync(options: {
  assetForDirection;
  directions?: string[];
}): Promise<CubeTexture> {
  const texture = new CubeTexture();
  await texture.loadAsync(options);
  return texture;
}
