const ERROR = "error";
const OFF = "off";
const WARN = "warn";

const singleRule = process.argv.some((a) => a.startsWith('--rule='))

module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "browser": true,
        "jest/globals": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module",
        "ecmaVersion": 2021
    },
    "plugins": [
        "@typescript-eslint",
        "prettier",
        "unicorn",
        "prefer-arrow",
        "import",
        "jest"
    ],
    extends: singleRule ? [] : [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:unicorn/recommended",
        "prettier"
    ],
    rules: singleRule ? {} : {
        "unicorn/prevent-abbreviations": OFF,
        "unicorn/filename-case": [WARN, {
            "cases": {
                "camelCase": true,
                "pascalCase": true
            }
        }],
        "unicorn/no-array-for-each": OFF,
        "unicorn/explicit-length-check": OFF,
        "unicorn/no-this-assignment": OFF,
        "unicorn/prefer-number-properties": OFF,
        "unicorn/catch-error-name": OFF,
        "@typescript-eslint/explicit-module-boundary-types": OFF,
        "@typescript-eslint/no-empty-interface": WARN,
        "@typescript-eslint/no-unsafe-member-access": WARN,
        "@typescript-eslint/no-unsafe-assignment": WARN,
        "@typescript-eslint/no-unsafe-call": WARN,
        "@typescript-eslint/no-this-alias": OFF,
        "@typescript-eslint/no-unsafe-return": WARN,
        "@typescript-eslint/no-empty-function": WARN,
        "@typescript-eslint/restrict-template-expressions": WARN,
        "@typescript-eslint/restrict-plus-operands": OFF,
        "@typescript-eslint/no-explicit-any": OFF,
        "@typescript-eslint/no-implied-eval": OFF,
        "@typescript-eslint/ban-types": [WARN, {
            types: {
                object: false,
                Function: false
            }
        }]
    }
};
