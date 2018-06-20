import React from 'react';
import { View as GraphicsView } from 'expo-graphics';
import TouchableView from '../../components/TouchableView';

function sceneWithExample(example) {
  const Example = example.default;
  const stage = new Example();
  return (
    <TouchableView style={{ flex: 1 }}>
      <GraphicsView {...stage} />
    </TouchableView>
  );
}

export default {
  Amf: () => sceneWithExample(require(`./AmfLoaderExample.js`)),
  Assimp: () => sceneWithExample(require(`./AssimpLoaderExample.js`)),
  //   Babylon: () => sceneWithExample(require(`./BabylonLoaderExample.js`)),
  Bvh: () => sceneWithExample(require(`./BvhLoaderExample.js`)),
  Dae: () => sceneWithExample(require(`./DaeLoaderExample.js`)),
  // DaeRigged: () => sceneWithExample(require(`./DaeRiggedLoaderExample.js`)),
  //   Draco: () => sceneWithExample(require(`./DracoLoaderExample.js`)),
  //   Msgpack: () => sceneWithExample(require(`./MsgpackLoaderExample.js`)),
  Mtl: () => sceneWithExample(require(`./MtlLoaderExample.js`)),
  Obj: () => sceneWithExample(require(`./ObjLoaderExample.js`)),
  PcdBinary: () => sceneWithExample(require(`./PcdBinaryLoaderExample.js`)),
  PlyBinary: () => sceneWithExample(require(`./PlyBinaryLoaderExample.js`)),
  Ply: () => sceneWithExample(require(`./PlyLoaderExample.js`)),
  StlBinary: () => sceneWithExample(require(`./StlBinaryLoaderExample.js`)),
  Stl: () => sceneWithExample(require(`./StlLoaderExample.js`)),
  Tds: () => sceneWithExample(require(`./TdsLoaderExample.js`)),
  Tmf: () => sceneWithExample(require(`./TmfLoaderExample.js`)),
  Vtk: () => sceneWithExample(require(`./VtkLoaderExample.js`)),
  Vtp: () => sceneWithExample(require(`./VtpLoaderExample.js`)),
  VtpNonCompressed: () =>
    sceneWithExample(require(`./VtpNonCompressedLoaderExample.js`)),
  //   X: () => sceneWithExample(require(`./XLoaderExample.js`)),
};
