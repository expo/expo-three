[![NPM](https://nodei.co/npm/expo-three.png)](https://nodei.co/npm/expo-three/)

---

![demo](https://raw.githubusercontent.com/expo/expo-three/master/examples/simple/demo.gif "demo")

_NOTE: GIF above looks choppy because it's a GIF, the real thing is smooth, I
promise..._

# expo-three

Use [THREE](https://threejs.org) on [Expo](https://expo.io)! Just `npm i -S
three expo-three` in your Expo project and import it with `import ExpoTHREE from
'expo-three';`.

## Functions

### `ExpoTHREE.createRenderer({ gl, ...extras })`

Given a `gl` from an
[`Expo.GLView`](https://docs.expo.io/versions/latest/sdk/gl-view.html), return a
[`THREE.WebGLRenderer`](https://threejs.org/docs/#api/renderers/WebGLRenderer)
that draws into it.

### `ExpoTHREE.createTextureAsync({ asset })`

Given an [`Expo.Asset`](https://docs.expo.io/versions/latest/sdk/asset.html),
return a
([`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
that will resolve with a)
[`THREE.Texture`](https://threejs.org/docs/#api/textures/Texture) backed by that
asset as an image.

### `ExpoTHREE.createARCamera(arSession, width, height, near, far)`

Given an `arSession` from `NativeModules.ExponentGLViewManager.startARSession`,
return a
[`THREE.PerspectiveCamera`](https://threejs.org/docs/#api/cameras/PerspectiveCamera)
that automatically updates its view and projection matrices to reflect the AR
session camera. `width, height` specify the dimensions of the target viewport to
render to and `near, far` specify the near and far clipping distances
respectively. The `THREE.PerspectiveCamera` returned has its `updateMatrixWorld`
and `updateProjectionMatrix` methods overriden to update to the AR session's
state automatically.

### `ExpoTHREE.createARBackgroundTexture(arSession, renderer)`

Given an `arSession` from `NativeModules.ExponentGLViewManager.startARSession`
and a
[`THREE.WebGLRenderer`](https://threejs.org/docs/#api/renderers/WebGLRenderer),
return a [`THREE.Texture`](https://threejs.org/docs/#api/textures/Texture) that
reflects the live video feed of the AR session. Usually this is set as the
`.background` property of a
[`THREE.Scene`](https://threejs.org/docs/#api/scenes/Scene) to render the video
feed behind the scene's objects.

### `ExpoTHREE.getARLightEstimation()`

Given an `arSession` from `NativeModules.ExponentGLViewManager.startARSession`,
return a (`object`) the shape of which looks like:

* [ambientIntensity](https://developer.apple.com/documentation/arkit/arlightestimate/2878308-ambientintensity):
  number
* This value ranges from 0 - 2000. 0 being very dark and 2000 being very bright.
* [ambientColorTemperature](https://developer.apple.com/documentation/arkit/arlightestimate/2921629-ambientcolortemperature):
  number
* This value ranges from 0 - 6500. This value is in kelvins and 6500 is white.

### `ExpoTHREE.getRawFeaturePoints()`

Given an `arSession` from `NativeModules.ExponentGLViewManager.startARSession`,
return an (`array`) of points:

* x
* y
* z
* id

### `ExpoTHREE.setIsLightEstimationEnabled()`

Given an `arSession` from `NativeModules.ExponentGLViewManager.startARSession`
and a `bool`, Enable or disable light estimation.

### `ExpoTHREE.setIsPlaneDetectionEnabled()`

Given an `arSession` from `NativeModules.ExponentGLViewManager.startARSession`
and a `bool`, sets the type of planes to detect in the scene.

### `ExpoTHREE.utils`

* **`ExpoTHREE.utils.alignMesh`**: A function that requires a `THREE.Mesh`, an
  optional object containing `x`, `y`, `z` axis values relative to the model.
* **`ExpoTHREE.utils.scaleLongestSideToSize`**: Given a `THREE.Mesh` and a
  `number`, this will find the longest side and scale it to the provided model.
* **`ExpoTHREE.utils.computeMeshNormals`**: Used for smoothing imported
  geometry, specifically when imported from `.obj` models.

### `ExpoTHREE.loadAsync`

A function that will asynchronously load files based on their extension.

#### Props

* `res`: The file to load

  * `number`: Static file reference `require('./model.*')`
  * `Array<number>`: Collection of static file references
    `[require('./model.*')]`
  * `string`: The Expo.Asset
    [`localUri`](https://docs.expo.io/versions/latest/sdk/asset.html#localuri)
  * `Array<string>`: Collection of Expo.Asset
    [`localUri`](https://docs.expo.io/versions/latest/sdk/asset.html#localuri)s
  * ~~`Expo.Asset`~~: Not yet supported!

* `onProgress`: A callback `Function` that will return a `xhr` object
* `assetProvider`: A callback `Function` that is used to request static assets
  required by the model
  * `(assetName: string)`: The async `Function` should return a static asset
    `require('./texture.*')` or an Expo.Asset
    `Expo.Asset.fromModule(require('./texture.*'))`

#### Supported Formats

A list of supported formats can be found [here](/examples/loader)

## THREE Extensions

### `suppressExpoWarnings`

A function that suppresses EXGL compatibility warnings and logs them instead.
You will need to import the `ExpoTHREE.THREE` global instance to use this. By
default this function will be activated on import.

* `shouldSuppress`: boolean

```js
import { THREE } from 'expo-three';
THREE.suppressExpoWarnings(true);
```

### [`loadCubeTextureAsync`](https://snack.expo.io/@bacon/expo-three-loadcubetextureasync)

Used to load in a texture cube or skybox.

* `assetForDirection`: This function will be called for each of the 6
  directions.
  * `({ direction })`: A direction string will be passed back looking for the
    corresponding image. You can send back: `static resource`, `localUri`,
    `Expo.Asset`, `remote image url`
* `directions`: The order that image will be requested in. The default value is:
  `['px', 'nx', 'py', 'ny', 'pz', 'nz']`

Example:

```js
const skybox = {
	nx: require('./nx.jpg'),
	ny: require('./ny.jpg'),
	nz: require('./nz.jpg'),
	px: require('./px.jpg'),
	py: require('./py.jpg'),
	pz: require('./pz.jpg')
}
scene.background = await loadCubeTextureAsync({
  assetForDirection: ({ direction }) => skybox[direction],
})
```

---

## Example

This is based on
[https://threejs.org/docs/#manual/introduction/Creating-a-scene](https://threejs.org/docs/#manual/introduction/Creating-a-scene).

In a
[new blank Expo project](https://docs.expo.io/versions/v17.0.0/guides/up-and-running.html),
run `npm i -S three expo-three` to install THREE and ExpoTHREE. Then replace
`main.js` with the following:

```js
import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import * as THREE from 'three';
import ExpoTHREE from 'expo-three';

export default class App extends React.Component {
  render() {
    // Create an `Expo.GLView` covering the whole screen, tell it to call our
    // `_onGLContextCreate` function once it's initialized.
    return (
      <Expo.GLView
        style={{ flex: 1 }}
        onContextCreate={this._onGLContextCreate}
      />
    );
  }

  // This is called by the `Expo.GLView` once it's initialized
  _onGLContextCreate = async gl => {
    // Based on https://threejs.org/docs/#manual/introduction/Creating-a-scene
    // In this case we instead use a texture for the material (because textures
    // are cool!). All differences from the normal THREE.js example are
    // indicated with a `NOTE:` comment.

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000,
    );

    // NOTE: How to create an `Expo.GLView`-compatible THREE renderer
    const renderer = ExpoTHREE.createRenderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      // NOTE: How to create an Expo-compatible THREE texture
      map: await ExpoTHREE.createTextureAsync({
        asset: Expo.Asset.fromModule(require('./assets/icons/app-icon.png')),
      }),
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    const render = () => {
      requestAnimationFrame(render);

      cube.rotation.x += 0.07;
      cube.rotation.y += 0.04;

      renderer.render(scene, camera);

      // NOTE: At the end of each frame, notify `Expo.GLView` with the below
      gl.endFrameEXP();
    };
    render();
  };
}
```
