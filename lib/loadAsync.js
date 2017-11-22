import THREE from './Three';
import Expo from 'expo';

/*
  **Super Hack:**
  Override Texture Loader to use the `path` component as a callback to get resources or Expo `Asset`s
*/

const loadTexture = function(url, onLoad, onProgress, onError) {
  const texture = new THREE.Texture();
  texture.minFilter = THREE.LinearFilter; // Pass-through non-power-of-two
  (async () => {
    url = url.split('/').pop();

    if (typeof this.path === 'function') {
      let asset = await this.path(url);
      if (!asset || typeof asset === 'string') {
        console.error('Invalid asset provided: ', url, asset);
      }
      if (typeof asset === 'number') {
        asset = Expo.Asset.fromModule(asset);
      }

      if (!asset.localUri) {
        await asset.downloadAsync();
      }
      texture.image = {
        data: asset,
        width: asset.width,
        height: asset.height,
      };
    }

    texture.needsUpdate = true;
    texture.isDataTexture = true; // Forces passing to `gl.texImage2D(...)` verbatim

    if (onLoad !== undefined) {
      onLoad(texture);
    }
  })();

  return texture;
};

THREE.TextureLoader.prototype.load = loadTexture;

export default async (res, onProgress, assetProvider) => {
  let urls;
  // handle arguments polymorphism
  if (typeof res === 'string') {
    urls = [res];
  } else if (typeof res === 'number') {
    this.asset = Expo.Asset.fromModule(res);
    if (!this.asset.localUri) {
      await this.asset.downloadAsync();
    }
    urls = [this.asset.localUri];
  } else {
    urls = res;
  }

  // load per type
  if (urls[0].match(/\.stl$/i) && urls.length === 1) {
    require('three/examples/js/loaders/STLLoader');
    this.loader = new THREE.STLLoader();
    return new Promise((res, rej) => this.loader.load(urls[0], res, onProgress, rej));
  } else if (urls.length === 1 && (urls[0].match(/\.png$/i) || urls[0].match(/\.jpg$/i))) {
    const { asset } = this;

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
  } else if (urls[0].match(/\.pcd$/i) && urls.length === 1) {
    require('three/examples/js/loaders/PCDLoader');

    this.loader = new THREE.PCDLoader();
    return new Promise((res, rej) => this.loader.load(urls[0], res, onProgress, rej));
  } else if (urls[0].match(/\.3mf$/i) && urls.length === 1) {
    require('three/examples/js/loaders/3MFLoader');

    this.loader = new THREE.ThreeMFLoader();
    this.loader.setPath(assetProvider);
    return new Promise((res, rej) => this.loader.load(urls[0], res, onProgress, rej));
  } else if ((urls[0].match(/\.vtk$/i) || urls[0].match(/\.vtp$/i)) && urls.length === 1) {
    require('three/examples/js/loaders/VTKLoader');

    this.loader = new THREE.VTKLoader();
    return new Promise((res, rej) => this.loader.load(urls[0], res, onProgress, rej));
  } else if (urls[0].match(/\.drc$/i) && urls.length === 1) {
    require('three/examples/js/loaders/draco/DRACOLoader');
    this.loader = new THREE.DRACOLoader();
    this.loader.setPath(assetProvider);
    return new Promise((res, rej) => this.loader.load(urls[0], res, onProgress, rej));
  } else if (urls[0].match(/\.babylon$/i) && urls.length === 1) {
    require('three/examples/js/loaders/BabylonLoader');
    this.loader = new THREE.BabylonLoader();
    return new Promise((res, rej) => this.loader.load(urls[0], res, onProgress, rej));
  } else if (urls[0].match(/\.assimp$/i) && urls.length === 1) {
    require('../node_modules/three/examples/js/loaders/AssimpLoader.js');

    const _fileLoader = new THREE.FileLoader();
    _fileLoader.setResponseType('arraybuffer');
    return new Promise((res, rej) =>
      _fileLoader.load(
        urls[0],
        buffer => {
          this.loader = new THREE.AssimpLoader();
          res(this.loader.parse(buffer, assetProvider));
        },
        onProgress,
        rej
      )
    );
  } else if (urls[0].match(/\.amf$/i) && urls.length === 1) {
    require('./loaders/AMFLoader');
    this.loader = new THREE.AMFLoader();
    return new Promise((res, rej) => this.loader.load(urls[0], res, onProgress, rej));
  } else if (urls[0].match(/\.3ds$/i) && urls.length === 1) {
    require('three/examples/js/loaders/TDSLoader');
    this.loader = new THREE.TDSLoader();
    this.loader.setPath(assetProvider);
    return new Promise((res, rej) => this.loader.load(urls[0], res, onProgress, rej));
  } else if (urls[0].match(/\.bvh$/i) && urls.length === 1) {
    require('three/examples/js/loaders/BVHLoader');
    this.loader = new THREE.BVHLoader();
    return new Promise((res, rej) => this.loader.load(urls[0], res, onProgress, rej));
  } else if (urls[0].match(/\.ply$/i) && urls.length === 1) {
    require('three/examples/js/loaders/PLYLoader');
    this.loader = new THREE.PLYLoader();
    return new Promise((res, rej) => this.loader.load(urls[0], res, onProgress, rej));
  } else if (urls[0].match(/\.dae$/i) && urls.length === 1) {
    require('three/examples/js/loaders/ColladaLoader');

    return new Promise((res, rej) =>
      new THREE.FileLoader().load(
        urls[0],
        text => {
          this.loader = new THREE.ColladaLoader();
          res(this.loader.parse(text, assetProvider));
        },
        onProgress,
        rej
      )
    );
  } else if (urls[0].match(/\.x$/i) && urls.length === 1) {
    require('three/examples/js/loaders/XLoader');

    const texLoader = {
      path: assetProvider,
      load: loadTexture,
    };
    this.loader = new THREE.XLoader(undefined, texLoader);
    return new Promise((res, rej) => this.loader.load([urls[0], false], res, onProgress, rej));
  } else if (urls[0].match(/\.json$/i) && urls.length === 1) {
    this.loader = new THREE.ObjectLoader();
    return new Promise((res, rej) => this.loader.load(urls[0], res, onProgress, rej));
  } else if (urls[0].match(/\.js$/i) && urls.length === 1) {
    this.loader = new THREE.JSONLoader();
    return new Promise((res, rej) =>
      this.loader.load(
        urls[0],
        (geometry, materials) => {
          if (materials.length > 1) {
            var material = new THREE.MeshFaceMaterial(materials);
          } else {
            var material = materials[0];
          }
          var object3d = new THREE.Mesh(geometry, material);
          res(object3d);
        },
        onProgress,
        rej
      )
    );
  } else if (urls[0].match(/\.obj$/i) && urls.length === 1) {
    require('three/examples/js/loaders/OBJLoader');
    this.loader = new THREE.OBJLoader();
    this.loader.setPath(assetProvider);
    return new Promise((res, rej) => this.loader.load(urls[0], res, onProgress, rej));
  } else if (urls.length === 2 && urls[0].match(/\.mtl$/i) && urls[1].match(/\.obj$/i)) {
    require('three/examples/js/loaders/OBJLoader');
    this.loader = new THREE.OBJLoader();
    this.loader.setPath(assetProvider);
    return new Promise((res, rej) => this.loader.load(urls[1], urls[0], res, onProgress, rej));
  } else if (urls.length === 2 && urls[0].match(/\.obj$/i) && urls[1].match(/\.mtl$/i)) {
    require('three/examples/js/loaders/OBJLoader');
    this.loader = new THREE.OBJLoader();
    this.loader.setPath(assetProvider);
    return new Promise((res, rej) => this.loader.load(urls[0], urls[1], res, onProgress, rej));
  } else {
    console.error('Unrecognized File Type', urls[0].split('.').pop(), urls[0]);
  }
};
