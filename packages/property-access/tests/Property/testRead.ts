import {PropertyAccessor, UnexpectedTypeError} from "../../src";

const empty = Object.create(null);

const data: Array<[object, string | number, any]> = [
    [{}, "x", undefined],
    [{x: 1}, "x", 1],
    [{x: [2]}, "x[0]", 2],
    [{x: [2]}, "x.0", 2],
    [{x: {y: 3}}, "x.y", 3],
    [{x: {y: 3}}, "x[y]", 3],
    [{x: {y: 3}}, "x[z]", undefined],
    [[1, 2], "[1]", 2],
    [[1, 2], "1", 2],
    [[1, 2], 1, 2],
    [[1, 2], "[2]", undefined],
    [[1, 2], "2", undefined],
    [[1, 2], ".2", undefined],
    [[1, {z: "foo"}, 3], "[1].z", "foo"],
    [{}, "ownProperty", undefined],
    [{}, "hasOwnProperty", Object.prototype.hasOwnProperty],
    [{ownProperty: 1}, "ownProperty", 1],
    [{ownProperty: 1}, "hasOwnProperty", Object.prototype.hasOwnProperty],
    [{hasOwnProperty: 1}, "ownProperty", undefined],
    [{hasOwnProperty: 1}, "hasOwnProperty", 1],
    [[1, 2], "length", 2],
    [new Uint8Array(5), "length", 5],
    [empty, "ownProperty", undefined],
    [empty, "hasOwnProperty", undefined],
    [[1, 2, 3], "length", 3],
    [[1, 2, 3], "toString", Array.prototype.toString],
];

const errorData: any[] = [
    [{}, "x.y"],
    [{}, "x[0]"],
    [[], "[1].z"],
    [[1, {z: "foo"}, 3], "[2].z", "foo"],
];

test.each(data)(`PropertyAccessor.getValue(%j, %j) === %o`, (obj, path, expected) => {
    const accessor = new PropertyAccessor();
    expect(accessor.isReadable(obj, path)).toBe(true);
    expect(accessor.read(obj, path)).toBe(expected);
});

test.each(errorData)(`PropertyAccessor.getValue(%j, %j) throws`, (obj, path) => {
    const accessor = new PropertyAccessor();
    expect(accessor.isReadable(obj, path)).toBe(false);
    expect(() => accessor.read(obj, path)).toThrow(UnexpectedTypeError);
});
