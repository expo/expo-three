import { Asset } from 'expo-asset';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { loadAsync, Renderer, TextureLoader } from 'expo-three';
import * as React from 'react';
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

export default function App() {
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
    const sceneColor = 0x6ad6f0;

    // Create a WebGLRenderer without a DOM element
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(sceneColor);

    const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
    camera.position.set(2, 5, 5);

    const scene = new Scene();
    scene.fog = new Fog(sceneColor, 1, 1000);
    scene.add(new GridHelper(10, 10));

    const ambientLight = new AmbientLight(0x101010, Math.PI);
    scene.add(ambientLight);

    const pointLight = new PointLight(0xffffff, 2 * Math.PI, 1000, 0.0);
    pointLight.position.set(0, 200, 200);
    scene.add(pointLight);

    const spotLight = new SpotLight(
      0xffffff,
      0.5 * Math.PI,
      0,
      Math.PI / 3,
      0,
      0.0
    );
    spotLight.position.set(0, 500, 100);
    spotLight.lookAt(scene.position);
    scene.add(spotLight);

    // Load and add a texture
    const cube = new IconMesh();
    scene.add(cube);

    // Load and add an obj model
    const model: Record<string, string> = {
      '3d.obj':
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/obj/walt/WaltHead.obj',
      '3d.mtl':
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/obj/walt/WaltHead.mtl',
    };

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

    camera.lookAt(cube.position);

    function update() {
      cube.rotation.y += 0.05;
      cube.rotation.x += 0.025;
    }

    // Setup an animation loop
    const render = () => {
      timeoutRef.current = requestAnimationFrame(render);
      update();
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  return (
    <>
      <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
    </>
  );
}

class IconMesh extends Mesh {
  constructor() {
    super();
    this.geometry = new BoxGeometry(1.0, 1.0, 1.0);

    // Example of loading a texture from the web:
    // loadAsync(
    //   'https://github.com/expo/expo/blob/main/apps/bare-expo/assets/splash.png?raw=true'
    // ).then((texture) => {
    //   console.log('loadAsync texture', texture);
    //   this.material = new MeshBasicMaterial({ map: texture });
    // });

    const asset = Asset.fromModule(require('./assets/icon.png'));
    const loader = new TextureLoader();
    asset.downloadAsync().then((downloadedAsset) => {
      loader.load(asset.localUri, (texture) => {
        this.material = new MeshBasicMaterial({ map: texture });
      });
    });
  }
}
