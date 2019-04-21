import * as THREE from 'three';
// global.THREE = global.THREE || THREE;
export default async function loadAsync(res) {
    let nextRes = res;
    if (typeof res === 'object' && res !== null && res.downloadAsync) {
        nextRes = res.localUri || res.uri;
    }
    if (nextRes.match(/\.(jpeg|jpg|gif|png)$/)) {
        return parseTexture(nextRes);
    }
    else if (nextRes.match(/\.obj$/i)) {
        if (!THREE.OBJLoader) {
            require('three/examples/js/loaders/OBJLoader');
        }
        const loader = new THREE.OBJLoader();
        return await new Promise((resolve, reject) => loader.load(nextRes, resolve, () => { }, reject));
    }
    else {
        throw new Error('unsupported file type' + nextRes);
    }
}
async function parseTexture(asset) {
    return new THREE.TextureLoader().load(asset);
}
//# sourceMappingURL=loadAsync.web.js.map