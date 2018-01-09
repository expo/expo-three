import ExpoGraphics from 'expo-graphics';
import ExpoTHREE, { THREE } from 'expo-three';
import React from 'react';
import { PixelRatio } from 'react-native';


export default class App extends React.Component {
  render() {
    return (
        <ExpoGraphics.View
          style={{ flex: 1 }}
          onContextCreate={this.onContextCreate}
          onRender={this.onRender}
          onResize={this.onResize}
        />
    );
  }

  onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const scale = PixelRatio.get();

    // renderer
    this.renderer = ExpoTHREE.createRenderer({
      gl,
    });
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width / scale, height / scale);
    this.renderer.setClearColor(0x000000, 1.0);

    /// Standard Camera
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 10000);
    this.camera.position.set(5, 5, -5);
    this.camera.lookAt(0, 0, 0);

    await this.setupSceneAsync();
  };

  setupSceneAsync = async () => {
    // scene
    this.scene = new THREE.Scene();

    // Standard Background
    this.scene.background = new THREE.Color(0x999999);
    this.scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

    this.scene.add(new THREE.GridHelper(5, 6, 0xffffff, 0x555555));

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      // NOTE: How to create an Expo-compatible THREE texture
      map: await ExpoTHREE.loadAsync(require('./assets/icons/app-icon.png')),
    });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    this.setupLights();
  };

  setupLights = () => {
    // lights
    const directionalLightA = new THREE.DirectionalLight(0xffffff);
    directionalLightA.position.set(1, 1, 1);
    this.scene.add(directionalLightA);

    const directionalLightB = new THREE.DirectionalLight(0xffeedd);
    directionalLightB.position.set(-1, -1, -1);
    this.scene.add(directionalLightB);

    const ambientLight = new THREE.AmbientLight(0x222222);
    this.scene.add(ambientLight);
  };

  onResize = ({ width, height }) => {
    const scale = PixelRatio.get();

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  onRender = (delta) => {
    this.cube.rotation.x += 0.7 * delta;
    this.cube.rotation.y += 0.4 * delta;


    const { scene, renderer, camera } = this;
    renderer.render(scene, camera);
  };
}

