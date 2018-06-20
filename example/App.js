import { AR, Permissions, ScreenOrientation } from 'expo';
import { AR as ThreeAR, THREE } from 'expo-three';
import React from 'react';
import { Text, View, StatusBar } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Page from './components/Page';
import 'three/examples/js/controls/OrbitControls';
import DebugPages from './screens';
const Navigator = createStackNavigator({
  Page: {
    screen: Page,
  },
});

export default class App extends React.Component {
  state = {
    hasCameraPermission: null,
  };

  componentDidMount() {
    THREE.suppressExpoWarnings();
    ScreenOrientation.allow(ScreenOrientation.Orientation.ALL);
    this._setupAsync();
    StatusBar.setBarStyle('dark-content', true);
  }

  _setupAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  };

  componentWillUnmount() {
    THREE.suppressExpoWarnings(false);
    AR.stopAsync();
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Waiting for camera permission</Text>
        </View>
      );
    }
    // else if (!AR.isAvailable()) {
    //   return <ErrorView>{AR.getUnavailabilityReason()}</ErrorView>;
    // }
    else if (hasCameraPermission === false) {
      return <ErrorView>No access to camera</ErrorView>;
    } else {
      return <DebugPages.README />; //<Navigator />;
    }
  }
}

const ErrorView = ({ children }) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'red',
      paddingHorizontal: 24,
    }}>
    <Text style={{ fontSize: 24, color: 'white' }}>{children}</Text>
  </View>
);
