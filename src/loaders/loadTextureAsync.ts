import TextureLoader from '../TextureLoader';

export async function loadTextureAsync({ asset }): Promise<any> {
  return new Promise((resolve, reject) =>
    new TextureLoader().load(asset, resolve, undefined, reject),
  );
}
