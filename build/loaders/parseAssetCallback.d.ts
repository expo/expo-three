declare type AnyFunction = (...args: any[]) => any;
declare type AnyObject = {
    [key: string]: any;
};
export default function parseAssetCallback(assetName: string, callbackOrDictionary: AnyFunction | AnyObject): any;
export {};
