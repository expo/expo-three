import THREE from './Three';

function getExtension(uri: string): string {
  const lastUriComponent = uri.split('.').pop() as string;
  return lastUriComponent.split('?')[0].split('#')[0];
}

export function loaderClassForUri(uri: string): string {
  const extension = getExtension(uri);
  return loaderClassForExtension(extension);
}

export function loaderClassForExtension(extension: string): any {
  if (typeof extension !== 'string') {
    throw new Error('Supplied extension is not a valid string');
  }
  switch (extension.toLowerCase()) {
    case '3mf': {
      const loaderName = 'ThreeMFLoader';
      if (!THREE[loaderName]) {
        try {
          require('three/examples/js/loaders/3MFLoader');
        } catch (_) {}
      }
      return THREE[loaderName];
    }
    case 'amf': {
      const loaderName = 'AMFLoader';
      if (!THREE[loaderName]) {
        try {
          require('./loaders/AMFLoader');
        } catch (_) {}
      }
      return THREE[loaderName];
    }
    case 'assimp': {
      const loaderName = 'AssimpLoader';
      if (!THREE[loaderName]) {
        try {
          require('three/examples/js/loaders/AssimpLoader');
        } catch (_) {}
      }
      return THREE[loaderName];
    }
    case 'bvh': {
      const loaderName = 'BVHLoader';

      if (!THREE[loaderName]) {
        try {
          require('three/examples/js/loaders/BVHLoader');
        } catch (_) {}
      }
      return THREE[loaderName];
    }
    case 'ctm':
      throw new Error(
        'CTMLoader is deprecated. Please load it manually with three.js',
      );
    case 'fbx':
      // @ts-ignore
      if (!THREE.FBXLoader) {
        try {
          require('three/examples/js/libs/inflate.min');
          require('three/examples/js/loaders/FBXLoader');
        } catch (_) {}
      }
      // @ts-ignore
      return THREE.FBXLoader;
    case 'glb':
    case 'gltf':
      // @ts-ignore
      if (!THREE.GLTFLoader) {
        try {
          require('three/examples/js/loaders/GLTFLoader');
        } catch (_) {}
      }
      // @ts-ignore
      return THREE.GLTFLoader;
    case 'max':
    case '3ds':
      // @ts-ignore
      if (!THREE.TDSLoader) {
        try {
          require('three/examples/js/loaders/TDSLoader');
        } catch (_) {}
      }
      // @ts-ignore
      return THREE.TDSLoader;
    case 'pcd': {
      const loaderName = 'PCDLoader';
      if (!THREE[loaderName]) {
        try {
          require('three/examples/js/loaders/PCDLoader');
        } catch (_) {}
      }
      return THREE[loaderName];
    }
    case 'ply': {
      const loaderName = 'PLYLoader';
      if (!THREE[loaderName]) {
        try {
          require('three/examples/js/loaders/PLYLoader');
        } catch (_) {}
      }
      return THREE[loaderName];
    }
    case 'obj':
      // @ts-ignore
      if (!THREE.OBJLoader) {
        try {
          require('three/examples/js/loaders/OBJLoader');
        } catch (_) {}
      }
      // @ts-ignore
      return THREE.OBJLoader;
    case 'mtl':
      // @ts-ignore
      if (!THREE.MTLLoader) {
        try {
          require('three/examples/js/loaders/MTLLoader');
        } catch (_) {}
      }
      // @ts-ignore
      return THREE.MTLLoader;
    case 'dae':
      // @ts-ignore
      if (!THREE.ColladaLoader) {
        try {
          require('three/examples/js/loaders/ColladaLoader');
        } catch (_) {}
      }
      // @ts-ignore
      return THREE.ColladaLoader;
    case 'stl':
      // @ts-ignore
      if (!THREE.STLLoader) {
        try {
          require('three/examples/js/loaders/STLLoader');
        } catch (_) {}
      }
      // @ts-ignore
      return THREE.STLLoader;
    case 'vtk':
    case 'vtp': {
      const loaderName = 'VTKLoader';
      if (!THREE[loaderName]) {
        try {
          require('three/examples/js/loaders/VTKLoader');
        } catch (_) {}
      }
      return THREE[loaderName];
    }
    case 'x': {
      const loaderName = 'XLoader';
      if (!THREE[loaderName]) {
        try {
          require('three/examples/js/loaders/XLoader');
        } catch (_) {}
      }
      return THREE[loaderName];
    }
    // case 'drc':
    //   if (!THREE.DRACOLoader) require('three/examples/js/loaders/draco/DRACOLoader');
    //   return THREE.DRACOLoader;
    default:
      throw new Error(
        'ExpoTHREE.loaderClassForExtension(): Unrecognized file type ' +
          extension,
      );
  }
}
