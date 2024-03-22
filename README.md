<h1 align="center">Welcome to Expo & Three.JS 👋</h1>

<p align="center">
  <b>Tools for using three.js to create universal 3D experiences</b>
  |
  <a aria-label="Try Expo THREE in the browser with Expo Snack" href="https://snack.expo.io/@bacon/three">
    <b>Try it in the browser!</b>
  </a>
</p>

<p align="center">
  <a aria-label="Well tested THREE.js Library" href="https://github.com/expo/expo-three/actions">
    <img align="center" alt="GitHub Actions status" src="https://github.com/expo/expo-three/workflows/Check%20Universal%20Module/badge.svg">
  </a>
</p>

<p>
  <a aria-label="Follow @expo on Twitter" href="https://twitter.com/intent/follow?screen_name=expo" target="_blank">
    <img  alt="Twitter: expo" src="https://img.shields.io/twitter/follow/expo.svg?style=flat-square&label=Follow%20%40expo&logo=TWITTER&logoColor=FFFFFF&labelColor=00aced&logoWidth=15&color=lightgray" target="_blank" />
  </a>

  <a aria-label="Follow Expo on Medium" href="https://blog.expo.io">
    <img align="right" alt="Medium: exposition" src="https://img.shields.io/badge/Learn%20more%20on%20our%20blog-lightgray.svg?style=flat-square" target="_blank" />
  </a>
</p>

