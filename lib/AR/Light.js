import { AR } from 'expo';

import THREE from '../Three';

const ct = require('color-temperature');

const ARFrameAttribute = AR.FrameAttribute || AR.FrameAttributes;

class Light extends THREE.PointLight {
  constructor() {
    super(0xffee88, 1, 100, 2);
  }

  _data = {};
  set data(value) {
    if (value === this._data) {
      return;
    }
    this._data = value;
    if (value !== Object(value)) {
      return;
    }

    const { ambientIntensity, ambientColorTemperature } = value;

    this.power = ambientIntensity; // 1000;

    const { red, green, blue } = ct.colorTemperature2rgb(
      ambientColorTemperature
    );
    this.color = new THREE.Color(red / 255.0, green / 255.0, blue / 255.0);
  }

  update = () => {
    const { lightEstimation } = AR.getCurrentFrame({
      [ARFrameAttribute.LightEstimation]: true,
    });
    this.data = lightEstimation;
  };
}

export default Light;
