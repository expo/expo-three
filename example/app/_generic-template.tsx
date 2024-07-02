/**
 * This is a generic template for a 3D scene using Expo and Three.js.
 * To create a new example, copy this file and modify the `onContextCreate` function.
 *
 * It comes with a loading view, stats panel, and orbit controls.
 */

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
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.25,
      100
    );
    cam.position.set(7, 3, 10);
    cam.lookAt(0, 2, 0);
    cameraRef.current = cam;

    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = new THREE.Color(0xe0e0e0);
    sceneRef.current.fog = new THREE.Fog(0xe0e0e0, 20, 100);

    // lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
    hemiLight.position.set(0, 20, 0);
    sceneRef.current.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(0, 20, 10);
    sceneRef.current.add(dirLight);

    // ground
    // https://threejs.org/docs/#api/en/geometries/PlaneGeometry
    // Delete this if you don't need a ground plane
    const groundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false })
    );
    groundMesh.rotation.x = -Math.PI / 2;
    sceneRef.current.add(groundMesh);

    // grid
    // https://threejs.org/docs/#api/en/helpers/GridHelper
    // Delete this if you don't need a grid
    const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    sceneRef.current.add(grid);

    // Add the rest of your objects here:
    //

    // Start the animation loop
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
