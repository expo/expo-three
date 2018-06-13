// @flow
import resolveAsset, { stringFromAsset } from './resolveAsset';
import THREE from './Three';
import parseAssetCallback from './loaders/parseAssetCallback';
import readAsStringAsync from './loaders/readAsStringAsync';
import {
  loadDaeAsync,
  loadObjAsync,
  loadMtlAsync,
} from './loaders/loadModelsAsync';

export default (loadAsync = async (res, onProgress, assetProvider) => {
  let urls = await resolveAsset(res);
  if (!urls) {
    console.error(
      `ExpoTHREE.loadAsync: Cannot parse undefined assets. Please pass valid resources for: ${res}.`
    );
    return;
  }
  const asset = urls[0];
  let url = await stringFromAsset(asset);

  if (!url) {
    console.error(
      `ExpoTHREE.loadAsync: OMG, this asset couldn't be downloaded! Open an issue on GitHub...`
    );
  }

  if (urls.length == 1) {
    if (url.match(/\.(jpeg|jpg|gif|png)$/)) {
      return parseTexture(asset);
    } else if (url.match(/\.stl$/i)) {
      if (!THREE.STLLoader) {
        require('three/examples/js/loaders/STLLoader');
      }
      const loader = new THREE.STLLoader();
      return new Promise((res, rej) => loader.load(url, res, onProgress, rej));
    } else if (url.match(/\.pcd$/i)) {
      if (!THREE.PCDLoader) {
        require('three/examples/js/loaders/PCDLoader');
      }
      const loader = new THREE.PCDLoader();
      return new Promise((res, rej) => loader.load(url, res, onProgress, rej));
    } else if (url.match(/\.(vtk|vtp)$/)) {
      //  else if (url.match(/\.3mf$/i)) {
      //   require('three/examples/js/loaders/3MFLoader');
      //   const loader = new THREE.ThreeMFLoader();
      //   loader.setPath(assetProvider);
      //   return new Promise((res, rej) => loader.load(url, res, onProgress, rej));
      // }
      if (!THREE.VTKLoader) {
        require('three/examples/js/loaders/VTKLoader');
      }
      const loader = new THREE.VTKLoader();
      return new Promise((res, rej) => loader.load(url, res, onProgress, rej));
    } else if (url.match(/\.babylon$/i)) {
      if (!THREE.BabylonLoader) {
        require('three/examples/js/loaders/BabylonLoader');
      }
      const loader = new THREE.BabylonLoader();
      return new Promise((res, rej) => loader.load(url, res, onProgress, rej));
    } else if (url.match(/\.assimp$/i)) {
      if (!THREE.AssimpLoader) {
        require('three/examples/js/loaders/AssimpLoader');
      }
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
      if (!THREE.AMFLoader) {
        require('./loaders/AMFLoader');
      }
      const loader = new THREE.AMFLoader();
      return new Promise((res, rej) => loader.load(url, res, onProgress, rej));
    } else if (url.match(/\.3ds$/i)) {
      if (!THREE.TDSLoader) {
        require('three/examples/js/loaders/TDSLoader');
      }
      const loader = new THREE.TDSLoader();
      loader.setPath && loader.setPath(assetProvider);
      return new Promise((res, rej) => loader.load(url, res, onProgress, rej));
    } else if (url.match(/\.bvh$/i)) {
      if (!THREE.BVHLoader) {
        require('three/examples/js/loaders/BVHLoader');
      }
      const loader = new THREE.BVHLoader();
      loader.setPath && loader.setPath(assetProvider);
      return new Promise((res, rej) => loader.load(url, res, onProgress, rej));
    } else if (url.match(/\.ply$/i)) {
      if (!THREE.PLYLoader) {
        require('three/examples/js/loaders/PLYLoader');
      }
      const loader = new THREE.PLYLoader();
      return new Promise((res, rej) => loader.load(url, res, onProgress, rej));
    } else if (url.match(/\.dae$/i)) {
      return loadDaeAsync({
        asset: url,
        onProgress,
        onAssetRequested: assetProvider,
      });
    } else if (url.match(/\.x$/i)) {
      if (!THREE.XLoader) {
        require('three/examples/js/loaders/XLoader');
      }

      const texLoader = {
        path: assetProvider,
        load: loadTexture,
      };
      const loader = new THREE.XLoader(undefined, texLoader);
      return new Promise((res, rej) =>
        loader.load([url, false], res, onProgress, rej)
      );
    } else if (url.match(/\.json$/i)) {
      console.error(
        "loadAsync: Please use ExpoTHREE.parseAsync({json}) instead 😅 json can be loaded in lots of different ways, also I'm not even sure how you passed a .json file here as it shouldn't be loaded as an Expo.Asset!"
      );
      return;
    } else if (url.match(/\.obj$/i)) {
      return loadObjAsync({ asset: url, onAssetRequested: assetProvider });
    } else if (url.match(/\.mtl$/i)) {
      return loadMtlAsync({ asset: url, onAssetRequested: assetProvider });
    }
    //  else if (url.match(/\.drc$/i)) {
    //   require('three/examples/js/loaders/draco/DRACOLoader');
    //   const loader = new THREE.DRACOLoader();
    //   loader.setPath(assetProvider);
    //   return new Promise((res, rej) => loader.load(url, res, onProgress, rej));
    // }
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

const loadOBJMTL = async (
  objLocalUri: string,
  mtlLocalUri: string,
  onProgress,
  assetProvider
) => {
  return loadObjAsync({
    asset: objLocalUri,
    mtlAsset: mtlLocalUri,
    onAssetRequested: assetProvider,
  });
};

const loadJsonFile = async (localUri: string) => {
  const fileContents = await readAsStringAsync(localUri);

  const json = JSON.parse(fileContents);
  return json;
};

const loadTexture = function(url, onLoad, onProgress, onError) {
  const texture = new THREE.Texture();
  if (
    typeof this.path === 'function' ||
    (this.path !== null && typeof this.path === 'object')
  ) {
    (async () => {
      url = url.split('/').pop();
      const asset = await parseAssetCallback(url, this.path);
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

/*
  **Super Hack:**
  Override Texture Loader to use the `path` component as a callback to get resources or Expo `Asset`s
*/

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
