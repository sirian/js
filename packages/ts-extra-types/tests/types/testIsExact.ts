import {IsExact, MustBeFalse, MustBeTrue} from "../../src";

type Test = [
    MustBeTrue<IsExact<1, 1>>,
    MustBeTrue<IsExact<[...number[]], number[]>>,
    MustBeTrue<IsExact<[...false[]], false[]>>,
    MustBeFalse<IsExact<[false?, ...false[]], false[]>>,
    MustBeFalse<IsExact<[false?, ...(false | undefined)[]], (false | undefined)[]>>,
    MustBeFalse<IsExact<[true, ...false[]], false[]>>
];
