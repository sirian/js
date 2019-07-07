import {AssertExact, ObjectZip} from "../../src";

type Test = [
    AssertExact<{}, ObjectZip<[], []>>,
    AssertExact<{}, ObjectZip<[], ["x"]>>,
    AssertExact<{ x?: undefined }, ObjectZip<["x"], []>>,
    AssertExact<{ x: null }, ObjectZip<["x"], [null]>>
];
