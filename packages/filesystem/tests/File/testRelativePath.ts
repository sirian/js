import {Filesystem, Path} from "../../src";
import {TestUtil} from "../TestUtil";

describe("", () => {
    const root = TestUtil.resourcePath;
    const path = Path.join(root, "foo/20/4.txt");

    const cwd = process.cwd();

    const data = [
        ["", Path.relative(cwd, path)],
        [".", Path.relative(cwd, path)],
        ["/", Path.relative("/", path)],
        [__dirname, Path.relative(__dirname, path)],
    ];

    test.each(data)(`${path} relative to %o should be %o`, async (basedir: string, expected: string) => {
        const file = await Filesystem.local.load(path);
        expect(file.name).toBe("4.txt");
        expect(file.path).toBe(path);
        file.basedir = basedir;

        expect(file.relativePath).toBe(expected);
    });
});
