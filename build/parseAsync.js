import { ObjectLoader, BufferGeometryLoader } from 'three';
async function parseWithLoaderAsync({ json, assetProvider, loader, }) {
    loader.setPath && loader.setPath(assetProvider);
    return loader.parse(json, assetProvider);
}
export default async function parseAsync({ json, format, assetProvider, }) {
    if (!format && json.metadata && json.metadata.type) {
        format = json.metadata.type;
    }
    if (!format) {
        throw new Error('ExpoTHREE.parseAsync(): Invalid null format provided');
    }
    switch (format) {
        case 'clara':
        case 'object':
        case 'json':
        case 'blender':
            return parseWithLoaderAsync({
                json,
                assetProvider,
                loader: new ObjectLoader(),
            });
        case 'buffer':
            return parseWithLoaderAsync({
                json,
                assetProvider,
                loader: new BufferGeometryLoader(),
            });
        case 'scene':
        default:
            throw new Error(`ExpoTHREE.parseAsync(): ${format} not supported.`);
    }
}
//# sourceMappingURL=parseAsync.js.map