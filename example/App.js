import { AR, ScreenOrientation } from 'expo';
import { THREE } from 'expo-three';
import React from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import Page from './components/Page';
import 'three/examples/js/controls/OrbitControls';

const Navigator = createStackNavigator({
  Page: {
    screen: Page,
  },
});

export default class App extends React.Component {
  componentDidMount() {
    THREE.suppressExpoWarnings();
    ScreenOrientation.allow(ScreenOrientation.Orientation.ALL);
    StatusBar.setBarStyle('dark-content', true);
  }

  componentWillUnmount() {
    THREE.suppressExpoWarnings(false);
    AR.stopAsync();
  }

  render() {
    return <Navigator />;
  }
}
