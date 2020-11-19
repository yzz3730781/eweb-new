module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json' ],
  transform: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '^.+\\.(js|jsx)?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [
    '<rootDir>/(tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx))',
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  testPathIgnorePatterns: [
    "authority.test.js",
    "config.test.js",
    "CheckPermissions.test.js",
    "PageHeader/index.test.js",
    "Ellipsis/index.test.js",
    "AvatarList/index.test.js",
  ],


};
