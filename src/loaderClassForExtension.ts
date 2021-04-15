import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

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
    case 'glb':
    case 'gltf':
      return GLTFLoader;
    case 'obj':
      return OBJLoader;
    case 'mtl':
      return MTLLoader;
    case 'dae':
      return ColladaLoader;
    default:
      throw new Error(
        'ExpoTHREE.loaderClassForExtension(): Unrecognized file type ' +
          extension
      );
  }
}
