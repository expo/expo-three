import { AR } from 'expo';
import ExpoTHREE, { THREE, AR as ThreeAR } from 'expo-three';
import React from 'react';

import { View as GraphicsView } from 'expo-graphics';

export default class App extends React.Component {
  render() {
    return (
      <GraphicsView
        style={{ flex: 1 }}
        onContextCreate={this.onContextCreate}
        onRender={this.onRender}
        onResize={this.onResize}
        arTrackingConfiguration={AR.TrackingConfigurations.World}
        isArEnabled
        isArRunningStateEnabled
        isArCameraStateEnabled
      />
    );
  }

  onContextCreate = ({ gl, scale: pixelRatio, width, height }) => {
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);
    this.renderer = new ExpoTHREE.Renderer({ gl, pixelRatio, width, height });

    this.scene = new THREE.Scene();
    this.scene.background = new ThreeAR.BackgroundTexture(this.renderer);
    this.camera = new ThreeAR.Camera(width, height, 0.01, 1000);
    this.planes = new ThreeAR.Planes();
    this.scene.add(this.planes);
  };

  onResize = ({ x, y, scale, width, height }) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  onRender = () => {
    this.planes.update();
    this.renderer.render(this.scene, this.camera);
  };
}
