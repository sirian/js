import * as pathUtil from "path";
import {Filesystem} from "../../src";
import {TestUtil} from "../TestUtil";

describe("Filesystem.local.isReadable", () => {
    const root = TestUtil.resourcePath;

    const data: Array<[string, boolean]> = [
        ["foo/20/4.txt", true],
        ["not_readable", false],
    ];

    test.each(data)("Filesystem.local.isReadable(%o) === %o", async (path, expected) => {
        const fullPath = pathUtil.join(root, path);
        const promise = Filesystem.local.isReadable(fullPath);
        await expect(promise).resolves.toBe(expected);
    });
});
