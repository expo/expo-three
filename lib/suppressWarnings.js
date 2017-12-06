export default shouldSuppress => {
  if (shouldSuppress) {
    global.__expo_three_oldWarn = global.__expo_three_oldWarn || console.warn;
    console.warn = str => {
      if (
        str.indexOf('THREE.WebGLRenderer') !== -1 ||
        str.indexOf('THREE.WebGLProgram') !== -1
      ) {
        // don't provide stack traces for warnspew from THREE
        console.log('Warning:', str);
        return;
      }
      return global.__expo_three_oldWarn.apply(console, [str]);
    };
  } else {
    console.warn = global.__expo_three_oldWarn;
  }
};
