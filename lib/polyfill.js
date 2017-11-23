import 'react-native-console-time-polyfill';

// For loading complex models

window.DOMParser = window.DOMParser || require('xmldom-qsa').DOMParser;

// Ignore yellow box warnings for now since they often have to do
// with GL extensions that we know we don't support.

console.ignoredYellowBox = ['THREE.WebGLRenderer', 'THREE.WebGLProgram'];

// THREE.js tries to add some event listeners to the window, for now
// just ignore them.

if (!window.addEventListener) {
  window.addEventListener = () => {};
}
if (!console.assert) {
  console.assert = () => {};
}
