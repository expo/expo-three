/* eslint-env node */
/* eslint-disable import/no-extraneous-dependencies */

const escape = require('escape-string-regexp');
const fs = require('fs');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pak = JSON.parse(
  fs.readFileSync(path.join(root, 'package.json'), 'utf8')
);

const modules = [
  '@babel/runtime',
  '@expo/vector-icons',
  ...Object.keys({
    ...pak.dependencies,
    ...pak.peerDependencies,
  }),
];

module.exports = {
  projectRoot: __dirname,
  watchFolders: [root],

  resolver: {
    assetExts: ['db', 'mp3', 'ttf', 'obj', 'mtl', 'png', 'jpg'],
    blacklistRE: exclusionList([
      new RegExp(`^${escape(path.join(root, 'node_modules'))}\\/.*$`),
    ]),

    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),
  },

  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
