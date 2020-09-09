import {AssertExact, AssertExtends, AssertNotExtends, Func, JSONPrimitive, JSONValue} from "../../src";

type Test = [
    AssertExtends<1, JSONPrimitive>,
    AssertExtends<{ x: boolean }, JSONValue>,
    AssertExtends<{ x: boolean, 10: number }, JSONValue>,
    AssertExtends<number[], JSONValue>,
    AssertExtends<[null, 1], JSONValue>,
    AssertExtends<[{ x: [1, true, { y: "foo" }] }], JSONValue>,

    AssertNotExtends<{ x?: boolean }, JSONValue>,
    AssertNotExtends<undefined, JSONValue>,
    AssertNotExtends<{ x: Func }, JSONValue>,

    AssertExact<3, Extract<({ foo: "bar" } | 3), JSONPrimitive>>,
];
