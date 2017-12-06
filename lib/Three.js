const THREE = (global.THREE = global.THREE || require('three'));

// Ignore yellow box warnings for now since they often have to do
// with GL extensions that we know we don't support.

global.THREE.suppressExpoWarnings = require('./suppressWarnings');
global.THREE.suppressExpoWarnings(true);

export default THREE;
