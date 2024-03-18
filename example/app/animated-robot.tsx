import React, { useEffect, useRef, useState } from 'react';
import { Button, View } from 'react-native';

import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { loadAsync, Renderer } from 'expo-three';
import * as THREE from 'three';
import { LoadingView } from '../components/LoadingView';
import { Picker } from '@react-native-picker/picker';

/*

This 'Animated Robot' scene is a port of the official Three.js example:
https://threejs.org/examples/#webgl_animation_skinning_morph

*/

const ANIMATION_STATES = [
  'Idle',
  'Walking',
  'Running',
  'Dance',
  'Death',
  'Sitting',
  'Standing',
];
const EMOTES = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];

export default function ThreeScene() {
  const [isLoading, setIsLoading] = useState(true);
  const [animatedState, setAnimatedState] = useState(ANIMATION_STATES[0]);
  const [actions, setActions] = useState<Record<string, any>>({});

  function fadeToAction(name: string, duration: number) {
    const previousAction = actions[animatedState]; // grab our previous action before we update state to the new one
    const activeAction = actions[name];

    if (previousAction !== activeAction) {
      previousAction.fadeOut(duration).stop();
    }

    setAnimatedState(name);

    activeAction
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .fadeIn(duration)
      .play();
  }

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
    let camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.25,
      100
    );
    camera.position.z = 5;
    camera.position.set(-5, 3, 10);
    camera.lookAt(0, 2, 0);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe0e0e0);
    scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);

    const clock = new THREE.Clock();

    // lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(0, 20, 10);
    scene.add(dirLight);

    // ground
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false })
    );
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);

    const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);

    // load GLB model
    const model = await loadAsync(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/RobotExpressive/RobotExpressive.glb'
    );
    scene.add(model.scene);

    const mixer = new THREE.AnimationMixer(model.scene);
    const animations = model.animations;

    for (let i = 0; i < animations.length; i++) {
      const clip = animations[i];
      const action = mixer.clipAction(clip);
      actions[clip.name] = action;

      if (
        EMOTES.indexOf(clip.name) >= 0 ||
        ANIMATION_STATES.indexOf(clip.name) >= 4
      ) {
        action.clampWhenFinished = true;
        action.loop = THREE.LoopOnce;
      }
    }

    setActions(actions);

    const startingAction = actions[animatedState];
    if (!startingAction) {
      console.warn('Starting action not found');
    }

    startingAction.play();

    function animate() {
      const dt = clock.getDelta();

      if (mixer) mixer.update(dt);

      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    }
    animate();

    setIsLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
      {isLoading && <LoadingView />}
      {!isLoading && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
          <Picker
            selectedValue={animatedState}
            onValueChange={(itemValue, itemIndex) =>
              fadeToAction(itemValue, 0.5)
            }
            style={{ backgroundColor: 'white' }}
          >
            {ANIMATION_STATES.map((state) => (
              <Picker.Item key={state} label={state} value={state} />
            ))}
          </Picker>
        </View>
      )}
    </View>
  );
}
