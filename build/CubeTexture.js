import THREE from './Three';
import loadAsync from './loadAsync';
import parseAssetCallback from './loaders/parseAssetCallback';
export default class CubeTexture extends THREE.CubeTexture {
    constructor() {
        super(...arguments);
        this.loadAsync = async (options) => {
            const nextDirections = options.directions || CubeTexture.format.coord_s;
            for (let direction of nextDirections) {
                const asset = await parseAssetCallback(direction, options.assetForDirection);
                const texture = await loadAsync(asset);
                this.images.push(texture);
            }
            this.needsUpdate = true;
        };
    }
}
CubeTexture.format = {
    direct_s: ['lf', 'rt', 'up', 'dn', 'ft', 'bk'],
    coord_s: ['px', 'nx', 'py', 'ny', 'pz', 'nz'],
    coord_m: ['xpos', 'xneg', 'ypos', 'yneg', 'zpos', 'zneg'],
};
//# sourceMappingURL=CubeTexture.js.map