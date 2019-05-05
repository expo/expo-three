declare type Parseable = {
    json: any;
    format?: string;
    onProgress?: (...args: any[]) => any;
    assetProvider: any;
};
export default function parseAsync({ json, format, assetProvider }: Parseable): Promise<any>;
export {};
