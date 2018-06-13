import { AR } from 'expo';
import ExpoTHREE, { THREE, AR as ThreeAR } from 'expo-three';
import React from 'react';

import { View as GraphicsView } from 'expo-graphics';
import TouchableView from '../../components/TouchableView';

class HitTest extends React.Component {
  render() {
    const config = AR.TrackingConfigurations.World;

    return (
      <TouchableView
        style={{ flex: 1 }}
        shouldCancelWhenOutside={false}
        onTouchesBegan={this.onTouchesBegan}>
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
      </TouchableView>
    );
  }
  onContextCreate = ({ gl, scale: pixelRatio, width, height }) => {
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);

    this.renderer = new ExpoTHREE.Renderer({ gl, width, height, pixelRatio });

    this.scene = new THREE.Scene();
    this.scene.background = new ThreeAR.BackgroundTexture(this.renderer);
    this.camera = new ThreeAR.Camera(width, height, 0.01, 1000);
  };

  onResize = ({ x, y, scale, width, height }) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  onRender = delta => {
    this.renderer.render(this.scene, this.camera);
  };

  onTouchesBegan = async ({ locationX: x, locationY: y }) => {
    if (!this.renderer) {
      return;
    }

    const size = this.renderer.getSize();
    console.log('touch', { x, y, ...size });

    //const position = ThreeAR.improviseHitTest({x, y}); <- Good for general purpose: "I want a point, I don't care how"
    const { hitTest } = await AR.performHitTest(
      {
        x: x / size.width,
        y: y / size.height,
      },
      AR.HitTestResultTypes.HorizontalPlane
    );

    for (let hit of hitTest) {
      const { worldTransform } = hit;
      if (this.cube) {
        this.scene.remove(this.cube);
      }

      const geometry = new THREE.BoxGeometry(0.0254, 0.0254, 0.0254);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
      });
      this.cube = new THREE.Mesh(geometry, material);
      this.scene.add(this.cube);

      this.cube.matrixAutoUpdate = false;

      const matrix = new THREE.Matrix4();
      matrix.fromArray(worldTransform);

      this.cube.applyMatrix(matrix);
      this.cube.updateMatrix();
    }
  };
}
export default HitTest;
