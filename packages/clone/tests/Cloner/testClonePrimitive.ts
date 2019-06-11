import {TestCloner} from "../TestCloner";

describe("Clone primitive values", () => {
    const data = [
        null,
        undefined,
        NaN,
        -0,
        "",
        "foo",
        Symbol.iterator,
    ];

    TestCloner.multiTest(data);
});
