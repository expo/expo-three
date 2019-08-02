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
        require('three/examples/js/loaders/3MFLoader');
      }
      return THREE[loaderName];
    }
    case 'amf': {
      const loaderName = 'AMFLoader';
      if (!THREE[loaderName]) {
        require('./loaders/AMFLoader');
      }
      return THREE[loaderName];
    }
    case 'assimp': {
      const loaderName = 'AssimpLoader';
      if (!THREE[loaderName]) {
        require('three/examples/js/loaders/AssimpLoader');
      }
      return THREE[loaderName];
    }
    case 'awd':
      // @ts-ignore
      if (!THREE.AWDLoader) {
        require('three/examples/js/loaders/AWDLoader');
      }
      // @ts-ignore
      return THREE.AWDLoader;
    case 'babylon': {
      const loaderName = 'BabylonLoader';
      if (!THREE[loaderName]) {
        require('three/examples/js/loaders/BabylonLoader');
      }
      return THREE[loaderName];
    }
    case 'bvh': {
      const loaderName = 'BVHLoader';

      if (!THREE[loaderName]) {
        require('three/examples/js/loaders/BVHLoader');
      }
      return THREE[loaderName];
    }
    case 'ctm':
      // @ts-ignore
      if (!THREE.CTMLoader) {
        require('three/examples/js/loaders/ctm/lzma');
        require('three/examples/js/loaders/ctm/ctm');
        require('three/examples/js/loaders/ctm/CTMLoader');
      }
      // @ts-ignore
      return THREE.CTMLoader;
    case 'fbx':
      // @ts-ignore
      if (!THREE.FBXLoader) {
        require('three/examples/js/libs/inflate.min');
        require('three/examples/js/loaders/FBXLoader');
      }
      // @ts-ignore
      return THREE.FBXLoader;
    case 'glb':
    case 'gltf':
      // @ts-ignore
      if (!THREE.GLTFLoader) require('three/examples/js/loaders/GLTFLoader');
      // @ts-ignore
      return THREE.GLTFLoader;
    case 'max':
    case '3ds':
      // @ts-ignore
      if (!THREE.TDSLoader) require('three/examples/js/loaders/TDSLoader');
      // @ts-ignore
      return THREE.TDSLoader;
    case 'pcd': {
      const loaderName = 'PCDLoader';
      if (!THREE[loaderName]) {
        require('three/examples/js/loaders/PCDLoader');
      }
      return THREE[loaderName];
    }
    case 'ply': {
      const loaderName = 'PLYLoader';
      if (!THREE[loaderName]) {
        require('three/examples/js/loaders/PLYLoader');
      }
      return THREE[loaderName];
    }
    case 'obj':
      // @ts-ignore
      if (!THREE.OBJLoader) require('three/examples/js/loaders/OBJLoader');
      // @ts-ignore
      return THREE.OBJLoader;
    case 'mtl':
      // @ts-ignore
      if (!THREE.MTLLoader) require('three/examples/js/loaders/MTLLoader');
      // @ts-ignore
      return THREE.MTLLoader;
    case 'dae':
      // @ts-ignore
      if (!THREE.ColladaLoader)
        require('three/examples/js/loaders/ColladaLoader');
      // @ts-ignore
      return THREE.ColladaLoader;
    case 'stl':
      // @ts-ignore
      if (!THREE.STLLoader) require('three/examples/js/loaders/STLLoader');
      // @ts-ignore
      return THREE.STLLoader;
    case 'vtk':
    case 'vtp': {
      const loaderName = 'VTKLoader';
      if (!THREE[loaderName]) {
        require('three/examples/js/loaders/VTKLoader');
      }
      return THREE[loaderName];
    }
    case 'x': {
      const loaderName = 'XLoader';
      if (!THREE[loaderName]) {
        require('three/examples/js/loaders/XLoader');
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
