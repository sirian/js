import * as pathUtil from "path";
import {Filesystem} from "../../src";
import {TestUtil} from "../TestUtil";

describe("Filesystem.local.isExists", () => {
    const root = TestUtil.resourcePath;

    const data: Array<[string, boolean]> = [
        ["foo/20/4.txt", true],
        ["not_exists", false],
    ];

    test.each(data)("Filesystem.local.isExists(%o) === %o", async (path, expected) => {
        const fullPath = pathUtil.join(root, path);
        const promise = Filesystem.local.isExists(fullPath);
        await expect(promise).resolves.toBe(expected);
    });
});
