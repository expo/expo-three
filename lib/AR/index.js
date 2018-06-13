// @flow
import THREE from '../Three';
import { AR } from 'expo';

export { default as Light } from './Light';
export { default as MagneticObject } from './MagneticObject';
export { default as Planes } from './Planes';
export { default as Points } from './Points';
export { default as ShadowFloor } from './ShadowFloor';
export { default as Camera } from './Camera';
export { default as BackgroundTexture } from './BackgroundTexture';

import {
  suppressWarnings,
  hitTestWithFeatures,
  hitTestWithPoint,
  unprojectPoint,
  hitTestRayFromScreenPos,
  hitTestFromOrigin,
  hitTestWithInfiniteHorizontalPlane,
  rayIntersectionWithHorizontalPlane,
  convertTransformArray,
  positionFromTransform,
  worldPositionFromScreenPosition,
  positionFromAnchor,
  improviseHitTest,
} from './calculations';

export {
  suppressWarnings,
  hitTestWithFeatures,
  hitTestWithPoint,
  unprojectPoint,
  hitTestRayFromScreenPos,
  hitTestFromOrigin,
  hitTestWithInfiniteHorizontalPlane,
  rayIntersectionWithHorizontalPlane,
  convertTransformArray,
  positionFromTransform,
  worldPositionFromScreenPosition,
  positionFromAnchor,
  improviseHitTest,
};
