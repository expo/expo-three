export default function parseAssetCallback(assetName, callbackOrDictionary) {
    if (typeof callbackOrDictionary === 'function') {
        return callbackOrDictionary(assetName);
    }
    else if (callbackOrDictionary !== null &&
        typeof callbackOrDictionary === 'object') {
        if (assetName in callbackOrDictionary) {
            return callbackOrDictionary[assetName];
        }
        throw new Error(`parseAssetCallback: object doesn't contain key: ${assetName}`);
    }
    throw new Error('parseAssetCallback: prop `callbackOrDictionary` must be a function or object');
}
//# sourceMappingURL=parseAssetCallback.js.map