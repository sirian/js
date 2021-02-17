import {objReplace} from "../../src";

const data: Array<[object, object[], object]> = [
    [{}, [], {}],
    [{}, [{x: 1}], {}],
    [{x: 1}, [], {x: 1}],
    [{x: 1}, [{x: 2}], {x: 2}],
    [{x: 1, y: 1}, [{y: 2}], {x: 1, y: 2}],
    [{x: 1, y: 1}, [{x: 2}, {y: 2}], {x: 2, y: 2}],
    [{x: 1, y: 1}, [{x: 2}, {y: 2, x: 3}], {x: 3, y: 2}],

    [{x: 1}, [{y: 2}], {x: 1}],
    [{x: 1}, [{x: 2}, {y: 2}], {x: 2}],
    [{x: 1}, [{x: 2}, {y: 2, x: 3}], {x: 3}],
    [[5, 10, 15], [{1: 6, 3: 20}], [5, 6, 15]],
    [{hostname: ""}, [new URL("https://example.org")], {hostname: "example.org"}],
];

test.each(data)("Obj.replace(%p, ...%p) === %p", (target, sources, expected) => {
    expect(objReplace(target, ...sources)).toStrictEqual(expected);
});
