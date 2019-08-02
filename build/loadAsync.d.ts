import { ProgressCallback } from './loading.types';
import './polyfillTextureLoader.fx';
export declare function loadBasicModelAsync(options: {
    uri: string;
    onProgress?: ProgressCallback;
    onAssetRequested: any;
    loader?: any;
    LoaderClass: any;
}): Promise<unknown>;
export default function loadAsync(res: any, onProgress?: ProgressCallback, onAssetRequested?: () => void): Promise<any>;
