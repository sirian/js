import {assign} from "../../src";

const helper = (v: any) => ({enumerable: false, get: () => v});

const data: Array<[object, object[], object]> = [
    [{}, [], {}],
    [{}, [{x: 1}], {x: 1}],
    [{x: 1}, [], {x: 1}],
    [{x: 1}, [{x: 2}], {x: 2}],
    [{x: 1, y: 1}, [{y: 2}], {x: 1, y: 2}],
    [{x: 1, y: 1}, [{x: 2}, {y: 2}], {x: 2, y: 2}],
    [{x: 1, y: 1}, [{x: 2}, {y: 2, x: 3}], {x: 3, y: 2}],

    [{x: 1}, [{y: 2}], {x: 1, y: 2}],
    [{x: 1}, [{x: 2}, {y: 2}], {x: 2, y: 2}],
    [{x: 1}, [{x: 2}, {y: 2, x: 3}], {x: 3, y: 2}],
    [[5, 10, 15], [{1: 6, 3: 20}], [5, 6, 15, 20]],

    [{x: 1}, [{y: 2}, Object.create(null, {x: helper(3), y: helper(4), z: helper(5)})], {x: 3, y: 4}],
];

test.each(data)("Obj.assign(%p, ...%p) === %p", (target, sources, expected) => {
    expect(assign(target, ...sources)).toStrictEqual(expected);
});
