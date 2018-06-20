import AR from './AR';
import Simple from './Simple';
import Loaders from './Loaders';
import Effects from './Effects';
import Legacy from './Legacy';
import CubeTexture from './CubeTexture';
import Shaders from './Shaders';

import React from 'react';

import MarkdownView from '../components/MarkdownView';

export default {
  // AR,
  README: () => <MarkdownView asset={require('../README.md')} />,
  Loaders,
  Effects,
  Shaders,
  Simple,
  Legacy,
  CubeTexture,
};
