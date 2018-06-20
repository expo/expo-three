import { Constants, Permissions } from 'expo';
import React from 'react';
import {
  Linking,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import Colors from '../constants/Colors';

class PermissionInfo extends React.PureComponent {
  render() {
    const { onPress } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>
          {Constants.manifest.name} needs access to the {this.props.permission}
        </Text>
        <Button onPress={onPress}>Grant Access</Button>
      </View>
    );
  }
}

class PermissionGuard extends React.PureComponent {
  static defaultProps = {
    permission: Permissions.CAMERA,
  };
  state = { status: null };

  componentDidMount() {
    this._setupAsync();
  }

  _setupAsync = async () => {
    const { status } = await Permissions.getAsync(this.props.permission);
    this.setState({ status });
  };

  _askAsync = async () => {
    const { status } = await Permissions.askAsync(this.props.permission);
    this.setState({ status });
  };

  get screen() {
    return (
      <PermissionInfo
        onPress={this.onGrantAccessPressed}
        permission={this.props.permission}
      />
    );
  }

  onGrantAccessPressed = () => {
    if (this.state.status === 'denied' && Constants.appOwnership !== 'expo') {
      Linking.openURL('app-settings:');
    } else {
      this._askAsync();
    }
  };

  render() {
    if (this.state.status === 'granted') {
      return this.props.children;
    }
    return this.screen;
  }
}

const Button = ({ children, onPress }) => (
  <TouchableOpacity style={styles.buttonTouchable} onPress={onPress}>
    <Text style={styles.buttonText}>{children}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  infoText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.dark,
    textAlign: 'center',
    marginBottom: '25%',
  },
  buttonTouchable: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light,
  },
  buttonText: {
    color: Colors.dark,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PermissionGuard;
