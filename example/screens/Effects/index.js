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
  Anaglyph: () => sceneWithExample(require(`./AnaglyphExample`)),
  Glitch: () => sceneWithExample(require(`./GlitchExample`)),
  ParallaxBarrier: () => sceneWithExample(require('./ParallaxBarrierExample')),
  VirtualBoy: () => sceneWithExample(require('./VirtualBoyExample')),
  Vignette: () => sceneWithExample(require('./VignetteExample')),
};
