import {IsExact, MustBeFalse, MustBeTrue} from "../../src";

type Test = [
    MustBeTrue<IsExact<1, 1>>,
    MustBeTrue<IsExact<[...number[]], number[]>>,
    MustBeTrue<IsExact<[...false[]], false[]>>,
    MustBeFalse<IsExact<[false?, ...false[]], false[]>>,
    MustBeFalse<IsExact<[false?, ...(false | undefined)[]], (false | undefined)[]>>,
    MustBeFalse<IsExact<[true, ...false[]], false[]>>,
    MustBeFalse<IsExact<{ x: 1 | undefined }, { x?: 1 }>>,
    MustBeFalse<IsExact<{ x: 1 | null }, { x?: 1 }>>,
    MustBeFalse<IsExact<null, undefined>>,
    MustBeFalse<IsExact<{ x: null }, { x: undefined }>>,
    MustBeFalse<IsExact<{ x: 1 | null }, { x?: 1 | undefined }>>,
    MustBeFalse<IsExact<{ x: 1 | null }, { x: 1 | undefined }>>,
    MustBeFalse<IsExact<{ x?: 1 | null }, { x: 1 | null | undefined }>>
];
