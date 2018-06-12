import { AR } from 'expo';
import ExpoTHREE, { THREE, AR as ThreeAR } from 'expo-three';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Assets from '../../Assets';
import GraphicsView from '../../components/GraphicsView';
import TouchableView from '../../components/TouchableView';

const { width, height } = Dimensions.get('window');

// A good read on lighting: https://threejs.org/examples/#webgl_lights_physical
export default class App extends React.Component {
  magneticObject = new ThreeAR.MagneticObject();

  get screenCenter() {
    return new THREE.Vector2(0.5, 0.5);
  }

  render() {
    return (
      <TouchableView
        style={{ flex: 1 }}
        shouldCancelWhenOutside={false}
        onTouchesBegan={this.onTouchesBegan}>
        <GraphicsView
          style={styles.container}
          onContextCreate={this.onContextCreate}
          onRender={this.onRender}
          onResize={this.onResize}
          trackingConfiguration={AR.TrackingConfigurations.World}
          arEnabled
        />
      </TouchableView>
    );
  }

  onTouchesBegan = () => {
    if (!this.scene) {
      return;
    }
    this._disableLights = !this._disableLights;
    if (this._disableLights) {
      this.scene.remove(this.shadowLight);
    } else {
      this.scene.add(this.shadowLight);
    }
  };

  onContextCreate = async ({ gl, scale: pixelRatio, width, height }) => {
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);

    this.renderer = new ExpoTHREE.Renderer({ gl, width, height, pixelRatio });

    // Enable some realist rendering props: https://threejs.org/docs/#api/renderers/WebGLRenderer.physicallyCorrectLights
    this.renderer.gammaInput = this.renderer.gammaOutput = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    // this.renderer.toneMappingExposure = Math.pow(0.68, 5.0); // to allow for very bright scenes.

    this.scene = new THREE.Scene();
    this.scene.background = new ThreeAR.BackgroundTexture(this.renderer);

    this.camera = new ThreeAR.Camera(width, height, 0.01, 1000);

    // Create ARKit lighting
    this.ambient = new ThreeAR.Light();
    this.ambient.position.y = 2;

    this.mesh = new THREE.Object3D();

    this.scene.add(this.ambient);
    this.shadowLight = this.getShadowLight();
    this.scene.add(this.shadowLight);
    this.scene.add(this.shadowLight.target);
    // this.scene.add(new THREE.DirectionalLightHelper(this.shadowLight));

    this.scene.add(new THREE.AmbientLight(0x404040));

    this.shadowFloor = new ThreeAR.ShadowFloor({
      width: 1,
      height: 1,
      opacity: 0.6,
    });
    this.mesh.add(this.shadowFloor);

    // Don't scale up with distance
    this.magneticObject.maintainScale = false;

    this.magneticObject.add(this.mesh);

    this.scene.add(this.magneticObject);

    await this.loadModel();
  };

  loadModel = async () => {
    const model = await ExpoTHREE.loadAsync(
      Assets.models.collada.stormtrooper['stormtrooper.dae'],
      null,
      name => Assets.models.collada.stormtrooper[name]
    );
    const { scene: mesh, animations } = model;
    mesh.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    mesh.rotation.z = Math.PI;
    mesh.castShadow = true;

    console.log(Object.keys(ExpoTHREE.utils));
    ExpoTHREE.utils.scaleLongestSideToSize(mesh, 0.3);

    this.mixer = new THREE.AnimationMixer(mesh);
    this.mixer.clipAction(animations[0]).play();

    this.mesh.add(mesh);
  };

  onResize = ({ x, y, scale, width, height }) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  onRender = delta => {
    this.magneticObject.update(this.camera, this.screenCenter);

    // this.emissiveIntensity = this.intensity / Math.pow( 0.02, 2.0 ); // convert from intensity to irradiance at bulb surface

    if (this.mixer && this.mesh.visible) {
      this.mixer.update(delta);
    }
    this.ambient.update();

    this.shadowFloor.opacity = this.ambient.intensity;

    this.shadowLight.target.position.copy(this.magneticObject.position);
    this.shadowLight.position.copy(this.shadowLight.target.position);
    this.shadowLight.position.x += 0.1;
    this.shadowLight.position.y += 1;
    this.shadowLight.position.z += 0.1;

    this.renderer.render(this.scene, this.camera);
  };

  getShadowLight = () => {
    let light = new THREE.DirectionalLight(0xffffff, 0.6);

    light.castShadow = true;

    // default is 50
    const shadowSize = 1;
    light.shadow.camera.left = -shadowSize;
    light.shadow.camera.right = shadowSize;
    light.shadow.camera.top = shadowSize;
    light.shadow.camera.bottom = -shadowSize;
    light.shadow.camera.near = 0.001;
    light.shadow.camera.far = 100;
    light.shadow.camera.updateProjectionMatrix();

    // default is 512
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = light.shadow.mapSize.width;

    return light;
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
