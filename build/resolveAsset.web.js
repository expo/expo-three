// Also not implemented
async function resolveAsset(fileReference) {
    let urls = [];
    if (Array.isArray(fileReference)) {
        for (let file of fileReference) {
            urls.push(file);
        }
    }
    else {
        urls.push(fileReference);
    }
    return urls;
}
export async function stringFromAsset(asset) {
    console.warn('ExpoTHREE.stringFromAsset: Not Implemented');
    return '';
}
export default resolveAsset;
//# sourceMappingURL=resolveAsset.web.js.map