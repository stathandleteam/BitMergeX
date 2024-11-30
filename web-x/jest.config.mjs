// export default {
//   preset: "ts-jest/presets/js-with-ts",
//   testEnvironment: "jest-environment-jsdom",
//   moduleNameMapper: {
//     "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
//     "\\.(css|less|scss)$": "identity-obj-proxy", // Use identity-obj-proxy for SCSS files
//   },
//   modulePaths: ["<rootDir>/src"],

// };

// jest.config.js
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // moduleNameMapper: {
  //   '\\.scss$': 'identity-obj-proxy',
  //   '^@/(.*)$': '<rootDir>/src/$1'
  // },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
  "moduleNameMapper": {
    "\\.(scss|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": 'identity-obj-proxy',
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js"
  },
  "modulePaths": [
    "<rootDir>/src"
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

