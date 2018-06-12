// @flow
import { PropTypes } from 'prop-types';
import React from 'react';
import { PanResponder, View } from 'react-native';

/* global Alert */

class TouchableView extends React.Component {
  static propTypes = {
    onTouchesBegan: PropTypes.func.isRequired,
    onTouchesMoved: PropTypes.func.isRequired,
    onTouchesEnded: PropTypes.func.isRequired,
    onTouchesCancelled: PropTypes.func.isRequired,
    onStartShouldSetPanResponderCapture: PropTypes.func.isRequired,
  };
  static defaultProps = {
    onTouchesBegan: () => {},
    onTouchesMoved: () => {},
    onTouchesEnded: () => {},
    onTouchesCancelled: () => {},
    onStartShouldSetPanResponderCapture: () => true,
  };

  buildGestures = () =>
    PanResponder.create({
      // onResponderTerminate: this.props.onResponderTerminate ,
      // onStartShouldSetResponder: () => true,
      onResponderTerminationRequest: this.props.onResponderTerminationRequest,
      onStartShouldSetPanResponderCapture: this.props
        .onStartShouldSetPanResponderCapture,
      // onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: ({ nativeEvent }, gestureState) => {
        const event = this._transformEvent({ ...nativeEvent, gestureState });
        this._emit('touchstart', event);
        this.props.onTouchesBegan(event);
      },
      onPanResponderMove: ({ nativeEvent }, gestureState) => {
        const event = this._transformEvent({ ...nativeEvent, gestureState });
        this._emit('touchmove', event);
        this.props.onTouchesMoved(event);
      },
      onPanResponderRelease: ({ nativeEvent }, gestureState) => {
        const event = this._transformEvent({ ...nativeEvent, gestureState });
        this._emit('touchend', event);
        this.props.onTouchesEnded(event);
      },
      onPanResponderTerminate: ({ nativeEvent }, gestureState) => {
        const event = this._transformEvent({ ...nativeEvent, gestureState });
        this._emit('touchcancel', event);

        this.props.onTouchesCancelled
          ? this.props.onTouchesCancelled(event)
          : this.props.onTouchesEnded(event);
      },
    });
  _panResponder = null;
  constructor(props) {
    super(props);
    this._panResponder = this.buildGestures();
  }

  _emit = (type, props) => {
    if (window.document && window.document.emitter) {
      window.document.emitter.emit(type, props);
    }
  };

  _transformEvent = event => {
    event.preventDefault = event.preventDefault || (_ => {});
    event.stopPropagation = event.stopPropagation || (_ => {});
    return event;
  };

  render() {
    const { children, id, style, ...props } = this.props;
    return (
      <View {...props} style={[style]} {...this._panResponder.panHandlers}>
        {children}
      </View>
    );
  }
}
export default TouchableView;
