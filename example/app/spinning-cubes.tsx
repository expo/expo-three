// Fast refresh doesn't work very well with GLViews.
// Always reload the entire component when the file changes:
// https://reactnative.dev/docs/fast-refresh#fast-refresh-and-hooks
// @refresh reset

import { Asset } from 'expo-asset';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { loadAsync, Renderer, TextureLoader } from 'expo-three';
import * as React from 'react';
import { Platform, ActivityIndicator, Text, View } from 'react-native';
import { MeshBasicMaterial } from 'three';
import {
  AmbientLight,
  BoxGeometry,
  Fog,
  GridHelper,
  Mesh,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
} from 'three';
import { LoadingView } from '../components/LoadingView';

function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  const timeoutRef = React.useRef<number>();
  React.useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    // removes the warning EXGL: gl.pixelStorei() doesn't support this parameter yet!
    const pixelStorei = gl.pixelStorei.bind(gl);
    gl.pixelStorei = function (...args) {
      const [parameter] = args;
      switch (parameter) {
        case gl.UNPACK_FLIP_Y_WEBGL:
          return pixelStorei(...args);
      }
    };

    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const clearColor = 0x6ad6f0;
    const lightColor = 0xffffff;

    // Create a WebGLRenderer without a DOM element
    const renderer = new Renderer({
      gl,
      clearColor,
      width: width,
      height: height,
    });

    const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
    camera.position.set(2, 5, 5);
    camera.updateProjectionMatrix();

    const scene = new Scene();
    scene.fog = new Fog(clearColor, 1, 1000);
    scene.add(new GridHelper(10, 10));

    const ambientLight = new AmbientLight(0x101010, Math.PI);
    scene.add(ambientLight);

    const pointLight = new PointLight(lightColor, 2 * Math.PI, 1000, 0.0);
    pointLight.position.set(0, 200, 200);
    scene.add(pointLight);

    const spotLight = new SpotLight(
      lightColor,
      0.5 * Math.PI,
      0,
      Math.PI / 3,
      0,
      0.0
    );
    spotLight.position.set(0, 500, 100);
    spotLight.lookAt(scene.position);
    scene.add(spotLight);

    // Load and add a texture from the web
    const remoteCube = new RemoteIconMesh();
    scene.add(remoteCube);

    // Load and add a texture from the local assets
    const localCube = new LocalIconMesh();
    localCube.position.x -= 2;
    localCube.position.y += 1;
    localCube.position.z -= 2;
    scene.add(localCube);

    // Load and add an obj model
    const model: Record<string, string> = {
      '3d.obj':
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/obj/walt/WaltHead.obj',
      '3d.mtl':
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/obj/walt/WaltHead.mtl',
    };

    if (Platform.OS !== 'web') {
      const object = await loadAsync(
        [model['3d.obj'], model['3d.mtl']],
        // @ts-ignore
        null,
        (name) => model[name]
      );

      object.position.y += 2;
      object.position.z -= 2;
      object.scale.set(0.02, 0.02, 0.02);

      scene.add(object);
    }

    camera.lookAt(remoteCube.position);

    function update() {
      remoteCube.rotation.y += 0.05;
      remoteCube.rotation.x += 0.025;

      localCube.rotation.z += 0.05;
    }

    // Setup an animation loop
    const render = () => {
      if (isLoading) {
        setIsLoading(false);
      }

      timeoutRef.current = requestAnimationFrame(render);
      update();
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  return (
    <View style={{ flex: 1 }}>
      <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
      {isLoading && <LoadingView />}
    </View>
  );
}

// A basic cube with geometry and material
class IconMesh extends Mesh {
  constructor() {
    super();
    this.geometry = new BoxGeometry(1, 1, 1);
  }
}

// Example of loading a texture from the web:
class RemoteIconMesh extends IconMesh {
  constructor() {
    super();
    loadAsync(
      'https://raw.githubusercontent.com/expo/expo/main/apps/bare-expo/assets/splash.png'
    ).then((texture) => {
      this.material = new MeshBasicMaterial({ map: texture });
    });
  }
}

// Example of loading a local asset:
class LocalIconMesh extends IconMesh {
  constructor() {
    super();
    const loader = new TextureLoader();
    Asset.loadAsync(require('../assets/icon.png')).then(([{ localUri }]) => {
      try {
        loader.load(localUri, (texture) => {
          this.material = new MeshBasicMaterial({ map: texture });
        });
      } catch (error) {
        console.error(error);
      }
    });
  }
}

export default App;
