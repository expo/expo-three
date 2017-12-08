// @flow
import Expo from 'expo';

import resolveAsset from './resolveAsset';
import THREE from './Three';

/*
  **Super Hack:**
  Override Texture Loader to use the `path` component as a callback to get resources or Expo `Asset`s
*/

async function stringFromAsset(asset): string {
  let url: string;
  if (asset instanceof Expo.Asset) {
    if (!asset.localUri) {
      await asset.downloadAsync();
    }
    url = asset.localUri;
  } else if (typeof asset === 'string') {
    url = asset;
  }
  return url;
}

export default (loadAsync = async (res, onProgress, assetProvider) => {
  let urls = await resolveAsset(res);
  const asset = urls[0];
  let url = await stringFromAsset(asset);

  if (urls.length == 1) {
    if (url.match(/\.(jpeg|jpg|gif|png)$/)) {
      return parseTexture(asset);
    } else if (url.match(/\.stl$/i)) {
      require('three/examples/js/loaders/STLLoader');
      const loader = new THREE.STLLoader();
      return new Promise((res, rej) => loader.load(url, res, onProgress, rej));
    } else if (url.match(/\.pcd$/i)) {
      require('three/examples/js/loaders/PCDLoader');
      const loader = new THREE.PCDLoader();
      return new Promise((res, rej) => loader.load(url, res, onProgress, rej));
    } else if (url.match(/\.3mf$/i)) {
      require('three/examples/js/loaders/3MFLoader');
      const loader = new THREE.ThreeMFLoader();
      loader.setPath(assetProvider);
      return new Promise((res, rej) => loader.load(url, res, onProgress, rej));
    } else if (url.match(/\.(vtk|vtp)$/)) {
      require('three/examples/js/loaders/VTKLoader');
      const loader = new THREE.VTKLoader();
      return new Promise((res, rej) => loader.load(url, res, onProgress, rej));
    } else if (url.match(/\.babylon$/i)) {
      require('three/examples/js/loaders/BabylonLoader');
      const loader = new THREE.BabylonLoader();
      return new Promise((res, rej) => loader.load(url, res, onProgress, rej));
    } else if (url.match(/\.assimp$/i)) {
      require('three/examples/js/loaders/AssimpLoader');
      const fileLoader = new THREE.FileLoader();
      fileLoader.setResponseType('arraybuffer');
      return new Promise((res, rej) =>
        fileLoader.load(
          url,
          buffer => {
            const loader = new THREE.AssimpLoader();
            res(loader.parse(buffer, assetProvider));
          },
          onProgress,
          rej
        )
      );
    } else if (url.match(/\.amf$/i)) {
      require('./loaders/AMFLoader');
      const loader = new THREE.AMFLoader();
      return new Promise((res, rej) => loader.load(url, res, onProgress, rej));
    } else if (url.match(/\.3ds$/i)) {
      require('three/examples/js/loaders/TDSLoader');
      const loader = new THREE.TDSLoader();
      loader.setPath(assetProvider);
      return new Promise((res, rej) => loader.load(url, res, onProgress, rej));
    } else if (url.match(/\.bvh$/i)) {
      require('three/examples/js/loaders/BVHLoader');
      const loader = new THREE.BVHLoader();
      loader.setPath(assetProvider);
      return new Promise((res, rej) => loader.load(url, res, onProgress, rej));
    } else if (url.match(/\.ply$/i)) {
      require('three/examples/js/loaders/PLYLoader');
      const loader = new THREE.PLYLoader();
      return new Promise((res, rej) => loader.load(url, res, onProgress, rej));
    } else if (url.match(/\.dae$/i)) {
      require('three/examples/js/loaders/ColladaLoader');
      return new Promise((res, rej) =>
        new THREE.FileLoader().load(
          url,
          text => {
            const loader = new THREE.ColladaLoader();
            res(loader.parse(text, assetProvider));
          },
          onProgress,
          rej
        )
      );
    } else if (url.match(/\.x$/i)) {
      require('three/examples/js/loaders/XLoader');
      const texLoader = {
        path: assetProvider,
        load: loadTexture,
      };
      const loader = new THREE.XLoader(undefined, texLoader);
      return new Promise((res, rej) => loader.load([url, false], res, onProgress, rej));
    } else if (url.match(/\.json$/i)) {
      /// Experimental
      const loader = new THREE.ObjectLoader();
      loader.setTexturePath(assetProvider);
      const file = await loadJsonFile(url);
      const model = loader.parse(file, onProgress);
      return model;
    } else if (url.match(/\.js$/i)) {
      const loader = new THREE.JSONLoader();
      return new Promise((res, rej) =>
        loader.load(
          url,
          (geometry, materials) => {
            if (materials.length > 1) {
              let material = new THREE.MeshFaceMaterial(materials);
            } else {
              let material = materials[0];
            }
            let object3d = new THREE.Mesh(geometry, material);
            res(object3d);
          },
          onProgress,
          rej
        )
      );
    } else if (url.match(/\.obj$/i)) {
      require('three/examples/js/loaders/OBJLoader');
      const loader = new THREE.OBJLoader();
      loader.setPath(assetProvider);
      const file = await loadRawFileAsync(url);
      return loader.parse(file);
    } else if (url.match(/\.mtl$/i)) {
      require('./loaders/MTLLoader');

      const loader = new THREE.MTLLoader();
      loader.setPath(assetProvider);

      const file = await loadRawFileAsync(url);
      return loader.parse(file);
    } else if (url.match(/\.drc$/i)) {
      require('three/examples/js/loaders/draco/DRACOLoader');
      const loader = new THREE.DRACOLoader();
      loader.setPath(assetProvider);
      return new Promise((res, rej) => loader.load(url, res, onProgress, rej));
    }
    console.error('Unrecognized File Type', url);
  } else if (urls.length === 2) {
    let urlB = await stringFromAsset(urls[1]);
    if (url.match(/\.mtl$/i) && urlB.match(/\.obj$/i)) {
      return loadOBJMTL(urlB, url, onProgress, assetProvider);
    } else if (url.match(/\.obj$/i) && urlB.match(/\.mtl$/i)) {
      return loadOBJMTL(url, urlB, onProgress, assetProvider);
    }
    console.error('Unrecognized File Type', url);
  } else {
    console.error('Too many arguments passed', urls);
    return;
  }
});

