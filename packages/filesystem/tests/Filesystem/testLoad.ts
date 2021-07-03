import * as pathUtil from "node:path";
import {Filesystem} from "../../src";
import {TestUtil} from "../TestUtil";

test("", async () => {
    const root = TestUtil.resourcePath;
    const subPath = "foo/20/4.txt";
    const path = pathUtil.join(root, subPath);

    const file = await Filesystem.local.load(path);
    expect(file.isFile()).toBe(true);
    expect(file.isDir()).toBe(false);
    expect(file.name).toBe("4.txt");
    expect(file.path).toBe(path);
});
