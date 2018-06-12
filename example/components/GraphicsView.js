// @flow
import Expo, { AR, GLView as EXGLView } from 'expo';
import React from 'react';
import { AppState, PixelRatio, findNodeHandle, StyleSheet, Text, View } from 'react-native';

import CameraInfo from './CameraInfo';
import PlayStateView from './PlayStateView';

class GLView extends React.Component {
  render() {
    const { onContextCreate, ...props } = this.props;
    return (
      <EXGLView
        {...props}
        onContextCreate={gl => {
          const scale = PixelRatio.get();
          onContextCreate &&
            onContextCreate({
              gl,
              width: gl.drawingBufferWidth / scale,
              height: gl.drawingBufferHeight / scale,
              scale,
              canvas: null,
            });
        }}
      />
    );
  }
}

type Layout = {
  x: number,
  y: number,
  width: number,
  height: number,
  scale: number,
};

type Props = {
  arEnabled?: ?boolean,
  onShouldReloadContext?: () => boolean,
  onRender: (delta: number) => void,
  onContextCreate?: (props: *) => void,
  onResize?: (layout: Layout) => void,
  shouldIgnoreSafeGaurds?: ?boolean,
} & React.ElementProps<typeof GLView>;

function uuidv4() {
  //https://stackoverflow.com/a/2117523/4047926
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default class GraphicsView extends React.Component<Props> {
  nativeRef: ?GLView.NativeView;
  gl: ?any;

  state = {
    appState: AppState.currentState,
    id: uuidv4(),
  };

  _renderErrorView = error => (
    <View style={styles.errorContainer}>
      <Text>{error}</Text>
    </View>
  );

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChangeAsync);
  }

  componentWillUnmount() {
    this.destroy();
    AppState.removeEventListener('change', this.handleAppStateChangeAsync);
  }

  destroy = () => {
    AR.stopAsync();
    this.gl = null;
    this.nativeRef = null;
    this.arSession = null;
    cancelAnimationFrame(this.rafID);
  };

  handleAppStateChangeAsync = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // console.log('App has come to the foreground!')
      const { onShouldReloadContext } = this.props;
      if (onShouldReloadContext && onShouldReloadContext()) {
        this.destroy();
        this.setState({ appState: nextAppState, id: uuidv4() });
        return;
      }
    }
    this.setState({ appState: nextAppState });
  };

  render() {
    if (!this.props.shouldIgnoreSafeGaurds && this.props.arEnabled) {
      try {
        AR.isAvailable();
      } catch (error) {
        return this._renderErrorView(error);
      }

      if (!AR.isConfigurationAvailable(this.props.trackingConfiguration)) {
        return (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'red',
            }}>
            <Text style={{ fontSize: 24, color: 'white' }}>
              {this.props.trackingConfiguration} isn't available!
            </Text>
          </View>
        );
      }
    }

    return (
      <PlayStateView>
        <CameraInfo style={{ flex: 1 }}>
          <GLView
            key={this.state.id}
            onLayout={this._onLayout}
            nativeRef_EXPERIMENTAL={ref => (this.nativeRef = ref)}
            style={[styles.container, this.props.style]}
            onContextCreate={this._onContextCreate}
          />
        </CameraInfo>
      </PlayStateView>
    );
  }

  _onLayout = ({
    nativeEvent: {
      layout: { x, y, width, height },
    },
  }) => {
    if (!this.gl) {
      return;
    }
    const scale = PixelRatio.get();
    this.props.onResize && this.props.onResize({ x, y, width, height, scale });
  };

  _onContextCreate = async ({ gl, ...props }) => {
    this.gl = gl;
    gl.createRenderbuffer = () => ({});
    this.arSession;
    if (this.props.arEnabled) {
      // Start AR session
      this.arSession = await AR.startAsync(
        findNodeHandle(this.nativeRef),
        this.props.trackingConfiguration
      );
    }

    await this.props.onContextCreate({
      gl,
      arSession: this.arSession,
      ...props,
    });
    let lastFrameTime;
    const render = () => {
      if (this.gl) {
        const now = 0.001 * global.nativePerformanceNow();
        const delta =
          typeof lastFrameTime !== 'undefined' ? now - lastFrameTime : 0.16666;
        this.rafID = requestAnimationFrame(render);

        this.props.onRender(delta);
        // NOTE: At the end of each frame, notify `Expo.GLView` with the below
        gl.endFrameEXP();

        lastFrameTime = now;
      }
    };
    render();
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    backgroundColor: 'red',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
