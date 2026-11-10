// Dùng thẳng mã nguồn ../uu-ds-native (không build). React / RN chỉ lấy một bản từ node_modules của app mẫu.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const pkg = path.resolve(__dirname, '../uu-ds-native');
const config = getDefaultConfig(__dirname);
config.watchFolders = [pkg];
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];
config.resolver.extraNodeModules = { 'uu-ds-native': pkg };
config.resolver.blockList = [new RegExp(`${pkg.replace(/[/\\.]/g, '\\$&')}/node_modules/.*`)];
module.exports = config;
