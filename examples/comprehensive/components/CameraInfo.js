import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AR } from 'expo';

const trackingStateReasonExplainations = {
  [AR.TrackingStateReasons.None]: { title: 'Having trouble collecting data' },
  [AR.TrackingStateReasons.Initializing]: {
    title: 'Initializing',
    subtitle: 'Move the camera around for faster results',
  },
  [AR.TrackingStateReasons.ExcessiveMotion]: {
    title: 'Excessive motion',
    subtitle: 'Try moving your camera slower',
  },
  [AR.TrackingStateReasons.InsufficientFeatures]: {
    title: 'insufficient features',
    subtitle: 'Try moving your camera around more',
  },
  [AR.TrackingStateReasons.Relocalizing]: { title: 'Relocalizing' },
};

class CameraInfo extends React.PureComponent {
  state = {};

  componentDidMount() {
    AR.onCameraDidChangeTrackingState(tracking => this.setState(tracking));
  }

  componentWillUnmount() {
    AR.removeAllListeners(AR.EventTypes.CameraDidChangeTrackingState);
  }

  render() {
    const { style, titleStyle, children } = this.props;
    const { trackingState, trackingStateReason } = this.state;

    let trackingStateColor = 'white';
    let trackingStateMessage = {};
    switch (trackingState) {
      case AR.TrackingStates.NotAvailable:
        trackingStateMessage = { title: 'Not Available' };
        trackingStateColor = '#D0021B';
        break;
      case AR.TrackingStates.Limited:
        trackingStateMessage = trackingStateReasonExplainations[trackingStateReason];
        trackingStateColor = '#F5C423';
        break;
      case AR.TrackingStates.Normal:
        break;
    }
    const { title, subtitle } = trackingStateMessage;

    return (
      <View style={{ flex: 1 }}>
        {children}
        <View style={[styles.container, style]}>
          {title && (
            <Text style={[styles.title, { color: trackingStateColor }, titleStyle]}>{title}</Text>
          )}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 56,
    right: 12,
    left: 12,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 24,
  },
  subtitle: {
    color: '#BEBEBE',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default CameraInfo;
