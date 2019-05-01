import { Asset } from 'expo-asset';
export default function resolveAsset(fileReference: any): Promise<Asset[]>;
export declare function stringFromAsset(asset: Asset | string): Promise<string | null>;
