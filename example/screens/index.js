import AR from './AR';
import Simple from './Simple';
import Loaders from './Loaders';
import Effects from './Effects';
import Legacy from './Legacy';
import CubeTexture from './CubeTexture';
import Shaders from './Shaders';
import { AR as ExpoAR } from 'expo';

let screens = {
  Loaders,
  Effects,
  Shaders,
  Simple,
  Legacy,
  CubeTexture,
};

if (ExpoAR.isAvailable()) {
  screens['AR'] = AR;
}

module.exports = screens;
