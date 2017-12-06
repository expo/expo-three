import 'react-native-console-time-polyfill';

// For loading complex models

window.DOMParser = window.DOMParser || require('xmldom-qsa').DOMParser;

// THREE.js tries to add some event listeners to the window, for now
// just ignore them.

if (!window.addEventListener) {
  window.addEventListener = () => {};
}
if (!console.assert) {
  console.assert = () => {};
}
