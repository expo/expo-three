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
  Lava: () => sceneWithExample(require(`./LavaExample`)),
  Sky: () => sceneWithExample(require('./SkyExample')),
};
