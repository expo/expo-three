import { Ionicons } from '@expo/vector-icons';
import { AR } from 'expo';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

class IconButton extends React.PureComponent {
  render() {
    const { style, onPress, icon } = this.props;
    return (
      <TouchableOpacity style={style} onPress={onPress}>
        <View
          style={{
            aspectRatio: 1,
            width: 56,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Ionicons name={icon} size={32} color="white" />
        </View>
      </TouchableOpacity>
    );
  }
}

export default class PlayStateView extends React.Component {
  state = { running: true };

  componentDidMount() {
    this._onSessionWasInterrupted = AR.onSessionWasInterrupted(() => {
      console.log('Backgrounded App: Session was interrupted');
      this.pause();
    });

    this._onSessionInterruptionEnded = AR.onSessionInterruptionEnded(() => {
      console.log('Foregrounded App: Session is no longer interrupted');
    });
  }

  componentWillUnmount() {
    this._onSessionWasInterrupted.remove();
    this._onSessionInterruptionEnded.remove();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.children}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'space-between',
            padding: 24,
          }}>
          <IconButton icon={this.iconName} onPress={this.onPress} />
        </View>
      </View>
    );
  }

  onPress = () => {
    this.toggleRunning();
  };

  pause = () => {
    if (!this.state.running) {
      return;
    }
    this.toggleRunning();
  };

  toggleRunning = () => {
    this.setState({ running: !this.state.running }, () => {
      const { running } = this.state;
      if (running) {
        AR.resume();
      } else {
        AR.pause();
      }
    });
  };

  get iconName() {
    return this.state.running ? 'md-play' : 'md-pause';
  }
}
