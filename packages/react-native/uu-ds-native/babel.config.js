// Chỉ dùng cho jest. App Expo / Metro biên dịch gói bằng babel của app (babel-preset-expo đã có
// plugin export-namespace-from cho `export * as tokens` trong src/index.ts).
module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: ['@babel/plugin-transform-export-namespace-from'],
};
