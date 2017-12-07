import ExpoGraphics from 'expo-graphics';
import ExpoTHREE, { THREE } from 'expo-three';
import React from 'react';
import { PanResponder, PixelRatio, View } from 'react-native';

export default class App extends React.Component {
  boxGeometry = new THREE.BoxGeometry(0.04, 0.04, 0.04);

  componentWillMount() {
    THREE.suppressExpoWarnings(true);

    const panGrant = (_, gestureState) => {
      const { featurePoints } = ExpoTHREE.getRawFeaturePoints(this.arSession);
      if (featurePoints.length > 0) {
        featurePoints.map(position => this.addBox(position));
      }
    };
    const panRelease = (_, gestureState) => {};
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: panGrant,
      onPanResponderRelease: panRelease,
      onPanResponderTerminate: panRelease,
      onShouldBlockNativeResponder: () => false,
    });
  }
  render() {
    return (
      <View {...this.panResponder.panHandlers} style={{ flex: 1 }}>
        <ExpoGraphics.View
          pointerEvents="none"
          style={{ flex: 1 }}
          onContextCreate={this.onContextCreate}
          onRender={this.onRender}
          onResize={this.onResize}
          arEnabled
        />
      </View>
    );
  }

  onContextCreate = async (gl, arSession) => {
    this.material = new THREE.MeshBasicMaterial({
      map: await ExpoTHREE.loadAsync(require('./assets/icons/app-icon.png')),
    });

    this.arSession = arSession;
    const { drawingBufferWidth, drawingBufferHeight } = gl;
    const scale = PixelRatio.get();

    const width = drawingBufferWidth / scale;
    const height = drawingBufferHeight / scale;

    // renderer
    this.renderer = ExpoTHREE.createRenderer({
      gl,
    });
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000, 1.0);

    /// Standard Camera
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 10000);
    this.camera.position.set(5, 5, -5);
    this.camera.lookAt(0, 0, 0);

    this.scene = new THREE.Scene();
    this.scene.add(new THREE.GridHelper(5, 6, 0xffffff, 0x555555));

    this.setupLights();

    // AR Background Texture
    this.scene.background = ExpoTHREE.createARBackgroundTexture(arSession, this.renderer);

    /// AR Camera
    this.camera = ExpoTHREE.createARCamera(arSession, width, height, 0.01, 1000);

    /// Enable ARKit light estimation
    ExpoTHREE.setIsLightEstimationEnabled(arSession, true);

    /// Enable ARKit plane detection - this will let us get the raw point data
    ExpoTHREE.setIsPlaneDetectionEnabled(arSession, true);
  };

  setupLights = () => {
    this.light = new THREE.DirectionalLight(0x002288);
    this.light.position.set(-1, -1, -1);
    this.scene.add(this.light);

    const light = new THREE.AmbientLight(0x222222);
    this.scene.add(light);
  };

  addBox = async ({ x, y, z, id }) => {
    const cube = new THREE.Mesh(this.boxGeometry, this.material);
    // console.warn(point);
    cube.position.set(x, y, z);
    this.scene.add(cube);
  };

  onResize = ({ width, height }) => {
    const scale = PixelRatio.get();

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  onRender = () => {
    const lightEstimation = ExpoTHREE.getARLightEstimation(this.arSession);
    if (lightEstimation) {
      this.light.intensity = 1 / 2000 * lightEstimation.ambientIntensity;
      // this.light.ambientIntensity = lightEstimation.ambientColorTemperature;
    }

    const { scene, renderer, camera } = this;
    renderer.render(scene, camera);
  };
}
