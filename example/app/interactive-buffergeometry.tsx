// Fast refresh doesn't work very well with GLViews.
// Always reload the entire component when the file changes:
// https://reactnative.dev/docs/fast-refresh#fast-refresh-and-hooks
// @refresh reset

// This is an implementation of the official Three.js example:
// https://threejs.org/examples/#webgl_interactive_buffergeometry

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
      27,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      1,
      3500
    );
    cam.position.z = 2750;
    cameraRef.current = cam;

    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = new THREE.Color(0x050505);

    // lights
    const hemiLight = new THREE.AmbientLight(0x444444, 3);
    hemiLight.position.set(0, 20, 0);
    sceneRef.current.add(hemiLight);

    const light1 = new THREE.DirectionalLight(0xffffff, 1.5);
    light1.position.set(1, 1, 1);
    sceneRef.current.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 4.5);
    light2.position.set(0, -1, 0);
    sceneRef.current.add(light2);

    const triangles = 5000;

    let geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(triangles * 3 * 3);
    const normals = new Float32Array(triangles * 3 * 3);
    const colors = new Float32Array(triangles * 3 * 3);

    const color = new THREE.Color();

    const n = 800,
      n2 = n / 2; // triangles spread in the cube
    const d = 120,
      d2 = d / 2; // individual triangle size

    const pA = new THREE.Vector3();
    const pB = new THREE.Vector3();
    const pC = new THREE.Vector3();

    const cb = new THREE.Vector3();
    const ab = new THREE.Vector3();

    for (let i = 0; i < positions.length; i += 9) {
      // positions

      const x = Math.random() * n - n2;
      const y = Math.random() * n - n2;
      const z = Math.random() * n - n2;

      const ax = x + Math.random() * d - d2;
      const ay = y + Math.random() * d - d2;
      const az = z + Math.random() * d - d2;

      const bx = x + Math.random() * d - d2;
      const by = y + Math.random() * d - d2;
      const bz = z + Math.random() * d - d2;

      const cx = x + Math.random() * d - d2;
      const cy = y + Math.random() * d - d2;
      const cz = z + Math.random() * d - d2;

      positions[i] = ax;
      positions[i + 1] = ay;
      positions[i + 2] = az;

      positions[i + 3] = bx;
      positions[i + 4] = by;
      positions[i + 5] = bz;

      positions[i + 6] = cx;
      positions[i + 7] = cy;
      positions[i + 8] = cz;

      // flat face normals

      pA.set(ax, ay, az);
      pB.set(bx, by, bz);
      pC.set(cx, cy, cz);

      cb.subVectors(pC, pB);
      ab.subVectors(pA, pB);
      cb.cross(ab);

      cb.normalize();

      const nx = cb.x;
      const ny = cb.y;
      const nz = cb.z;

      normals[i] = nx;
      normals[i + 1] = ny;
      normals[i + 2] = nz;

      normals[i + 3] = nx;
      normals[i + 4] = ny;
      normals[i + 5] = nz;

      normals[i + 6] = nx;
      normals[i + 7] = ny;
      normals[i + 8] = nz;

      // colors

      const vx = x / n + 0.5;
      const vy = y / n + 0.5;
      const vz = z / n + 0.5;

      color.setRGB(vx, vy, vz);

      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;

      colors[i + 3] = color.r;
      colors[i + 4] = color.g;
      colors[i + 5] = color.b;

      colors[i + 6] = color.r;
      colors[i + 7] = color.g;
      colors[i + 8] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    geometry.computeBoundingSphere();

    let material = new THREE.MeshPhongMaterial({
      color: 0xaaaaaa,
      specular: 0xffffff,
      shininess: 250,
      side: THREE.DoubleSide,
      vertexColors: true,
    });

    let mesh = new THREE.Mesh(geometry, material);
    sceneRef.current.add(mesh);

    const raycaster = new THREE.Raycaster();

    const pointer = new THREE.Vector2();

    geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(4 * 3), 3)
    );

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
    });

    const line = new THREE.Line(geometry, lineMaterial);
    sceneRef.current.add(line);

    function animate() {
      timeoutRef.current = requestAnimationFrame(animate);

      // FPS counter
      mark();

      if (cameraRef.current && sceneRef.current) {
        const time = Date.now() * 0.001;

        mesh.rotation.x = time * 0.15;
        mesh.rotation.y = time * 0.25;

        raycaster.setFromCamera(pointer, cameraRef.current);

        const intersects = raycaster.intersectObject(mesh);

        if (intersects.length > 0) {
          const intersect = intersects[0];
          const face = intersect.face;

          const linePosition = line.geometry.attributes.position;
          const meshPosition = mesh.geometry.attributes.position;

          linePosition.copyAt(0, meshPosition, face.a);
          linePosition.copyAt(1, meshPosition, face.b);
          linePosition.copyAt(2, meshPosition, face.c);
          linePosition.copyAt(3, meshPosition, face.a);

          mesh.updateMatrix();

          line.geometry.applyMatrix4(mesh.matrix);

          line.visible = true;
        } else {
          line.visible = false;
        }
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
