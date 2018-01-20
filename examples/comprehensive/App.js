import React from 'react';
import { StackNavigator } from 'react-navigation';

import Page from './components/Page';

const ModalStack = StackNavigator({
  Page: {
    screen: Page,
  },
});

export default ModalStack;

// import PixiView from './Components/PixiBaseView';
// import app from './Examples/Basics/Container';
// export default () => <PixiView app={app} />;
