![demo](./demo.gif "demo")

## expo-three loader example

A single loader for handling three.js assets. This function wraps three.js loaders and provides a
callback for getting Expo Assets.

**Example:**

```js
const modelFiles = {
    "model.obj": require('./model.obj'),
    "specular.png": require('./specular.png'),
    "normal.jpg": require('./normal.jpg')
}
const file = modelFiles["model.obj"];
const onProgress = xhr => {
    if (xhr.lengthComputable) {
        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
};
const assetProvider = assetNamed => {
    return modelFiles[assetNamed];
};
const geometry = await ExpoTHREE.loadAsync(file, onProgress, assetProvider);
```

---

### Supported File Overview

* `ExpoTHREE.loadAsync`
  * obj
  * ~~mtl~~
  * dae
  * 3ds
  * ~~3mf~~: Needs support for `JSZip`
  * amf
  * assimp
  * babylon
  * bvh
  * dae (collada)
  * ~~draco~~
    * Problem: missing `document.getElementsByTagName`
  * ~~pack~~
    * Problem: `msgpack` library requires lots of polyfill
  * pcd
    * [ ] ASCII: Problem on `THREE.BufferGeometry.computeBoundingSphere`
    * [x] Binary
  * ply
    * [x] ASCII
    * [x] Binary
  * stl
    * [x] ASCII
    * [x] Binary
  * vtk
  * vtp
    * [x] ASCII
    * [ ] Binary: Needs support for `ZLib`
    * [x] non compressed
  * x (xfile)
  * ~~json~~
  * ~~bin~~
  * ~~js~~
