import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import * as React from 'react';
import { Renderer, loadTextureAsync, THREE } from 'expo-three';

global.THREE = THREE;

export default function App() {
  let timeout;

  React.useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  return (
    <GLView
      style={{ flex: 1 }}
      onContextCreate={async (gl: ExpoWebGLRenderingContext) => {
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
        const sceneColor = 0x6ad6f0;

        // Create a WebGLRenderer without a DOM element
        const renderer = new Renderer({ gl, antialias: true });
        renderer.setSize(width, height);
        renderer.setClearColor(sceneColor);

        const camera = new THREE.PerspectiveCamera(
          70,
          width / height,
          0.01,
          1000,
        );
        camera.position.set(2, -5, 5);

        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(sceneColor, 1, 10000);
        scene.add(new THREE.GridHelper(10, 10));

        const ambientLight = new THREE.AmbientLight(0x101010);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 2, 1000, 1);
        pointLight.position.set(0, 200, 200);
        scene.add(pointLight);

        const spotLight = new THREE.SpotLight(0xffffff, 0.5);
        spotLight.position.set(0, 500, 100);
        spotLight.lookAt(scene.position);
        scene.add(spotLight);

        const gem = new GemMesh();
        gem.position.set(0, 1, 0);
        scene.add(gem);

        camera.lookAt(gem.position);

        // Load a texture (we must use this method because of the way Metro bundler bundles assets)
        const texture = await loadTextureAsync({
          asset: require('./assets/icon.png'),
        });

        const cube = new IconMesh(texture);
        cube.position.x = 2;
        scene.add(cube);

        // Setup camera controls (WEB ONLY)
        require('three/examples/js/controls/OrbitControls');
        // @ts-ignore
        new THREE.OrbitControls(camera);

        function update() {
          gem.rotation.y += 0.1;

          cube.rotation.y += 0.05;
          cube.rotation.x += 0.025;
        }

        // Setup an animation loop
        const render = () => {
          timeout = requestAnimationFrame(render);
          update();
          renderer.render(scene, camera);
          gl.endFrameEXP();
        };
        render();
      }}
    />
  );
}

class GemMesh extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.CylinderGeometry(0.6, 1, 0.3, 8, 1);
    geometry.vertices[geometry.vertices.length - 1].y = -1;
    geometry.verticesNeedUpdate = true;

    super(
      geometry,
      new THREE.MeshPhongMaterial({
        color: 0x37be95,
        wireframe: false,
        side: THREE.DoubleSide,
        flatShading: true,
        refractionRatio: 0.5,
        opacity: 0.7,
        transparent: true,
        shininess: 3100,
      }),
    );
  }
}

class IconMesh extends THREE.Mesh {
  constructor(map) {
    super(
      new THREE.BoxBufferGeometry(1.0, 1.0, 1.0),
      new THREE.MeshStandardMaterial({
        map,
      }),
    );
  }
}
