/* eslint-disable unicorn/prefer-module */
import * as path from "path";

export const TestUtil = {
    get resourcePath() {
        return path.join(__dirname, "/../resources");
    },
};
