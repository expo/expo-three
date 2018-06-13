import Expo, { AR } from 'expo';
import ExpoTHREE, { THREE, AR as ThreeAR } from 'expo-three';

import React from 'react';
import { Dimensions, LayoutAnimation, StyleSheet, View } from 'react-native';
import { State, TapGestureHandler } from 'react-native-gesture-handler';

import { View as GraphicsView } from 'expo-graphics';
import SizeText from './SizeText';

const { width, height } = Dimensions.get('window');

function metersToInches(meters) {
  return meters * 39.3700787;
}

export default class App extends React.Component {
  state = {
    distance: 0,
  };

  magneticObject = new ThreeAR.MagneticObject();

  componentDidMount() {
    AR.onDidFailWithError(({ error }) => {
      console.error(error);
    });

    AR.onSessionWasInterrupted(() => {
      console.log('Backgrounded App: Session was interrupted');
    });

    AR.onSessionInterruptionEnded(() => {
      console.log('Foregrounded App: Session is no longer interrupted');
      // TODO: Make sure this doesn't mess with the camera or texture or something
      AR.reset();
      AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);
    });
  }

  onTap = async event => {
    if (event.nativeEvent.state !== State.ACTIVE) {
      return;
    }

    if (this.endNode) {
      // Reset
      this.scene.remove(this.startNode);
      this.startNode = null;
      this.scene.remove(this.endNode);
      this.endNode = null;
      this.setState({ distance: '0.0' });
      this.line.visible = false;
      return;
    }
    this.line.visible = true;

    const { hitTest } = await AR.performHitTest(
      {
        x: 0.5,
        y: 0.5,
      },
      AR.HitTestResultTypes.HorizontalPlane
    );

    if (hitTest.length > 0) {
      const result = hitTest[0];

      let hitPosition = ThreeAR.positionFromTransform(
        ThreeAR.convertTransformArray(result.worldTransform)
      );

      const radius = 0.005;
      const geometry = new THREE.SphereBufferGeometry(radius, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const node = new THREE.Mesh(geometry, material);
      node.position.set(hitPosition.x, hitPosition.y, hitPosition.z);
      this.scene.add(node);

      if (this.startNode) {
        this.endNode = node;
      } else {
        this.startNode = node;
      }
    } else {
      // Create a transform with a translation of 0.1 meters (10 cm) in front of the camera
      const dist = 0.1;
      const translation = new THREE.Vector3(0, 0, -dist);
      translation.applyQuaternion(this.camera.quaternion);

      // Add a node to the session
      const radius = 0.005;
      const geometry = new THREE.SphereBufferGeometry(radius, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const node = new THREE.Mesh(geometry, material);
      node.position.set(translation.x, translation.y, translation.z);
      this.scene.add(node);

      if (this.startNode) {
        this.endNode = node;
      } else {
        this.startNode = node;
      }
    }
  };

  get screenCenter() {
    return new THREE.Vector2(0.5, 0.5);
  }

  render() {
    const { distance } = this.state;
    const config = AR.TrackingConfigurations.World;

    LayoutAnimation.easeInEaseOut();

    return (
      <View style={styles.container}>
        <TapGestureHandler onHandlerStateChange={this.onTap}>
          <View style={styles.container}>
            <GraphicsView
              style={styles.container}
              onContextCreate={this.onContextCreate}
              onRender={this.onRender}
              onResize={this.onResize}
              trackingConfiguration={config}
              arEnabled
            />
          </View>
        </TapGestureHandler>
        <View style={styles.footer}>
          <SizeText>{distance}</SizeText>
        </View>
      </View>
    );
  }

  onContextCreate = async ({ gl, scale: pixelRatio, width, height }) => {
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);

    this.renderer = new ExpoTHREE.Renderer({ gl, width, height, pixelRatio });

    this.scene = new THREE.Scene();
    this.scene.background = new ThreeAR.BackgroundTexture(this.renderer);

    this.camera = new ThreeAR.Camera(width, height, 0.01, 1000);

    this.setupLine();

    this.magneticObject.add(new THREE.GridHelper(0.1, 5, 0xff0000, 0x0000ff));
    this.scene.add(this.magneticObject);
  };

  setupLine = () => {
    const geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3());
    geometry.vertices.push(new THREE.Vector3(1, 1, 1));
    geometry.verticesNeedUpdate = true;
    geometry.dynamic = true;

    this.line = new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({
        color: 0x00ff00,
        opacity: 1,
        linewidth: 7,
        side: THREE.DoubleSide,
        linecap: 'round',
      })
    );
    /// https://stackoverflow.com/questions/36497763/three-js-line-disappears-if-one-point-is-outside-of-the-cameras-view
    this.line.frustumCulled = false; // Avoid flicker
    this.line.visible = false;
    this.scene.add(this.line);
  };

  updateLine = () => {
    if (!this.startNode || !this.line.visible) {
      return;
    }
    this.line.geometry.vertices[0].copy(this.startNode.position);

    if (this.endNode) {
      this.line.geometry.vertices[1].copy(this.endNode.position);
    } else {
      this.line.geometry.vertices[1].copy(this.magneticObject.position);

      const size = metersToInches(
        this.startNode.position.distanceTo(this.magneticObject.position)
      );
      const lessPreciseSize = Math.round(size * 10) / 10;
      this.setState({ distance: lessPreciseSize });
    }

    this.line.geometry.verticesNeedUpdate = true;
  };

  onResize = ({ x, y, scale, width, height }) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  onRender = () => {
    this.magneticObject.update(this.camera, this.screenCenter);

    this.updateLine();

    this.renderer.render(this.scene, this.camera);
  };
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  footer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
