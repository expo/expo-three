import sceneWithExample from '../sceneWithExample';

export default {
  Anaglyph: sceneWithExample(require(`./AnaglyphExample`)),
  Glitch: sceneWithExample(require(`./GlitchExample`)),
  ParallaxBarrier: sceneWithExample(require('./ParallaxBarrierExample')),
  VirtualBoy: sceneWithExample(require('./VirtualBoyExample')),
  Vignette: sceneWithExample(require('./VignetteExample')),
};
