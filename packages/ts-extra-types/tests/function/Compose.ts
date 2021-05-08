import {AssertExact, Compose} from "../../src";

type Test = [
    AssertExact<(x: 1) => 3, Compose<(x: 1) => 2, (x: 2) => 3>>
];
