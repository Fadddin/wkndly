/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
  },
}

module.exports = config


