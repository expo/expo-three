import { THREE } from 'expo-three';

import SkyMaterial from '../../Effects/SkyMaterial';
import ThreeStage from '../ThreeStage';

class SkyExample extends ThreeStage {
  async setupModels() {
    await super.setupModels();

    this.scene.add(new THREE.AmbientLight(0xcccccc));
    this.light = new THREE.DirectionalLight(0xffffff, 2);
    this.light.position.set(1, 1, 0.5);
    this.scene.add(this.light);

    let skyMaterial = new SkyMaterial();
    const skyGeo = new THREE.SphereBufferGeometry(14500, 32, 15);
    // Expose variables
    this.mesh = new THREE.Mesh(skyGeo, skyMaterial);
    this.scene.add(this.mesh);

    // Add Sun Helper
    let sunSphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(2000, 16, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    sunSphere.position.y = -700000;
    this.scene.add(sunSphere);

    let effectController = {
      turbidity: 10,
      rayleigh: 2,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.8,
      luminance: 1,
      inclination: 0.49, // elevation / inclination
      azimuth: 0.25, // Facing front,
      sun: true,
    };

    let distance = 400000;
    let uniforms = skyMaterial.uniforms;
    uniforms.turbidity.value = effectController.turbidity;
    uniforms.rayleigh.value = effectController.rayleigh;
    uniforms.luminance.value = effectController.luminance;
    uniforms.mieCoefficient.value = effectController.mieCoefficient;
    uniforms.mieDirectionalG.value = effectController.mieDirectionalG;
    let theta = Math.PI * (effectController.inclination - 0.5);
    let phi = 2 * Math.PI * (effectController.azimuth - 0.5);
    sunSphere.position.x = distance * Math.cos(phi);
    sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
    sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);
    sunSphere.visible = effectController.sun;
    skyMaterial.uniforms.sunPosition.value.copy(sunSphere.position);
  }

  setupScene() {
    super.setupScene();
    this.scene.fog = new THREE.Fog(0xcccccc, 1, 1000);
  }

  setupCamera({ width, height }) {
    this.camera = new THREE.PerspectiveCamera(70, width / height, 1, 20000);
    this.camera.position.z = 400;
  }
}

export default SkyExample;
