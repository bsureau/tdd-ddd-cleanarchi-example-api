import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^.+\\.(css|less|gif|jpg|jpeg|svg|png)$': 'module.exports = {};',
        '^@core-logic/(.*)$': '<rootDir>/core-logic/$1',
        '^@adapters/(.*)$': '<rootDir>/adapters/$1',
    },
};
export default jestConfig;
