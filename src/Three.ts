import * as THREE from 'three';

import suppressMetroWarnings from './suppressWarnings';

declare let global: any;

global.THREE = global.THREE || THREE;

// @ts-ignore
global.THREE['suppressExpoWarnings'] = suppressMetroWarnings;
// @ts-ignore
global.THREE['suppressMetroWarnings'] = suppressMetroWarnings;

export default THREE;
