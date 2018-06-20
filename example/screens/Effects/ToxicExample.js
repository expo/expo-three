import { View as GraphicsView } from 'expo-graphics';
import ExpoTHREE from 'expo-three';
import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

const ToxicTypes = {
  buzzed: 'buzzed',
  drunk: 'drunk',
  high: 'high',
  wasted: 'wasted',
};
class App extends React.Component {
  selectedToxin = ToxicTypes.drunk;
  _renderSelector = () => (
    <View
      style={{
        position: 'absolute',
        flexDirection: 'row',
        bottom: 8,
        left: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 4,
        borderColor: 'white',
        borderWidth: StyleSheet.hairlineWidth,
      }}>
      {Object.keys(ToxicTypes).map((toxin, index) => {
        return (
          <View key={index} style={{ flex: 1 }}>
            <TouchableHighlight
              style={{
                flex: 1,
                padding: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={_ => this._setToxin(toxin)}>
              <Text
                style={{ color: 'white', fontSize: 12, textAlign: 'center' }}>
                {toxin}
              </Text>
            </TouchableHighlight>
          </View>
        );
      })}
    </View>
  );

  _setToxin = toxin => {
    if (this.selectedToxin === toxin) {
      return;
    }
    this.selectedToxin = toxin;
    this.toxicPasses.setPreset && this.toxicPasses.setPreset(toxin);
  };

  shouldComponentUpdate = () => false;

  render() {
    return (
      <View style={{ flex: 1 }}>
        <GraphicsView
          style={{ flex: 2 }}
          onContextCreate={this.onContextCreate}
          onRender={this.onRender}
          onResize={this.onResize}
          isArEnabled
          isArRunningStateEnabled
          isArCameraStateEnabled
          arTrackingConfiguration={AR.TrackingConfigurations.World}
        />
        {this._renderSelector()}
      </View>
    );
  }

  onContextCreate = props => {
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);
    this.commonSetup(props);
  };

  commonSetup = ({ gl, scale: pixelRatio, width, height }) => {
    require('three/examples/js/postprocessing/EffectComposer');
    require('three/examples/js/postprocessing/RenderPass');
    require('three/examples/js/postprocessing/ShaderPass');
    require('three/examples/js/postprocessing/MaskPass');
    require('three/examples/js/postprocessing/GlitchPass');
    require('three/examples/js/postprocessing/BloomPass');
    require('three/examples/js/postprocessing/FilmPass');
    require('three/examples/js/shaders/CopyShader');
    require('three/examples/js/shaders/ColorCorrectionShader');
    require('three/examples/js/shaders/VignetteShader');
    require('three/examples/js/shaders/DigitalGlitch');

    this.renderer = new ExpoTHREE.Renderer({
      gl,
      pixelRatio,
      width,
      height,
    });

    this.scene = new THREE.Scene();
    this.scene.background = new ThreeAR.BackgroundTexture(this.renderer);
    this.camera = new ThreeAR.Camera(width, height, 0.01, 1000);

    this._setupScene(width, height);
  };

  _setupScene = (width, height) => {
    // Initialize Three.JS

    // effect
    this.effect = new THREE.EffectComposer(this.renderer);
    this.renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.copyPass = new THREE.ShaderPass(THREE.CopyShader);
    this.effect.addPass(this.renderPass);

    this.toxicPasses = new Toxic.Passes(this.selectedToxin);

    this.effect = new THREE.EffectComposer(this.renderer);
    var renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.effect.addPass(renderPass);
    // add toxicPasses to effect
    this.toxicPasses.addPassesTo(this.effect);
    this.effect.passes[this.effect.passes.length - 1].renderToScreen = true;
  };

  onResize = ({ x, y, scale, width, height }) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  onRender = delta => {
    const now = Date.now();
    this.toxicPasses.update(delta, now);
    this.effect.render(delta);
  };
}

// Wrap Touches Event Listener
export default App;
