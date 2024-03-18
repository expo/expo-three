import { Platform } from 'expo-modules-core';

declare let global: {
  THREE: any;
  __expo_three_oldWarn: any;
};

// Mock the Loader classes:
const loaders = ['ColladaLoader', 'MTLLoader', 'OBJLoader', 'GLTFLoader'];
for (const loader of loaders) {
  jest.mock(`three/examples/jsm/loaders/${loader}`, () => ({
    default: jest.fn(),
  }));
}
jest.mock(`@expo/browser-polyfill`, () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

it(`defines a global instance of three.js`, async () => {
  expect(global.THREE).not.toBeDefined();

  await import('..');

  expect(global.THREE).toBeDefined();
  expect(global.THREE.suppressMetroWarnings).toBeDefined();
  if (Platform.OS === 'web') {
    // @ts-ignore
    expect(global.__expo_three_oldWarn).not.toBeDefined();
  } else {
    expect(global.__expo_three_oldWarn).toBeDefined();
  }
});
