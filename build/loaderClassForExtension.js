import { AMFLoader } from 'three/examples/jsm/loaders/AMFLoader';
import { AssimpLoader } from 'three/examples/jsm/loaders/AssimpLoader';
import { BVHLoader } from 'three/examples/jsm/loaders/BVHLoader';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader';
import { XLoader } from 'three/examples/jsm/loaders/XLoader';
function getExtension(uri) {
    const lastUriComponent = uri.split('.').pop();
    return lastUriComponent.split('?')[0].split('#')[0];
}
export function loaderClassForUri(uri) {
    const extension = getExtension(uri);
    return loaderClassForExtension(extension);
}
export function loaderClassForExtension(extension) {
    if (typeof extension !== 'string') {
        throw new Error('Supplied extension is not a valid string');
    }
    switch (extension.toLowerCase()) {
        case '3mf':
            return TTFLoader;
        case 'amf':
            return AMFLoader;
        case 'assimp':
            return AssimpLoader;
        case 'bvh':
            return BVHLoader;
        case 'ctm':
            throw new Error('CTMLoader is deprecated. Please load it manually with three.js');
        case 'fbx':
            return FBXLoader;
        case 'glb':
        case 'gltf':
            return GLTFLoader;
        case 'max':
        case '3ds':
            return TDSLoader;
        case 'pcd':
            return PCDLoader;
        case 'ply':
            return PLYLoader;
        case 'obj':
            return OBJLoader;
        case 'mtl':
            return MTLLoader;
        case 'dae':
            return ColladaLoader;
        case 'stl':
            return STLLoader;
        case 'vtk':
        case 'vtp':
            throw new Error('VRMLoader is deprecated. Please load it manually with three.js');
        case 'x':
            return XLoader;
        // case 'drc':
        //   if (!THREE.DRACOLoader) require('three/examples/js/loaders/draco/DRACOLoader');
        //   return THREE.DRACOLoader;
        default:
            throw new Error('ExpoTHREE.loaderClassForExtension(): Unrecognized file type ' +
                extension);
    }
}
//# sourceMappingURL=loaderClassForExtension.js.map