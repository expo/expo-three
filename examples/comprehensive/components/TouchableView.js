// @flow
import React from 'react';
import { PanResponder, View } from 'react-native';
import { PropTypes } from 'prop-types';

/* global Alert */

export default class TouchableView extends React.Component {
  static propTypes = {
    onTouchesBegan: PropTypes.func.isRequired,
    onTouchesMoved: PropTypes.func.isRequired,
    onTouchesEnded: PropTypes.func.isRequired,
    onTouchesCancelled: PropTypes.func.isRequired,
  };

  buildGestures = () =>
    PanResponder.create({
      // onResponderTerminate: this.props.onResponderTerminate ,
      onStartShouldSetResponder: () => true,
      //   onResponderTerminationRequest: this.props.onResponderTerminationRequest,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: ({ nativeEvent }, gestureState) =>
        this.props.onTouchesBegan({ ...nativeEvent, gestureState }),
      onPanResponderMove: ({ nativeEvent }, gestureState) =>
        this.props.onTouchesMoved({ ...nativeEvent, gestureState }),
      onPanResponderRelease: ({ nativeEvent }, gestureState) =>
        this.props.onTouchesEnded({ ...nativeEvent, gestureState }),
      onPanResponderTerminate: ({ nativeEvent }, gestureState) =>
        this.props.onTouchesCancelled
          ? this.props.onTouchesCancelled({ ...nativeEvent, gestureState })
          : this.props.onTouchesEnded({ ...nativeEvent, gestureState }),
    });

  componentWillMount() {
    this._panResponder = this.buildGestures();
  }

  render() {
    const { children, id, style, ...props } = this.props;
    return (
      <View {...props} style={[style]} {...this._panResponder.panHandlers}>
        {children}
      </View>
    );
  }
}