const loadOBJMTL = async (objLocalUri: string, mtlLocalUri: string, onProgress, assetProvider) => {
  const materials = await loadAsync(mtlLocalUri, onProgress, assetProvider);
  materials.preload();

  require('three/examples/js/loaders/OBJLoader');
  const loader = new THREE.OBJLoader();
  loader.setPath(assetProvider);
  loader.setMaterials(materials);
  const file = await loadRawFileAsync(objLocalUri);
  return loader.parse(file);
};

const loadJsonFile = async (localUri: string) => {
  const fileContents = await loadRawFileAsync(localUri);

  const json = JSON.parse(fileContents);
  return json;
};

const loadRawFileAsync = async (localUri: string): string => {
  console.time('loadAsset');
  console.log('Load local file', localUri);
  let file;
  try {
    file = await Expo.FileSystem.readAsStringAsync(localUri);
  } catch (error) {
    console.log('Error from loadRawFileAsync');
    console.error(error);
  } finally {
    console.timeEnd('loadAsset');
    return file;
  }
};

const loadTexture = function(url, onLoad, onProgress, onError) {
  const texture = new THREE.Texture();
  if (typeof this.path === 'function') {
    (async () => {
      url = url.split('/').pop();
      const asset = await this.path(url);
      const { minFilter, image } = await loadAsync(asset);
      texture.image = image;
      texture.needsUpdate = true;
      texture.isDataTexture = true; // Forces passing to `gl.texImage2D(...)` verbatim
      texture.minFilter = minFilter; // Pass-through non-power-of-two

      if (onLoad !== undefined) {
        console.warn('loaded tex', texture);
        onLoad(texture);
      }
    })();
  }

  return texture;
};

THREE.TextureLoader.prototype.load = loadTexture;

function parseTexture(asset) {
  const texture = new THREE.Texture();
  texture.image = {
    data: asset,
    width: asset.width,
    height: asset.height,
  };
  texture.needsUpdate = true;
  texture.isDataTexture = true; // Forces passing to `gl.texImage2D(...)` verbatim
  texture.minFilter = THREE.LinearFilter; // Pass-through non-power-of-two
  return texture;
}
