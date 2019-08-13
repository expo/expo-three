import THREE from './Three';
export default class ExpoTextureLoader extends THREE.TextureLoader {
    load(asset: any, onLoad?: (texture: THREE.Texture) => void, onProgress?: (event: ProgressEvent) => void, onError?: (event: ErrorEvent) => void): THREE.Texture;
}
