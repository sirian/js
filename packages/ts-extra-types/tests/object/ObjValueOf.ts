import {AssertExact, ObjValueOf} from "../../src";

type Test = [
    AssertExact<never, ObjValueOf<{}>>,
    AssertExact<1, ObjValueOf<{x: 1}>>,
    AssertExact<1 | 2, ObjValueOf<{x: 1, y: 2}>>,
];

export default Test;
