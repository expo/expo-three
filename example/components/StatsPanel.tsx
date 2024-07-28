import React, { useCallback, useRef, useState } from 'react';
import { Text, View, ViewProps } from 'react-native';

import { THREE } from 'expo-three';

/**
 * Custom hook that provides scene statistics and FPS calculation for a THREE.js scene.
 * @returns An object containing the StatsPanel component, calculateSceneStats function, and mark function.
 *
 * To use this:
 *
 * 1. Add the hook to your component:
 *
 * const { StatsPanel, calculateSceneStats, mark } = useSceneStats();
 *
 * 2. Add the calculateSceneStates function to your onRender function:
 *
 * const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
 *  // setup your scene.
 *  // ...
 *
 *  // Animate the scene:
 *  function animate() {
 *    timeoutRef.current = requestAnimationFrame(animate);
 *
 *    // FPS counter
 *    mark(); <-- add this line
 *
 *    renderer.render(scene, camera);
 *    }
 *    gl.endFrameEXP();
 *  }
 *  animate();
 *
 *  // Calculate the objects, vertices, and triangles in the scene
 *  calculateSceneStats(sceneRef.current);
 * }
 *
 * 3. Add the StatsPanel component to your JSX:
 *
 * <View style={{ flex: 1 }}>
 *   <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
 *   <StatsPanel />
 * </View>
 */
export const useSceneStats = () => {
  const [sceneStats, setSceneStats] = useState({
    objects: 0,
    vertices: 0,
    triangles: 0,
  });
  const [currentFPS, setCurrentFPS] = useState(0);

  const framesRef = useRef(0);
  const prevTimeRef = useRef(performance.now());

  /**
   * Function to mark the frame and calculate the FPS.
   */
  const mark = useCallback(() => {
    framesRef.current++;
    const time = performance.now();
    if (time >= prevTimeRef.current + 1000) {
      const fps = Math.round(
        (framesRef.current * 1000) / (time - prevTimeRef.current)
      );
      setCurrentFPS(fps);

      framesRef.current = 0;
      prevTimeRef.current = time;
    }
  }, []);

  /**
   * Function to calculate the scene statistics.
   * @param scene - The THREE.js scene.
   */
  const calculateSceneStats = useCallback((scene: THREE.Scene) => {
    let objects = 0,
      vertices = 0,
      triangles = 0;

    for (let i = 0, l = scene.children.length; i < l; i++) {
      const object = scene.children[i];

      object.traverseVisible(function (object: any) {
        objects++;

        if (object.isMesh || object.isPoints) {
          const geometry = object.geometry;

          vertices += geometry.attributes.position.count;

          if (object.isMesh) {
            if (geometry.index !== null) {
              triangles += geometry.index.count / 3;
            } else {
              triangles += geometry.attributes.position.count / 3;
            }
          }
        }
      });
    }
    setSceneStats({ objects, vertices, triangles });
  }, []);

  /**
   * Component that displays the scene statistics and FPS.
   * @param props - The props for the View component.
   * @returns The StatsPanel component.
   */
  const StatsPanel = useCallback(
    (props: ViewProps) => {
      return (
        <View {...props}>
          {(sceneStats.objects > 0 ||
            sceneStats.vertices > 0 ||
            sceneStats.triangles > 0) && (
            <>
              <Text>Objects: {sceneStats.objects}</Text>
              <Text>Vertices: {sceneStats.vertices}</Text>
              <Text>Triangles: {sceneStats.triangles}</Text>
            </>
          )}
          <Text>FPS: {currentFPS}</Text>
        </View>
      );
    },
    [sceneStats, currentFPS]
  );

  return __DEV__
    ? { StatsPanel, calculateSceneStats, mark }
    : {
        StatsPanel: () => <></>,
        calculateSceneStats: (_scene: THREE.Scene) => null,
        mark: () => null,
      };
};
