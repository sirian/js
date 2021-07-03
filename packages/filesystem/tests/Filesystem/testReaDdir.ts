import * as fs from "node:fs";
import {Filesystem} from "../../src";
import {TestUtil} from "../TestUtil";

test("", async () => {
    const path = TestUtil.resourcePath;

    const files = await Filesystem.local.readDir(path, {stats: true});
    expect(files).toHaveLength(3);
    for (const file of files) {
        expect(file.stats).toBeInstanceOf(fs.Stats);
    }
});

test("", async () => {
    const path = TestUtil.resourcePath;

    const files = await Filesystem.local.readDir(path);
    expect(files).toHaveLength(3);

    for (const file of files) {
        expect(file.stats).toBe(undefined);
    }
});
