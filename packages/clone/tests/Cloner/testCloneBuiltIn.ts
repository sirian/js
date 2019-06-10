import {TestCloner} from "../TestCloner";

describe("Clone built in types", () => {
    const data = [
        3,
        "",
        true,
        new Date(),
        /./i,

        [1, 2, 3],
        new Uint8Array([1, 2, 3]),
        new Uint8Array([1, 2, 3]).buffer,
        new DataView(new Uint8Array([1, 2, 3]).buffer),

        Object.create(null),
        {},
        {x: 1},
    ];

    for (const target of data) {
        TestCloner.multiTest(target);
    }
});
