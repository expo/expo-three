import loadAsync from './loadAsync';
import THREE from './Three';

export const format = {
  direct_s: ['lf', 'rt', 'up', 'dn', 'ft', 'bk'],
  coord_s: ['px', 'nx', 'py', 'ny', 'pz', 'nz'],
  coord_m: ['xpos', 'xneg', 'ypos', 'yneg', 'zpos', 'zneg'],
};

async function loadCubeTextureAsync({ assetForDirection, directions }) {
  directions = directions || format.coord_s;

  const cubeTexture = new THREE.CubeTexture();
  for (let direction of directions) {
    const asset = await assetForDirection({ direction });
    const texture = await loadAsync(asset);
    cubeTexture.images.push(texture);
  }
  cubeTexture.needsUpdate = true;
  return cubeTexture;
}

export default loadCubeTextureAsync;
