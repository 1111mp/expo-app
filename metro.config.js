const path = require('path');

// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');
const {
  getBundleModeMetroConfig,
} = require('react-native-worklets/bundleMode');

/** @type {import('expo/metro-config').MetroConfig} */
let config = getDefaultConfig(__dirname);

config = withUniwindConfig(config, {
  // relative path to your global.css file (from previous step)
  cssEntryFile: './src/global.css',
  // (optional) path where we gonna auto-generate typings
  // defaults to project's root
  dtsFile: './src/uniwind-types.d.ts',
});

config = getBundleModeMetroConfig(config);

const uniwindDir =
  path.dirname(require.resolve('uniwind/package.json')) + path.sep;
const realReactNativePath = require.resolve('react-native');
const wrappedResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === 'react-native' &&
    typeof context.originModulePath === 'string' &&
    context.originModulePath.startsWith(uniwindDir)
  ) {
    return { type: 'sourceFile', filePath: realReactNativePath };
  }
  return (wrappedResolveRequest || context.resolveRequest)(
    context,
    moduleName,
    platform,
  );
};

module.exports = config;
