import Expo from "expo";
import React from "react";
import ExpoTHREE from "expo-three";
import Touches from "../../window/Touches";
import ExpoGame from "../../expo-game";
import { Dimensions, View, Picker, PixelRatio } from "react-native";

// ExpoTHREE.utils.scaleLongestSideToSize
// ExpoTHREE.utils.alignMesh

const onProgress = function(xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = xhr.loaded / xhr.total * 100;
    console.log(Math.round(percentComplete, 2) + "% downloaded");
  }
};

/// Working!
async function loadAssimp() {
  const res = {
    "1.png": require(`./models/assimp/octaminator/1.png`),
    "1C.png": require(`./models/assimp/octaminator/1C.png`),
    "Octaminator.assimp": require(`./models/assimp/octaminator/Octaminator.assimp`)
  };

  const object = await ExpoGame.load(
    res["Octaminator.assimp"],
    onProgress,
    name => res[name]
  );
  return object;
}

/// Working! - no binary
async function loadX() {
  const res = {
    "SSR06_Born2_bp_base.png": require(`./models/xfile/texture/SSR06_Born2_bp_base.png`),
    "SSR06_Born2_dif.png": require(`./models/xfile/texture/SSR06_Born2_dif.png`),
    "SSR06_Born2.x": require(`./models/xfile/SSR06_Born2.x`)
  };

  const object = await ExpoGame.load(
    res["SSR06_Born2.x"],
    onProgress,
    name => res[name]
  );

  let models = [];
  let skeletons = [];
  let animates = [];
  let actions = {};
  for (var i = 0; i < object.FrameInfo.length; i++) {
    models.push(object.FrameInfo[i]);
    var model = models[i];

    if (model instanceof THREE.SkinnedMesh) {
      var skeletonHelper = new THREE.SkeletonHelper(model);
      skeletons.push(skeletonHelper);
      if (
        object.XAnimationObj !== undefined &&
        object.XAnimationObj.length !== 0
      ) {
        model.geometry.animations = [];
        model.geometry.animations.push(
          THREE.AnimationClip.parseAnimation(
            splitAnimation(
              object.XAnimationObj[0],
              "stand",
              10 * object.XAnimationObj[0].fps,
              11 * object.XAnimationObj[0].fps
            ),
            model.skeleton.bones
          )
        );
        model.geometry.animations.push(
          THREE.AnimationClip.parseAnimation(
            splitAnimation(
              object.XAnimationObj[0],
              "walk",
              50 * object.XAnimationObj[0].fps,
              80 * object.XAnimationObj[0].fps
            ),
            model.skeleton.bones
          )
        );
        model.geometry.animations.push(
          THREE.AnimationClip.parseAnimation(
            splitAnimation(
              object.XAnimationObj[0],
              "dash",
              140 * object.XAnimationObj[0].fps,
              160 * object.XAnimationObj[0].fps
            ),
            model.skeleton.bones
          )
        );
        model.geometry.animations.push(
          THREE.AnimationClip.parseAnimation(
            splitAnimation(
              object.XAnimationObj[0],
              "dashing",
              160 * object.XAnimationObj[0].fps,
              165 * object.XAnimationObj[0].fps
            ),
            model.skeleton.bones
          )
        );
        model.geometry.animations.push(
          THREE.AnimationClip.parseAnimation(
            splitAnimation(
              object.XAnimationObj[0],
              "damage",
              500 * object.XAnimationObj[0].fps,
              530 * object.XAnimationObj[0].fps
            ),
            model.skeleton.bones
          )
        );
        model.mixer = new THREE.AnimationMixer(model);
        animates.push(model.mixer);
        var stand = model.mixer.clipAction("stand");
        stand.setLoop(THREE.LoopRepeat);
        actions["stand"] = stand;
        var walk = model.mixer.clipAction("walk");
        walk.setLoop(THREE.LoopRepeat);
        walk.play();
        actions["walk"] = walk;
        var dash = model.mixer.clipAction("dash");
        dash.setLoop(THREE.LoopRepeat);
        actions["dash"] = dash;
        var dashing = model.mixer.clipAction("dashing");
        dashing.setLoop(THREE.LoopPingPong);
        actions["dashing"] = dashing;
        var damage = model.mixer.clipAction("damage");
        damage.setLoop(THREE.LoopRepeat);
        actions["damage"] = damage;
        // var actionKeys = Object.keys( actions );
        // var dmy = {};
        // dmy.gui = '';
        // dmy.action = '';
        // gui.add( dmy, 'action', actionKeys ).onChange( function ( v ) {
        //     animates[ 0 ].stopAllAction();
        //     actions[ v ].play();
        // });
      }
    }
  }
  // object = null;

  return { models, animates, skeletons, actions };
}

