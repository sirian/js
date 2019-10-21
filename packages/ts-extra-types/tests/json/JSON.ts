import {
    AssertExact,
    AssertExtends,
    Func,
    IsExtends,
    JsonMLElement,
    JSONPrimitive,
    JSONValue,
    MustBeFalse,
    MustBeTrue,
} from "../../src";

type Test = [
    MustBeTrue<IsExtends<1, JSONPrimitive>>,
    MustBeTrue<IsExtends<{ x: boolean }, JSONValue>>,
    MustBeTrue<IsExtends<{ x: boolean, 10: number }, JSONValue>>,
    MustBeTrue<IsExtends<number[], JSONValue>>,
    MustBeTrue<IsExtends<[null, 1], JSONValue>>,
    MustBeTrue<IsExtends<[{ x: [1, true, { y: "foo" }] }], JSONValue>>,

    MustBeFalse<IsExtends<{ x?: boolean }, JSONValue>>,
    MustBeFalse<IsExtends<undefined, JSONValue>>,
    MustBeFalse<IsExtends<{ x: Func }, JSONValue>>,

    AssertExact<3, Extract<({ foo: "bar" } | 3), JSONPrimitive>>,

    AssertExtends<"foo", JsonMLElement>,
    AssertExtends<["ul", { id: 123 },
        ["li", {}, "foo",
            ["span"],
            ["span", {}],
            ["span", {}, "1"],
            ["span", {}, ["span"]],
            ["span", "1"],
            ["span", "1", "2"],
            ["span", "1", ["span"]],
            ["span", ["span"], "2"],
            ["span", ["span"], ["span"]],
        ],
        ["li", {}, "baz"],
    ], JsonMLElement>,
];
