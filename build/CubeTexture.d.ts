import THREE from './Three';
declare type AnyFunction = (...args: any[]) => any;
declare type AnyObject = {
    [key: string]: any;
};
declare type ObjectOrFunction = AnyObject | AnyFunction;
export default class CubeTexture extends THREE.CubeTexture {
    static format: {
        direct_s: string[];
        coord_s: string[];
        coord_m: string[];
    };
    loadAsync: (options: {
        assetForDirection: ObjectOrFunction;
        directions?: string[] | undefined;
    }) => Promise<void>;
}
export {};
