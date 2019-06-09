import {
    AssertExact,
    Func,
    IsExtends,
    JSONArray,
    JSONObject,
    JSONPrimitive,
    JSONValue,
    MustBeFalse,
    MustBeTrue,
} from "../../src";

type Test = [
    MustBeTrue<IsExtends<1, JSONPrimitive>>,
    MustBeTrue<IsExtends<{ x: boolean }, JSONObject>>,
    MustBeTrue<IsExtends<{ x: boolean }, JSONValue>>,
    MustBeTrue<IsExtends<{ x: boolean, 10: number }, JSONValue>>,
    MustBeTrue<IsExtends<number[], JSONArray>>,
    MustBeTrue<IsExtends<[{ x: [1, true, { y: "foo" }] }], JSONValue>>,

    MustBeFalse<IsExtends<undefined, JSONValue>>,
    MustBeFalse<IsExtends<{ x: Func }, JSONValue>>,
    MustBeFalse<IsExtends<{ x?: boolean }, JSONValue>>,
    MustBeFalse<IsExtends<{ x: undefined }, JSONValue>>,
    MustBeFalse<IsExtends<{ x: string }, JSONArray>>,

    AssertExact<3, Extract<({ foo: "bar" } | 3), JSONPrimitive>>,
    AssertExact<{ foo: "bar" }, Extract<({ foo: "bar" } | number[]), JSONObject>>
];
