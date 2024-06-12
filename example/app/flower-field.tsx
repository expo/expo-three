// Fast refresh doesn't work very well with GLViews.
// Always reload the entire component when the file changes:
// https://reactnative.dev/docs/fast-refresh#fast-refresh-and-hooks
// @refresh reset

import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { loadAsync, Renderer } from 'expo-three';
import * as THREE from 'three';
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

    clockRef.current = new THREE.Clock();

    // lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
    hemiLight.position.set(0, 20, 0);
    sceneRef.current.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(0, 20, 10);
    sceneRef.current.add(dirLight);

    // ground
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false })
    );
    mesh.rotation.x = -Math.PI / 2;
    sceneRef.current.add(mesh);

    const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    sceneRef.current.add(grid);

    // load GLB model
    const model = await loadAsync(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Flower/Flower.glb'
    );

    // Loop through 500 instances of the model and add it to the scene:
    const LOOPS = 500;
    for (let i = 0; i < LOOPS; i++) {
      const instance = model.scene.clone();

      // Calculate the hue value for the rainbow effect
      const hue = i / LOOPS;

      // Change the color of the flower
      instance.traverse((object: THREE.Mesh) => {
        if (object.isMesh && object.name === 'Blossom') {
          const material = new THREE.MeshStandardMaterial();
          material.color.setHSL(hue, 1, 0.5); // Full saturation and 50% lightness for vivid colors
          object.material = material;
        }
      });

      instance.scale.setScalar(2);
      // Start in the center and then plot the flowers in a spiral pattern
      const angle = i * 0.1;
      const z = Math.sin(angle) * i * 0.1 * 0.2;
      const x = Math.cos(angle) * i * 0.1 * 0.2;
      instance.position.set(x, 0, z);
      sceneRef.current.add(instance);
    }

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
