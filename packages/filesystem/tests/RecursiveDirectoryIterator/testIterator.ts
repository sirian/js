import {RecursiveDirectoryIterator} from "../../src";
import {TestUtil} from "../TestUtil";

const root = TestUtil.resourcePath;

test("", async () => {
    const it = new RecursiveDirectoryIterator(root, {onlyLeaves: true});
    const res = await it.toArray();

    const expected = [
        "bar/bar1.txt",
        "baz.txt",
        "foo/1.txt",
        "foo/2.txt",
        "foo/20/4.txt",
        "foo/3.txt",
    ];

    const paths = res.map((value) => value.relativePath);
    expect(paths).toEqual(expected);
});

test("", async () => {
    const it = new RecursiveDirectoryIterator(root);
    const res = await it.toArray();

    const expected = [
        "bar", "bar/bar1.txt",
        "baz.txt",
        "foo",
        "foo/1.txt",
        "foo/2.txt",
        "foo/20",
        "foo/20/4.txt",
        "foo/3.txt",
    ];

    const paths = res.map((value) => value.relativePath);
    expect(paths).toEqual(expected);
});

test("", async () => {
    const it = new RecursiveDirectoryIterator(root, {
        maxDepth: 0,
    });
    const res = await it.toArray();

    const expected = [
        "bar",
        "baz.txt",
        "foo",
    ];

    const paths = res.map((value) => value.relativePath);
    expect(paths).toEqual(expected);
});
