import '..';

declare var THREE: any;

it('defines a global instance of three.js', () => {
  expect(THREE).toBeDefined();
});

it('has a custom method for muting warnings', () => {
  expect(THREE.suppressExpoWarnings).toBeDefined();
});
