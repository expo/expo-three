import ExpoTHREE, { THREE } from 'expo-three'; // 2.2.2-alpha.1

class Light extends THREE.AmbientLight {
  updateWithSession = arSession => {
    const lightEstimation = ExpoTHREE.getARLightEstimation(arSession);
    if (lightEstimation) {
      this.intensity = 1 / 2000 * lightEstimation.ambientIntensity;
      // this.light.ambientIntensity = lightEstimation.ambientColorTemperature;
    }
  };
}

export default Light;
