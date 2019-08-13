import TextureLoader from '../TextureLoader';
export async function loadTextureAsync({ asset }) {
    return new Promise((resolve, reject) => new TextureLoader().load(asset, resolve, undefined, reject));
}
//# sourceMappingURL=loadTextureAsync.js.map