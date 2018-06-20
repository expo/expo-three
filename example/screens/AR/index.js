import arSceneWithExample from './arSceneWithExample';
import { AR } from 'expo';
import Settings from '../../constants/Settings';

let screens = {
  Basic: arSceneWithExample(require(`./Basic`)),
  Measure: arSceneWithExample(require(`./Measure`)),
  HitTest: arSceneWithExample(require(`./HitTest`)),
  Points: arSceneWithExample(require(`./Points`)),
  Planes: arSceneWithExample(require(`./Planes`)),
  // RawData: arSceneWithExample(require(`./RawData`)),
};

if (AR.isFrontCameraAvailable()) {
  screens['Face'] = arSceneWithExample(require(`./Face`));
}

if (!Settings.isInAppleReview) {
  screens['Model'] = arSceneWithExample(require(`./Model`));
  screens['Image'] = arSceneWithExample(require(`./Image`));
}

module.exports = screens;
