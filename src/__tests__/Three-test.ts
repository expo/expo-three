import '..';

declare var THREE: any;
declare var __expo_three_oldWarn: any;

it(`defines a global instance of three.js`, () => {
  expect(THREE).toBeDefined();
});

it(`has a custom method for muting warnings`, () => {
  expect(THREE.suppressExpoWarnings).toBeDefined();
});

it(`THREE.suppressExpoWarnings is invoked on import`, () => {
  expect(__expo_three_oldWarn).toBeDefined();
});
