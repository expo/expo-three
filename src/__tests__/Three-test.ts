import '..';

import { Platform } from '@unimodules/core';

declare var THREE: any;
declare var __expo_three_oldWarn: any;

it(`defines a global instance of three.js`, () => {
  expect(THREE).toBeDefined();
});

it(`has a custom method for muting warnings`, () => {
  expect(THREE.suppressExpoWarnings).toBeDefined();
});

it(`THREE.suppressExpoWarnings is invoked on import`, () => {
  if (Platform.OS === 'web') {
    // @ts-ignore
    expect(global.__expo_three_oldWarn).not.toBeDefined();
  } else {
    expect(__expo_three_oldWarn).toBeDefined();
  }
});
