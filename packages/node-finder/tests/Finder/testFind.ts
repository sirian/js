import {Path} from "@sirian/filesystem";
import {Finder} from "../../src";

test("", async () => {
    const it = Finder
        .find()
        .files()
        .in(Path.join(__dirname, "../resources"))
        .name("*.txt");

    const res = await it.toArray();
    const names = res.map((file) => file.relativePath);
    expect(names).toStrictEqual(["333.txt", "bar/1.txt", "bar/zoo.txt", "foo/baz.txt"]);
});
