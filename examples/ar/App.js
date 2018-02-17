import ExpoGraphics from 'expo-graphics';
import ExpoTHREE, { THREE } from 'expo-three';
import React from 'react';
import { Platform } from 'react-native';
import * as ARUtils from './ar-utils';
import TouchableView from './TouchableView';

export default class App extends React.Component {
  touch = new THREE.Vector2();
  raycaster = new THREE.Raycaster();

  updateTouch = ({ x, y }) => {
    const { width, height } = this.scene.size;
    this.touch.x = x / width * 2 - 1;
    this.touch.y = -(y / height) * 2 + 1;

    this.runHitTest();
  };

  runHitTest = () => {
    this.raycaster.setFromCamera(this.touch, this.camera);
    const intersects = this.raycaster.intersectObjects(this.planes.children);
    for (const intersect of intersects) {
      const { distance, face, faceIndex, object, point, uv } = intersect;
      this.sphere.position.set(point.x, point.y, point.z);
      this.sphere.visible = true;
    }
  };

  componentWillMount() {
    THREE.suppressExpoWarnings(true);
  }
  componentWillUnmount() {
    THREE.suppressExpoWarnings(false);
  }
  onShouldReloadContext = () => {
    /// The Android OS loses gl context on background, so we should reload it.
    return Platform.OS === 'android';
  };

  render() {
    // Create an `ExpoGraphics.GLView` covering the whole screen, tell it to call our
    // `onContextCreate` function once it's initialized.
    return (
      <TouchableView
        style={{ flex: 1 }}
        onTouchesBegan={({ locationX, locationY }) =>
          this.updateTouch({ x: locationX, y: locationY })
        }
        onTouchesMoved={({ locationX, locationY }) =>
          this.updateTouch({ x: locationX, y: locationY })
        }
        onTouchesEnded={() => (this.sphere.visible = false)}>
        <ExpoGraphics.View
          onShouldReloadContext={this.onShouldReloadContext}
          onContextCreate={this.onContextCreate}
          onRender={this.onRender}
          onResize={this.onResize}
          arEnabled
        />
      </TouchableView>
    );
  }

  onContextCreate = async ({ gl, canvas, width, height, scale, arSession }) => {
    if (!arSession) {
      // oh no, something bad happened!
      return;
    }
    this.arSession = arSession;
    /// Enable ARKit light estimation
    ExpoTHREE.setIsLightEstimationEnabled(arSession, true);

    ExpoTHREE.setIsPlaneDetectionEnabled(arSession, true);

    this.renderer = ExpoTHREE.createRenderer({ gl, canvas });
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000, 1.0);

    this.scene = new THREE.Scene();
    this.scene.background = ExpoTHREE.createARBackgroundTexture(arSession, this.renderer);
    this.scene.size = { width, height };
    this.camera = ExpoTHREE.createARCamera(arSession, width, height, 0.01, 1000);

    this.setupLights();

    this.setupARUtils();
    this.setupBall();
  };

  setupARUtils = () => {
    this.points = new ARUtils.Points();
    this.scene.add(this.points);
    this.planes = new ARUtils.Planes();
    this.scene.add(this.planes);
    this.light = new ARUtils.Light(0x222222);
    this.scene.add(this.light);
  };

  setupLights = () => {
    this.light = new THREE.DirectionalLight(0x002288);
    this.light.position.set(-1, -1, -1);
    this.scene.add(this.light);
  };

  setupBall = () => {
    const inch = 0.0254;
    var geometry = new THREE.SphereBufferGeometry(inch * 3, 32, 32);
    var material = new THREE.MeshPhongMaterial({ color: 0xff00ff });
    var sphere = new THREE.Mesh(geometry, material);
    sphere.visible = false;
    this.scene.add(sphere);
    this.sphere = sphere;
  };

  onResize = ({ width, height, scale }) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  onRender = () => {
    if (this.arSession) {
      this.points.updateWithSession(this.arSession);
      this.planes.updateWithSession(this.arSession);
      this.light.updateWithSession(this.arSession);
    }

    this.renderer.render(this.scene, this.camera);
  };
}
