// Fast refresh doesn't work very well with GLViews.
// Always reload the entire component when the file changes:
// https://reactnative.dev/docs/fast-refresh#fast-refresh-and-hooks
// @refresh reset

import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as React from 'react';
import { View } from 'react-native';
import * as THREE from 'three';
import {
  BoxGeometry,
  PerspectiveCamera,
  Scene,
  MeshPhysicalMaterial,
} from 'three';
import { LoadingView } from '../components/LoadingView';

function ThreeScene() {
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

    const camera = new PerspectiveCamera(70, width / height, 0.1, 1000);

    const scene = new Scene();

    // Add a simple directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create a basic geometry for testing
    const geometry = new BoxGeometry();

    // Create a MeshPhysicalNodeMaterial
    const material = new MeshPhysicalMaterial({
      color: new THREE.Color(0xff0000), // Red
      metalness: 0.5,
      roughness: 0.4,
      clearcoat: 1.0, // High clearcoat for reflective surface
      clearcoatRoughness: 0.1,
    });

    // Create a mesh with the geometry and test material
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Position the camera
    camera.position.z = 5;

    const render = () => {
      if (isLoading) {
        setIsLoading(false);
      }

      timeoutRef.current = requestAnimationFrame(render);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
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

export default ThreeScene;