/// Working!
async function loadBasicDAE() {
  const model = {
    "Body_tex_003.jpg": require(`./models/collada/elf/Body_tex_003.jpg`),
    "Face_tex_002_toObj.jpg": require(`./models/collada/elf/Face_tex_002_toObj.jpg`),
    "Hair_tex_001.jpg": require(`./models/collada/elf/Hair_tex_001.jpg`),
    "ce.jpg": require(`./models/collada/elf/ce.jpg`),
    "elf.dae": require(`./models/collada/elf/elf.dae`)
  };

  const collada = await ExpoGame.load(
    model["elf.dae"],
    onProgress,
    name => model[name]
  );

  return collada;
}

/// Working!
async function loadRiggedDAE() {
  const model = {
    "Stormtrooper_D.jpg": require(`./models/collada/stormtrooper/Stormtrooper_D.jpg`),
    "stormtrooper.dae": require(`./models/collada/stormtrooper/stormtrooper.dae`)
  };

  const collada = await ExpoGame.load(
    model["stormtrooper.dae"],
    onProgress,
    name => model[name]
  );

  return collada;
}

/// Working!
async function load3DS() {
  const tds = {
    portalgun: require(`./models/3ds/portalgun/portalgun.3ds`),
    textures: {
      "normal.jpg": require(`./models/3ds/portalgun/textures/normal.jpg`),
      "color.jpg": require(`./models/3ds/portalgun/textures/color.jpg`)
    }
  };

  const object = await ExpoGame.load(
    tds.portalgun,
    onProgress,
    name => tds.textures[name]
  );

  const normal = await ExpoTHREE.createTextureAsync({
    asset: Expo.Asset.fromModule(tds.textures["normal.jpg"])
  });

  object.traverse(function(child) {
    if (child instanceof THREE.Mesh) {
      child.material.normalMap = normal;
    }
  });

  return object;
}

/// Working!
async function loadObjImages() {
  //https://github.com/mrdoob/three.js/blob/4e8a8c113eedc5402445de0e90cc6226c458dd01/examples/webgl_materials_channels.html
  const obj = {
    "ao.jpg": require(`./models/obj/ninja/ao.jpg`),
    "displacement.jpg": require(`./models/obj/ninja/displacement.jpg`),
    "ninjaHead_Low.obj": require(`./models/obj/ninja/ninjaHead_Low.obj`),
    "normal.jpg": require(`./models/obj/ninja/normal.jpg`)
  };

  const SCALE = 2.436143; // from original model
  const BIAS = -0.428408; // from original model

  const normalMap = await ExpoGame.load(obj["normal.jpg"]);
  const aoMap = await ExpoGame.load(obj["ao.jpg"]);
  const displacementMap = await ExpoGame.load(obj["displacement.jpg"]);

  const object = await ExpoGame.load(obj["ninjaHead_Low.obj"]);

  const materialStandard = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.5,
    roughness: 0.6,
    displacementMap: displacementMap,
    displacementScale: SCALE,
    displacementBias: BIAS,
    aoMap: aoMap,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(1, -1),
    //flatShading: true,
    side: THREE.DoubleSide
  });

  const materialDepthBasic = new THREE.MeshDepthMaterial({
    depthPacking: THREE.BasicDepthPacking,
    displacementMap: displacementMap,
    displacementScale: SCALE,
    displacementBias: BIAS,
    side: THREE.DoubleSide
  });
  const materialDepthRGBA = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking,
    displacementMap: displacementMap,
    displacementScale: SCALE,
    displacementBias: BIAS,
    side: THREE.DoubleSide
  });
  const materialNormal = new THREE.MeshNormalMaterial({
    displacementMap: displacementMap,
    displacementScale: SCALE,
    displacementBias: BIAS,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(1, -1),
    //flatShading: true,
    side: THREE.DoubleSide
  });

  const geometry = object.children[0].geometry;
  geometry.attributes.uv2 = geometry.attributes.uv;
  geometry.center();
  const mesh = new THREE.Mesh(geometry, materialStandard);
  mesh.scale.multiplyScalar(0.25);
  return mesh;
}