This package bridges [Three.js](https://threejs.org/) to [Expo GL](https://docs.expo.io/versions/latest/sdk/gl-view/) - a package which provides a WebGL interface for native OpenGL-ES in React. Largely this helps with abstracting the DOM parts away from Three.js.

> AR was moved to `expo-three-ar` in `expo-three@5.0.0`

## Quick Start

Create a universal React project with `expo-three` setup:

```sh
npx create-react-native-app -t with-three
```

For a more declarative interface, you can use this package with [react-three-fiber](https://github.com/expo/examples/blob/master/with-react-three-fiber/README.md). You can bootstrap that with:

```sh
npx create-react-native-app -t with-react-three-fiber
```

### Installation

> In `expo-three@5.0.0` and higher, Three.js is a **peer dependency**

```bash
yarn add three expo-three expo-gl
```

### Usage

Import the library into your project file:

```js
import { Renderer } from 'expo-three';
```

Get a global instance of `three.js` from `expo-three`:

```js
import { THREE } from 'expo-three';
```

> 🚨 You'll need to **use a physical device** as the iOS Simulators and Android emulators do not work well with Three.js + EXGL.

Due to some issues with the **Metro bundler** you may need to manually define the global instance of Three.js. This is important because three.js doesn't fully use ECMAScript but rather mutates a single global instance of `THREE` with side-effects.

```js
global.THREE = global.THREE || THREE;
```

## Creating a Renderer

Given a `gl` from a [`GLView`](https://docs.expo.io/versions/latest/sdk/gl-view.html), return a
[`THREE.WebGLRenderer`](https://threejs.org/docs/#api/renderers/WebGLRenderer)
that draws to it.

```tsx
import * as React from 'react';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer } from 'expo-three';

export default function App() {
  return (
    <GLView
      style={{ flex: 1 }}
      onContextCreate={(gl: ExpoWebGLRenderingContext) => {
        // Create a WebGLRenderer without a DOM element
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
      }}
    />
  );
}
```

### Loading assets

The Metro bundler cannot load arbitrary file types like (`.obj`, `.mtl`, `.dae`, etc..). In order to support them you must create a `./metro.config.js` in your project root, and add the file extensions you want to support.

`metro.config.js`

```js
module.exports = {
  resolver: {
    assetExts: ['db', 'mp3', 'ttf', 'obj', 'png', 'jpg'],
  },
};
```

All assets require a local URI to be loaded. You can resolve a local URI with `expo-asset`.

```ts
import { Asset } from 'expo-asset';

// Create an Asset from a local resource
const [{ localUri }] = await Asset.loadAsync(require('./image.png'));
```

### Loading a texture

After you have an asset loaded, you can use it to create a Three.js Texture. `expo-three` provides a helper utility that can resolve the asset internally and make other modifications to support a wider variety of images:

```ts
import { TextureLoader } from 'expo-three';

// This texture will be immediately ready but it'll load asynchronously
const texture = new TextureLoader().load(require('./img.png'));
```

Optionally, you can create a texture from the local URI manually (this may not work for most image types):

```ts
import { TextureLoader } from 'three';
import { Asset } from 'expo-asset';

// Create an Asset from a resource
const [{ localUri }] = await Asset.loadAsync(require('./img.png'));

// This texture will be immediately ready but it'll load asynchronously
const texture = new TextureLoader().load(localUri);
```

### Loading an obj model

Be sure to add support for whatever model extension you wish to load to your `metro.config.js`, then you can load a model using the local URI:

```ts
// Import from jsm for smaller bundles and faster apps
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Asset } from 'expo-asset';

const [{ localUri }] = await Asset.loadAsync(require('./model.obj'));

const loader = new OBJLoader();
loader.load(localUri, group => {
  // Model loaded...
});
```

### `ExpoTHREE.loadAsync()`

A function that will asynchronously load files based on their extension.

> **Notice**: Remember to update your `metro.config.js` to bundle obscure file types!

`metro.config.js`

```js
module.exports = {
  resolver: {
    assetExts: ['db', 'mp3', 'ttf', 'obj', 'png', 'jpg'],
  },
};
```

#### Props

| Property      |           Type            | Description                                                      |
| ------------- | :-----------------------: | ---------------------------------------------------------------- |
| resource      |       PossibleAsset       | The asset that will be parsed asynchornously                     |
| onProgress    |       (xhr) => void       | A function that is called with an xhr event                      |
| assetProvider | () => Promise<Expo.Asset> | A function that is called whenever an unknown asset is requested |

##### PossibleAsset Format

export type PossibleAsset = Expo.Asset | number | string | AssetFormat;

```js
type PossibleAsset = number | string | Expo.Asset;
```

- `number`: Static file reference `require('./model.*')`
- `Expo.Asset`: [Expo.Asset](https://docs.expo.io/versions/latest/sdk/asset.html)
- `string`: A uri path to an asset

#### Returns

This returns many different things, based on the input file.
For a more predictable return value you should use one of the more specific model loaders.

#### Example

```js
const texture = await ExpoTHREE.loadAsync(
  'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'
);
```

## Loaders

### loadAsync(assetReference, onProgress, onAssetRequested)

A universal loader that can be used to load images, models, scenes, and animations.
Optionally more specific loaders are provided with less complexity.

```js
// A THREE.Texture from a static resource.
const texture = await ExpoTHREE.loadAsync(require('./icon.png'));
const obj = await ExpoTHREE.loadAsync(
  [require('./cartman.obj'), require('./cartman.mtl')],
  null,
  imageName => resources[imageName]
);
const { scene } = await ExpoTHREE.loadAsync(
  resources['./kenny.dae'],
  onProgress,
  resources
);
```

### loadObjAsync({ asset, mtlAsset, materials, onAssetRequested, onMtlAssetRequested })

> 🚨 **Deprecated:** Load OBJ files manually with the JS module `three/examples/jsm/loaders/OBJLoader`

#### Props

- `asset`: a `obj` model reference that will be evaluated using `AssetUtils.resolveAsync`
- `mtlAsset`: an optional prop that will be loaded using `loadMtlAsync()`
- `onAssetRequested`: A callback that is used to evaluate urls found within the `asset` and optionally the `mtlAsset`. You can also just pass in a dictionary of key values if you know the assets required ahead of time.
- `materials`: Optionally you can provide an array of materials returned from `loadMtlAsync()`
- `onMtlAssetRequested`: If provided this will be used to request assets in `loadMtlAsync()`

This function is used as a more direct method to loading a `.obj` model.
You should use this function to debug when your model has a corrupted format.

```js
const mesh = await loadObjAsync({ asset: 'https://www.members.com/chef.obj' });
```

### loadTextureAsync({ asset })

> 🚨 **Deprecated:** Load textures manually with the JS module from `three`

#### Props

- `asset`: an `Expo.Asset` that could be evaluated using `AssetUtils.resolveAsync` if `localUri` is missing or the asset hasn't been downloaded yet.

This function is used as a more direct method to loading an image into a texture.
You should use this function to debug when your image is using an odd extension like `.bmp`.

```js
const texture = await loadTextureAsync({ asset: require('./image.png') });
```

### loadMtlAsync({ asset, onAssetRequested })

> 🚨 **Deprecated:** Load MTL files manually with the JS module `three/examples/jsm/loaders/MTLLoader`

#### Props

- `asset`: a `mtl` material reference that will be evaluated using `AssetUtils.resolveAsync`
- `onAssetRequested`: A callback that is used to evaluate urls found within the `asset`, optionally you can just pass in a dictionary of key values if you know the assets required ahead of time.

```js
const materials = await loadMtlAsync({
  asset: require('chef.mtl'),
  onAssetRequested: modelAssets,
});
```

### loadDaeAsync({ asset, onAssetRequested, onProgress })

> 🚨 **Deprecated:** Load DAE files manually with the JS module `three/examples/jsm/loaders/ColladaLoader`

#### Props

- `asset`: a reference to a `dae` scene that will be evaluated using `AssetUtils.resolveAsync`
- `onAssetRequested`: A callback that is used to evaluate urls found within the `asset`, optionally you can just pass in a dictionary of key values if you know the assets required ahead of time.
- `onProgress`: An experimental callback used to track loading progress.

```js
const { scene } = await loadDaeAsync({
  asset: require('chef.dae'),
  onAssetRequested: modelAssets,
  onProgress: () => {},
});
```

---

## `ExpoTHREE.utils`

These are Three.js utilities that aren't required for using Three.js with Expo.

### `ExpoTHREE.utils.alignMesh()`

#### Props

```js
type Axis = {
  x?: number,
  y?: number,
  z?: number,
};
```

| Property |    Type     | Description                       |
| -------- | :---------: | --------------------------------- |
| mesh     | &THREE.Mesh | The mesh that will be manipulated |
| axis     |    ?Axis    | Set the relative center axis      |

#### Example

```js
ExpoTHREE.utils.alignMesh(mesh, { x: 0.0, y: 0.5 });
```

---

### `ExpoTHREE.utils.scaleLongestSideToSize()`

#### Props

| Property |    Type     | Description                                                  |
| -------- | :---------: | ------------------------------------------------------------ |
| mesh     | &THREE.Mesh | The mesh that will be manipulated                            |
| size     |   number    | The size that the longest side of the mesh will be scaled to |

#### Example

```js
ExpoTHREE.utils.scaleLongestSideToSize(mesh, 3.2);
```

---

### `ExpoTHREE.utils.computeMeshNormals()`

Used for smoothing imported geometry, specifically when imported from `.obj` models.

#### Props

| Property |    Type     | Description                                       |
| -------- | :---------: | ------------------------------------------------- |
| mesh     | &THREE.Mesh | The mutable (inout) mesh that will be manipulated |

#### Example

```js
ExpoTHREE.utils.computeMeshNormals(mesh);
```

---

## THREE Extensions

### `suppressMetroWarnings`

A function that suppresses EXGL compatibility warnings and logs them instead. By default this is enabled on native because it can cause the Metro development server to slow down significantly.
You will need to import the `ExpoTHREE.THREE` global instance to use this. By
default this function will be activated on import.

- `shouldSuppress`: boolean

```js
import { THREE } from 'expo-three';
THREE.suppressMetroWarnings();
```

---

## Running the example app

Clone the repo and `cd expo-three` then run:

```sh
yarn
yarn build
# CMD+C to exit build watch mode
cd example
npx expo prebuild
npx expo run:android # or npx expo run:ios
```

## ⛓ Links

Somewhat out of date

- [Loading Text](https://github.com/EvanBacon/expo-three-text)
- [three.js docs](https://threejs.org/docs/)
- [Random Demos](https://github.com/EvanBacon/expo-three-demo)
- [Game: Expo Sunset Cyberspace](https://github.com/EvanBacon/Sunset-Cyberspace)
- [Game: Crossy Road](https://github.com/EvanBacon/Expo-Crossy-Road)
- [Game: Nitro Roll](https://github.com/EvanBacon/Expo-Nitro-Roll)
- [Game: Pillar Valley](https://github.com/EvanBacon/Expo-Pillar-Valley)
- [Voxel Terrain](https://github.com/EvanBacon/Expo-Voxel)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Expo/expo-three/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2019-2022 [650 Industries](https://expo.io/about).<br />
This project is [MIT](https://github.com/Expo/expo-three/blob/master/LICENSE) licensed.
