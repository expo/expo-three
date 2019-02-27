import CubeTexture from './CubeTexture';
export default function loadCubeTextureAsync(options: {
    assetForDirection: any;
    directions?: string[];
}): Promise<CubeTexture>;
