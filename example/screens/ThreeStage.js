import ExpoTHREE, { THREE } from 'expo-three';

class ThreeStage {
  constructor() {
    this.onRender = this.onRender.bind(this);
    this.setupControls = this.setupControls.bind(this);
  }
  onContextCreate = async ({
    gl,
    canvas,
    width,
    height,
    scale: pixelRatio,
  }) => {
    this.gl = gl;
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.pixelRatio = pixelRatio;
    await this.setupAsync();
  };

  setupAsync = async () => {
    const { gl, canvas, width, height, pixelRatio } = this;
    await this.setupRenderer({ gl, canvas, width, height, pixelRatio });
    await this.setupScene();
    await this.setupCamera({ width, height });
    await this.setupLights();
    await this.setupModels();
    await this.setupControls();
  };

  setupControls() {
    new THREE.OrbitControls(this.camera);
  }

  setupRenderer = props => {
    this.renderer = new ExpoTHREE.Renderer(props);
    this.renderer.capabilities.maxVertexUniforms = 52502;
  };

  setupCamera = ({ width, height }) => {
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 10000);
    this.camera.position.set(0, 6, 12);
    this.camera.lookAt(0, 0, 0);
  };

  setupScene = () => {
    this.scene = new THREE.Scene();

    this.scene.background = new THREE.Color(0x999999);
    this.scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

    this.scene.add(new THREE.GridHelper(50, 50, 0xffffff, 0x555555));
  };

  setupLights = () => {
    const directionalLightA = new THREE.DirectionalLight(0xffffff);
    directionalLightA.position.set(1, 1, 1);
    this.scene.add(directionalLightA);

    const directionalLightB = new THREE.DirectionalLight(0xffeedd);
    directionalLightB.position.set(-1, -1, -1);
    this.scene.add(directionalLightB);

    const ambientLight = new THREE.AmbientLight(0x222222);
    this.scene.add(ambientLight);
  };

  async setupModels() {}

  onResize = ({ width, height, scale }) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
    this.width = width;
    this.height = height;
    this.pixelRatio = scale;
  };

  onRender(delta) {
    this.renderer.render(this.scene, this.camera);
  }
}

export default ThreeStage;
