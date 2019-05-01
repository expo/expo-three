import { ProgressCallback } from './loading.types';
export declare function loadBasicModelAsync(options: {
    uri: string;
    onProgress?: ProgressCallback;
    onAssetRequested: any;
    loader?: any;
    LoaderClass: any;
}): Promise<{}>;
export default function loadAsync(res: any, onProgress?: ProgressCallback, onAssetRequested?: () => void): Promise<any>;
