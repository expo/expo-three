export declare function loadMtlAsync({ asset, onAssetRequested }: {
    asset: any;
    onAssetRequested: any;
}): Promise<any>;
export declare function loadObjAsync(options: {
    asset: any;
    onAssetRequested?: (...args: any[]) => any;
    onMtlAssetRequested?: (...args: any[]) => any;
    mtlAsset?: any;
    materials?: any;
}): Promise<any>;
export declare function loadDaeAsync({ asset, onAssetRequested, onProgress, }: {
    asset: any;
    onAssetRequested: any;
    onProgress: any;
}): Promise<any>;
export declare function loadArrayBufferAsync({ uri, onProgress }: {
    uri: any;
    onProgress: any;
}): Promise<any>;
