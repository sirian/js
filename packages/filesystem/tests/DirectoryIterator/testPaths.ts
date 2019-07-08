import {DirectoryIterator, Filesystem} from "../../src";
import {TestUtil} from "../TestUtil";

test("", async () => {
    const root = TestUtil.resourcePath;
    const it = new DirectoryIterator({
        path: root,
        fs: Filesystem.local,
    });

    const files = await it.toArray();

    const paths = files.map((file) => file.relativePath);

    expect(paths).toStrictEqual(["bar", "baz.txt", "foo"]);
});
