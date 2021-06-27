module.exports = {
    "env": {
        "es6": true,
        node: true,
        browser: true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module",
        "ecmaVersion": 2021
    },
    "plugins": [
        "eslint-plugin-unicorn",
        "eslint-plugin-prefer-arrow",
        "eslint-plugin-import",
        "@typescript-eslint",
        "@typescript-eslint/tslint"
    ],
    rules: {
        "@typescript-eslint/explicit-module-boundary-types": 0,
        "@typescript-eslint/ban-types": [1, {
            types: {
                object: false,
                Function: false
            }
        }]
    }
};
