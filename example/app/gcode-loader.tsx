// This example demonstrates how to load a GCode file using the GCodeLoader from three.js.
// https://threejs.org/examples/#webgl_loader_gcode

// Fast refresh doesn't work very well with GLViews.
// Always reload the entire component when the file changes:
// https://reactnative.dev/docs/fast-refresh#fast-refresh-and-hooks
// @refresh reset

import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer, THREE } from 'expo-three';
import OrbitControlsView from 'expo-three-orbit-controls';
import { LoadingView } from '../components/LoadingView';
import { useSceneStats } from '../components/StatsPanel';
import { GCodeLoader } from 'three/examples/jsm/loaders/GCodeLoader';

export default function ThreeScene() {
  const [isLoading, setIsLoading] = useState(true);
  const cameraRef = useRef<THREE.Camera>();

  const { calculateSceneStats, StatsPanel, mark } = useSceneStats();

  const timeoutRef = useRef<number>();
  useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const sceneRef = useRef<THREE.Scene>();
  const clockRef = useRef<THREE.Clock>();

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    setIsLoading(true);
    clockRef.current = new THREE.Clock();

    // removes the warning EXGL: gl.pixelStorei() doesn't support this parameter yet!
    const pixelStorei = gl.pixelStorei.bind(gl);
    gl.pixelStorei = function (...args) {
      const [parameter] = args;
      switch (parameter) {
        case gl.UNPACK_FLIP_Y_WEBGL:
          return pixelStorei(...args);
      }
    };

    const renderer = new Renderer({ gl });
    let cam = new THREE.PerspectiveCamera(
      60,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      1,
      1000
    );
    cam.position.set(0, 0, 100);
    cameraRef.current = cam;

    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = new THREE.Color(0x000000);

    // Add the rest of your objects here:
    const loader = new GCodeLoader();
    const object = await loader.loadAsync(
      'https://threejs.org/examples/models/gcode/benchy.gcode'
    );
    object.position.set(-100, -20, 100);
    sceneRef.current.add(object);
    // cameraRef.current.lookAt(object.position);

    function animate() {
      timeoutRef.current = requestAnimationFrame(animate);

      // FPS counter
      mark();

      if (cameraRef.current && sceneRef.current) {
        renderer.render(sceneRef.current, cameraRef.current);
      }
      gl.endFrameEXP();
    }
    animate();

    setIsLoading(false);

    // Calculate the objects, vertices, and triangles in the scene
    calculateSceneStats(sceneRef.current);
  };

  return (
    <View style={{ flex: 1 }}>
      <OrbitControlsView style={{ flex: 1 }} camera={cameraRef.current}>
        <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
      </OrbitControlsView>
      {isLoading ? (
        <LoadingView />
      ) : (
        <StatsPanel
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: 10,
            backgroundColor: 'yellow',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        />
      )}
    </View>
  );
}
