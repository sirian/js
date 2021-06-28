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
        "@typescript-eslint/no-empty-interface": 1,
        "@typescript-eslint/no-unsafe-member-access": 1,
        "@typescript-eslint/no-unsafe-assignment": 1,
        "@typescript-eslint/no-unsafe-call": 1,
        "@typescript-eslint/no-unsafe-return": 1,
        "@typescript-eslint/no-empty-function": 1,
        "@typescript-eslint/restrict-template-expressions": [1, {}],
        "@typescript-eslint/restrict-plus-operands": [1, {
            checkCompoundAssignments: true
        }],
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-implied-eval": 0,
        "@typescript-eslint/ban-types": [1, {
            types: {
                object: false,
                Function: false
            }
        }]
    }
};
