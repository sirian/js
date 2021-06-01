import {IsEmptyTuple, MustBeFalse, MustBeTrue} from "../../src";

type Test = [
    MustBeTrue<IsEmptyTuple<[]>>,
    MustBeTrue<IsEmptyTuple<readonly []>>,

    MustBeFalse<IsEmptyTuple<[1?]>>,
    MustBeFalse<IsEmptyTuple<readonly [1?]>>,
    MustBeFalse<IsEmptyTuple<[1]>>,
    MustBeFalse<IsEmptyTuple<readonly [1]>>,
    MustBeFalse<IsEmptyTuple<1[]>>,
    MustBeFalse<IsEmptyTuple<readonly 1[]>>,
    MustBeFalse<IsEmptyTuple<[1?, ...1[]]>>,
    MustBeFalse<IsEmptyTuple<readonly [1?, ...1[]]>>
];
