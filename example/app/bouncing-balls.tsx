// Fast refresh doesn't work very well with GLViews.
// Always reload the entire component when the file changes:
// https://reactnative.dev/docs/fast-refresh#fast-refresh-and-hooks
// @refresh reset

import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import * as ImagePicker from 'expo-image-picker';
import { Renderer, THREE, TextureLoader } from 'expo-three';
import OrbitControlsView from 'expo-three-orbit-controls';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, ViewStyle } from 'react-native';

import { LoadingView } from '../components/LoadingView';
import { useSceneStats } from '../components/StatsPanel';

export default function ThreeScene() {
  const [isLoading, setIsLoading] = useState(true);
  const [ballCount, setBallCount] = useState(1);
  const cameraRef = useRef<THREE.Camera>();
  const [image, setImage] = useState<string | null>(null);

  const { calculateSceneStats, StatsPanel, mark } = useSceneStats();

  const timeoutRef = useRef<number>();
  const ballsRef = useRef<THREE.Mesh[]>([]);
  const sceneRef = useRef<THREE.Scene>();
  const clockRef = useRef<THREE.Clock>();

  useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // Asks the user to pick a photo from their library
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Use a memoized material for the balls: either a color or an image
  const ballMaterial = useMemo(() => {
    const texture = image
      ? new TextureLoader().load(
          image,
          (t) => console.log(t),
          (event: ProgressEvent) => console.log('event:', event),
          (error) => console.log('error:', error)
        )
      : null;
    const ballMaterial = new THREE.MeshLambertMaterial({
      map: texture,
      color: 0xcccccc,
    });
    return ballMaterial;
  }, [image]);

  useEffect(() => {
    if (sceneRef.current) {
      updateBalls();
    }
  }, [ballCount, ballMaterial]);

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
    const cam = new THREE.PerspectiveCamera(
      80,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      100
    );
    cam.position.set(3, 7, 3);
    cameraRef.current = cam;

    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = new THREE.Color(0xe0e0e0);

    // lights
    const ambientLight = new THREE.AmbientLight(0xcccccc);
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight.position.set(0, 5, 5);
    sceneRef.current.add(directionalLight);

    const d = 5;
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;

    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 20;

    directionalLight.shadow.mapSize.x = 1024;
    directionalLight.shadow.mapSize.y = 1024;

    // ground
    // https://threejs.org/docs/#api/en/geometries/PlaneGeometry
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x4676b6 });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI * -0.5;
    floor.receiveShadow = true;
    sceneRef.current.add(floor);

    // Add the rest of your objects here:
    //
    updateBalls();

    // Start the animation loop
    function animate() {
      timeoutRef.current = requestAnimationFrame(animate);

      // FPS counter
      mark();

      const time = clockRef.current?.getElapsedTime();
      if (time && cameraRef.current && sceneRef.current) {
        ballsRef.current.forEach((ball, i) => {
          const previousHeight = ball.position.y;
          ball.position.y = Math.abs(Math.sin(i * 0.5 + time * 2.5) * 3);

          if (ball.position.y < previousHeight) {
            ball.userData.down = true;
          } else {
            if (ball.userData.down === true) {
              // ball changed direction from down to up
              ball.userData.down = false;
            }
          }
        });

        renderer.render(sceneRef.current, cameraRef.current);
      }
      gl.endFrameEXP();
    }
    animate();

    setIsLoading(false);

    // Calculate the objects, vertices, and triangles in the scene
    calculateSceneStats(sceneRef.current);
  };

  const updateBalls = () => {
    const radius = 3;
    const ballGeometry = new THREE.SphereGeometry(0.3, 32, 16);
    ballGeometry.translate(0, 0.3, 0);

    // Add new balls if ballCount increased
    while (ballsRef.current.length < ballCount) {
      const ball = new THREE.Mesh(ballGeometry, ballMaterial);
      ball.castShadow = true;
      ball.userData.down = false;

      sceneRef.current?.add(ball);
      ballsRef.current.push(ball);
    }

    // Remove excess balls if ballCount decreased
    while (ballsRef.current.length > ballCount) {
      const ball = ballsRef.current.pop();
      ball && sceneRef.current?.remove(ball);
    }

    // Update positions of all balls
    for (let i = 0; i < ballsRef.current.length; i++) {
      const s = (i / ballsRef.current.length) * Math.PI * 2;
      const ball = ballsRef.current[i];

      ball.position.x = radius * Math.cos(s);
      ball.position.z = radius * Math.sin(s);

      if (ball.material !== ballMaterial) {
        ball.material = ballMaterial;
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <OrbitControlsView style={{ flex: 1 }} camera={cameraRef.current}>
        <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
      </OrbitControlsView>
      <Text>Ball count: {ballCount}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Pressable
          onPress={image ? () => setImage(null) : pickImage}
          style={$button}
        >
          <Text>{image ? 'Clear Image' : 'Pick Image'}</Text>
        </Pressable>
        <Pressable onPress={() => setBallCount(ballCount + 1)} style={$button}>
          <Text>Add ball</Text>
        </Pressable>
        <Pressable
          onPress={() => setBallCount(ballCount > 0 ? ballCount - 1 : 0)}
          style={$button}
        >
          <Text>Remove ball</Text>
        </Pressable>
      </View>
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

const $button: ViewStyle = {
  padding: 10,
  margin: 10,
  backgroundColor: 'lightblue',
  borderRadius: 5,
};