/// Broken - JSZip
async function load3MF() {
  const object = await ExpoGame.load(
    require("./models/3mf/cube_gears.3mf"),
    onProgress
  );

  return object;
}

/// Working!
async function loadAMF() {
  const object = await ExpoGame.load(
    require("./models/amf/rook.amf"),
    onProgress
  );

  return object;
}

/// Working!
async function loadBabylon() {
  // Usage:
  // this.scene = await loadBabylon();
  // this.camera.position.z = 100;
  // return;

  // Babylon files usually contain full scenes as opposed to single meshes
  const scene = await ExpoGame.load(
    require("./models/babylon/skull.babylon"),
    onProgress
  );

  scene.traverse(function(object) {
    if (object instanceof THREE.Mesh) {
      object.material = new THREE.MeshPhongMaterial({
        color: Math.random() * 0xffffff
      });
    }
  });

  return scene;
}

/// Broken - Missing `document.getElementsByTagName`
async function loadDraco() {
  /// https://github.com/google/draco
  /// Draco files will return a geometry, we must add it to a mesh with a material.
  const geometry = await ExpoGame.load(
    require("./models/draco/bunny.drc"),
    onProgress
  );

  geometry.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({
    vertexColors: THREE.VertexColors
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}

/// Working!
async function loadSTL(key = "binary") {
  /// This works for both `ASCII` & `Binary` `.stl` files
  /// STL files will return a geometry, we must add it to a mesh with a material.
  const binary = require("./models/stl/binary/pr2_head_pan.stl");
  const ascii = require("./models/stl/ascii/pr2_head_pan.stl");
  const models = { ascii, binary };

  const geometry = await ExpoGame.load(models[key], onProgress);

  const material = new THREE.MeshPhongMaterial({
    color: 0xff5533,
    specular: 0x111111,
    shininess: 200
  });
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

/// Working!
async function loadPLY(key = "binary") {
  /// This works for both `ASCII` & `Binary` `.ply` files
  /// PLY files will return a geometry, we must add it to a mesh with a material.

  const binary = require("./models/ply/binary/Lucy100k.ply");
  const ascii = require("./models/ply/ascii/dolphins.ply");
  const models = { binary, ascii };
  const geometry = await ExpoGame.load(models[key], onProgress);

  geometry.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({
    color: 0x0055ff,
    flatShading: true
  });
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

/// Working! ASCII format is broken - it may just be the file I'm testing with (THREE.BufferGeometry.computeBoundingSphere())
async function loadPCD(key = "binary") {
  /// This works for only `Binary` `.pcd` files - `ASCII` files don't work currently

  const binary = require("./models/pcd/binary/Zaghetto.pcd");
  const ascii = require("./models/pcd/ascii/simple.pcd");
  const models = { binary, ascii };
  const mesh = await ExpoGame.load(models[key], onProgress);

  mesh.material.color.setHex(Math.random() * 0xffffff); // Set point color
  mesh.material.size *= 2; // Make points bigger

  // mesh.material.needsUpdate = true;

  return mesh;
}

/// Broken - `msgpack` lib is a nightmare!
async function loadMSGPack() {
  const res = require("./models/pack/robo_pigeon.pack");
  const scene = await ExpoGame.load(res, onProgress);
  return scene;
}

/// Working! binary is broken :(
async function loadVTKorVTP(key = "res") {
  /// This works for `ASCII`, non compessed files, and `vtp` files
  /// Files will returned as a geometry, we must add it to a mesh with a material.
  /// binary is broken - ZLib

  const res = require("./models/vtk/bunny.vtk");
  const ascii = require("./models/vtk/cube_ascii.vtp");
  const binary = require("./models/vtk/cube_binary.vtp");
  const noncompressed = require("./models/vtk/cube_no_compression.vtp");

  const models = { res, ascii, binary, noncompressed };

  const geometry = await ExpoGame.load(models[key], onProgress);

  geometry.center();
  geometry.computeVertexNormals();
  const material = new THREE.MeshLambertMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

/// Working!
async function loadBVH() {
  const res = require("./models/bvh/pirouette.bvh");
  const { skeleton, clip } = await ExpoGame.load(res, onProgress);
  return { skeleton, clip };
}

const options = [
  {
    title: "Assimp",
    description: "",
    extensions: ["assimp", "jpg"],
    onLoad: async ({ scene }) => {
      const { object: mesh, animation } = await loadAssimp();
      scaleLongestSideToSize(mesh, 3);
      scene.add(mesh);
      this.animation = animation; // Save reference for rotation
    },
    onRender: ({ delta }) => {
      if (animation) {
        animation.setTime(Date.now() / 1000);
      }
    }
  },
  {
    title: "X",
    description: "",
    extensions: ["x", "png"],
    onLoad: async ({ scene, camera }) => {
      const { models, skeletons, animates } = await loadX();

      models.map(model => scene.add(model));
      skeletons.map(skeleton => scene.add(skeleton));
      this.animates = animates;
      camera.position.z = -20;
      camera.position.y = 15;
    },
    onRender: ({ delta }) => {
      if (this.animates) {
        for (let i = 0; i < this.animates.length; i++) {
          this.animates[i].update(delta * 1000);
        }
      }
    }
  },

  {
    title: "Collada - Skinned",
    description: "",
    extensions: ["dae", "jpg"],
    onLoad: async ({ scene }) => {
      const { scene: mesh, animations } = await loadRiggedDAE();
      scaleLongestSideToSize(mesh, 3);

      this.mixer = new THREE.AnimationMixer(mesh);
      const action = this.mixer.clipAction(animations[0]).play();
      scene.add(mesh);
      this.mesh = mesh; // Save reference for rotation
    },
    onRender: ({ delta }) => {
      if (this.mixer) {
        this.mixer.update(delta);
      }
    }
  },
  {
    title: "Collada - Basic",
    description: "",
    extensions: ["dae", "jpg"],
    onLoad: async ({ scene }) => {
      const { scene: mesh } = await loadBasicDAE();
      scaleLongestSideToSize(mesh, 3);
      alignMesh(mesh, { y: 1 });
      scene.add(mesh);

      this.mesh = mesh; // Save reference for rotation
    },
    onRender: ({ delta }) => {
      if (this.mesh) this.mesh.rotation.z += 0.4 * delta;
    }
  },
  {
    title: "3DS",
    description: "",
    extensions: ["3ds"],
    onLoad: async ({ scene }) => {
      const mesh = await load3DS();
      scaleLongestSideToSize(mesh, 3);
      alignMesh(mesh, { y: 1 });
      scene.add(mesh);

      this.mesh = mesh; // Save reference for rotation
    },
    onRender: ({ delta }) => {
      if (this.mesh) this.mesh.rotation.y += 0.4 * delta;
    }
  },
  {
    title: "BVH",
    description: "",
    extensions: ["bvh"],
    onLoad: async ({ scene }) => {
      const { clip, skeleton } = await loadBVH();
      const skeletonHelper = new THREE.SkeletonHelper(skeleton.bones[0]);
      skeletonHelper.skeleton = skeleton; // allow animation mixer to bind to SkeletonHelper directly

      const boneContainer = new THREE.Group();
      boneContainer.add(skeleton.bones[0]);

      scene.add(skeletonHelper);
      scene.add(boneContainer);

      this.mixer = new THREE.AnimationMixer(skeletonHelper);
      this.mixer
        .clipAction(clip)
        .setEffectiveWeight(1.0)
        .play();
    },
    onRender: ({ delta }) => {
      if (this.mixer) {
        this.mixer.update(delta);
      }
    }
  },
  {
    title: "OBJ with images",
    description: "",
    extensions: ["obj", "jpg"],
    onLoad: async ({ scene }) => {
      const mesh = await loadObjImages();
      scaleLongestSideToSize(mesh, 1);
      alignMesh(mesh, { y: 1 });
      scene.add(mesh);

      this.mesh = mesh; // Save reference for rotation
    },
    onRender: ({ delta }) => {
      if (this.mesh) this.mesh.rotation.y += 0.4 * delta;
    }
  },
  {
    title: "PCD - binary",
    description: "",
    extensions: ["pcd"],
    onLoad: async ({ scene }) => {
      const mesh = await loadPCD("binary");
      scaleLongestSideToSize(mesh, 3);

      mesh.rotation.x = Math.PI;
      mesh.rotation.y = Math.PI;

      alignMesh(mesh, { y: 1, x: 0, z: 0 });
      scene.add(mesh);

      this.mesh = mesh; // Save reference for rotation
    }
  },
  {
    title: "AMF",
    description: "",
    extensions: ["amf"],
    onLoad: async ({ scene }) => {
      const mesh = await loadAMF();
      scaleLongestSideToSize(mesh, 3);
      alignMesh(mesh, { y: 1 });
      scene.add(mesh);
      mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2);

      this.mesh = mesh; // Save reference for rotation
    },
    onRender: ({ delta }) => {
      if (this.mesh) this.mesh.rotation.z += 0.4 * delta;
    }
  },
  {
    title: "Babylon",
    description: "",
    extensions: ["babylon"],
    onLoad: async scope => {
      scope.scene = await loadBabylon();
      scope.camera.position.z = 100;
    }
  },
  {
    title: "STL - ascii",
    description: "",
    extensions: ["stl"],
    onLoad: async ({ scene }) => {
      const mesh = await loadSTL("ascii");
      scaleLongestSideToSize(mesh, 3);
      alignMesh(mesh, { y: 1 });
      scene.add(mesh);
      this.mesh = mesh; // Save reference for rotation
    },
    onRender: ({ delta }) => {
      if (this.mesh) this.mesh.rotation.y += 0.4 * delta;
    }
  },
  {
    title: "STL - binary",
    description: "",
    extensions: ["stl"],
    onLoad: async ({ scene }) => {
      const mesh = await loadSTL("binary");
      scaleLongestSideToSize(mesh, 3);
      alignMesh(mesh, { y: 1 });
      scene.add(mesh);
      this.mesh = mesh; // Save reference for rotation
    },
    onRender: ({ delta }) => {
      if (this.mesh) this.mesh.rotation.y += 0.4 * delta;
    }
  },
  {
    title: "PLY - ascii",
    description: "",
    extensions: ["ply"],
    onLoad: async ({ scene }) => {
      const mesh = await loadPLY("ascii");
      scaleLongestSideToSize(mesh, 3);
      alignMesh(mesh, { y: 1 });
      scene.add(mesh);
      this.mesh = mesh; // Save reference for rotation
    },
    onRender: ({ delta }) => {
      if (this.mesh) this.mesh.rotation.y += 0.4 * delta;
    }
  },
  {
    title: "PLY - binary",
    description: "",
    extensions: ["ply"],
    onLoad: async ({ scene }) => {
      const mesh = await loadPLY("binary");
      scaleLongestSideToSize(mesh, 3);
      alignMesh(mesh, { y: 1 });
      scene.add(mesh);
      this.mesh = mesh; // Save reference for rotation
    },
    onRender: ({ delta }) => {
      if (this.mesh) this.mesh.rotation.y += 0.4 * delta;
    }
  },

  {
    title: "VTP - non compessed",
    description: "",
    extensions: ["vtp"],
    onLoad: async ({ scene }) => {
      const mesh = await loadVTKorVTP("noncompressed");
      scaleLongestSideToSize(mesh, 3);
      alignMesh(mesh, { y: 1 });
      scene.add(mesh);
      this.mesh = mesh; // Save reference for rotation
    },
    onRender: ({ delta }) => {
      if (this.mesh) this.mesh.rotation.y += 0.4 * delta;
    }
  },
  {
    title: "VTP - ascii",
    description: "",
    extensions: ["vtp"],
    onLoad: async ({ scene }) => {
      const mesh = await loadVTKorVTP("ascii");
      scaleLongestSideToSize(mesh, 3);
      alignMesh(mesh, { y: 1 });
      scene.add(mesh);
      this.mesh = mesh; // Save reference for rotation
    },
    onRender: ({ delta }) => {
      if (this.mesh) this.mesh.rotation.y += 0.4 * delta;
    }
  },

  {
    title: "VTK",
    description: "",
    extensions: ["vtk"],
    onLoad: async ({ scene }) => {
      const mesh = await loadVTKorVTP();
      scaleLongestSideToSize(mesh, 3);
      alignMesh(mesh, { y: 1 });
      scene.add(mesh);
      this.mesh = mesh; // Save reference for rotation
    },
    onRender: ({ delta }) => {
      if (this.mesh) this.mesh.rotation.y += 0.4 * delta;
    }
  }
];

class Scene extends React.Component {
  options = [...options];
  state = {
    optionIndex: 0
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ExpoGame.View
          key={this.state.optionIndex}
          style={{ flex: 1 }}
          onContextCreate={this.onContextCreate}
          onRender={this.onRender}
          onResize={this.onResize}
          enableAR={false}
        />
        <Picker
          selectedValue={this.state.optionIndex}
          onValueChange={(itemValue, itemIndex) => {
            this.options = [...options];
            this.setState({ optionIndex: itemIndex });
          }}
        >
          {options.map((val, index) => (
            <Picker.Item label={val.title} key={index} value={index} />
          ))}
        </Picker>
      </View>
    );
  }

  onContextCreate = async (gl, arSession) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const { scale } = Dimensions.get("window");

    // renderer
    this.renderer = ExpoTHREE.createRenderer({
      gl
      // precision: "highp"
    });
    this.renderer.capabilities.maxVertexUniforms = 52502;

    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width / scale, height / scale);
    this.renderer.setClearColor(0x000000, 1.0);

    this.setupScene(width / scale, height / scale, arSession);
    this.setupLights();
    await this.loadModelsAsync();
  };

  setupScene = (width, height, arSession) => {
    // scene
    this.scene = new THREE.Scene();

      // Standard Background
      this.scene.background = new THREE.Color(0x999999);
      this.scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

      /// Standard Camera
      this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 10000);
      this.camera.position.set(0, 6, -12);

      // controls
      this.controls = new THREE.OrbitControls(this.camera);

    const grid = new THREE.GridHelper(50, 50, 0xffffff, 0x555555);
    this.scene.add(grid);
  };

  setupLights = () => {
    // lights
    const directionalLightA = new THREE.DirectionalLight(0xffffff);
    directionalLightA.position.set(1, 1, 1);
    this.scene.add(directionalLightA);

    const directionalLightB = new THREE.DirectionalLight(0xffeedd);
    directionalLightB.position.set(-1, -1, -1);
    this.scene.add(directionalLightB);

    const ambientLight = new THREE.AmbientLight(0x222222);
    this.scene.add(ambientLight);
  };

  loadModelsAsync = async () => {
    await this.options[this.state.optionIndex].onLoad(this);
  };

  onResize = ({ width, height }) => {
    const scale  = PixelRatio.get();

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  onRender = delta => {
    const { scene, renderer, mixer, camera } = this;
    const option = this.options[this.state.optionIndex];
    option.onRender &&
      option.onRender({ scene, renderer, mixer, camera, delta });
      
    this.renderer.render(this.scene, this.camera);
  };
}

export default Touches(Scene);

function splitAnimation(_baseAnime, _name, _beginTime, _endTime) {
  var animation = {};
  animation.fps = _baseAnime.fps;
  animation.name = _name;
  animation.length = _endTime - _beginTime;
  animation.hierarchy = [];
  for (var i = 0; i < _baseAnime.hierarchy.length; i++) {
    var firstKey = -1;
    var lastKey = -1;
    var frame = {};
    frame.name = _baseAnime.hierarchy[i].name;
    frame.parent = _baseAnime.hierarchy[i].parent;
    frame.keys = [];
    for (var m = 1; m < _baseAnime.hierarchy[i].keys.length; m++) {
      if (_baseAnime.hierarchy[i].keys[m].time > _beginTime) {
        if (firstKey === -1) {
          firstKey = m - 1;
          frame.keys.push(_baseAnime.hierarchy[i].keys[m - 1]);
        }
        frame.keys.push(_baseAnime.hierarchy[i].keys[m]);
      }
      if (
        _endTime <= _baseAnime.hierarchy[i].keys[m].time ||
        m >= _baseAnime.hierarchy[i].keys.length - 1
      ) {
        break;
      }
    }
    for (var m = 0; m < frame.keys.length; m++) {
      frame.keys[m].time -= _beginTime;
    }
    animation.hierarchy.push(frame);
  }
  return animation;
}
