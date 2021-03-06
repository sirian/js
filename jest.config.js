module.exports = async () => ({
    "cacheDirectory": "tmp/jest-cache",
    "rootDir": __dirname,
    "roots": [
        "<rootDir>/packages"
    ],
    "transform": {
        "^.+\\.ts$": "ts-jest"
    },
    "testMatch": [
        "<rootDir>/**/test*.ts"
    ],
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "json",
        "js"
    ],
    "moduleNameMapper": {
        "@sirian/(.*)$": "<rootDir>/packages/$1/src"
    },
    "coveragePathIgnorePatterns": [
        "/node_modules/"
    ],
    "testEnvironment": "node",
    "maxWorkers": 4,
    "globals": {
        "ts-jest": {
            "isolatedModules": true,
            "tsconfig": "./tsconfig.test.json"
        },
    },
});
