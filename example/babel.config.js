/** @type {import('@babel/core').TransformOptions['plugins']} */
const plugins = [
  // This plugin is necessary to resolve the expo-three alias to the local folder.
  [
    'babel-plugin-module-resolver',
    {
      alias: {
        'expo-three': '../build',
      },
    },
  ],
];

/** @type {import('@babel/core').TransformOptions} */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    env: {
      production: {},
    },
    plugins,
  };
};
