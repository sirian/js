import {DeepArray} from "@sirian/ts-extra-types";
import {NestedIterator, RecursiveIterator} from "../../src";

const data: Array<[DeepArray<number>, {}, DeepArray<number>]> = [
    [[1, 2], {}, [1, 2]],
    [[1, [2], [], 3], {}, [1, 2, 3]],
    [[1, [2, 3], 4], {}, [1, 2, 3, 4]],
    [[1, [2, [3]]], {maxDepth: 0}, [1]],
    [[1, [[2], [3, 4], 5]], {maxDepth: 1}, [1, 5]],
    [[1, [[2], [3, 4], 5]], {maxDepth: 2}, [1, 2, 3, 4, 5]],
    [[1, [2, 3], 4], {onlyLeaves: false}, [1, [2, 3], 2, 3, 4]],
    [[1, [2, [3]]], {maxDepth: 1, onlyLeaves: false}, [1, [2, [3]], 2, [3]]],
];

test.each(data)("[...new RecursiveIterator(%j, %j)] === %j", (value, options, expected) => {
    const it = new RecursiveIterator(new NestedIterator(value), options);
    expect([...it]).toStrictEqual(expected);
});

test.each(data)("", async (value: any[], options, expected) => {
    // eslint-disable-next-line @typescript-eslint/require-await
    const gen = (async function*() {
        yield* value.map((val) => Promise.resolve(val));
    })();

    const it2 = new RecursiveIterator(new NestedIterator(gen), options);
    const res = [];
    for await (const x of it2) {
        res.push(x);
    }
    expect(res).toStrictEqual(expected);
});
