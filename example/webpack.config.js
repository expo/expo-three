const createConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async (env, argv) => {
  const config = await createConfigAsync(env, argv);
  config.resolve.modules = [
    path.resolve(__dirname, './node_modules'),
    path.resolve(__dirname, '../node_modules'),
  ];
  config.resolve.fallback = {
    'expo-three': path.resolve(__dirname, '../build'),
  };

  return config;
};
