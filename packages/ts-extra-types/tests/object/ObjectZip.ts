import {AssertExact, ObjectZip} from "../../src";

type Test = [
    AssertExact<{}, ObjectZip<[], []>>,
    AssertExact<{}, ObjectZip<[], ["x"]>>,
    AssertExact<{ x: undefined }, ObjectZip<["x"], []>>,
    AssertExact<{ x: 1 }, ObjectZip<["x"], [1]>>,
    AssertExact<{ x: 1 | undefined }, ObjectZip<["x"], [1?]>>,
    AssertExact<{ x: null }, ObjectZip<["x"], [null]>>,
    AssertExact<{ x: 1 } | {}, ObjectZip<["x"] | [], [1]>>,
    AssertExact<{ [id: number]: 2 }, ObjectZip<number[], 2[]>>,
    AssertExact<{ [id: number]: 2, x: 1 }, ObjectZip<["x", ...number[]], [1, ...2[]]>>,
];

export default Test;
