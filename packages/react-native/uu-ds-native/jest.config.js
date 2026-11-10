/** Test hành vi component RN: `npm test` trong packages/react-native/uu-ds-native. */
module.exports = {
  preset: '@react-native/jest-preset',
  testMatch: ['<rootDir>/__tests__/**/*.test.tsx'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-svg|react-native-safe-area-context|@testing-library)/)',
  ],
};
