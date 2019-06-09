import {IsEmptyTuple, MustBeFalse, MustBeTrue} from "../../src";

type Test = [
    MustBeTrue<IsEmptyTuple<[]>>,
    MustBeFalse<IsEmptyTuple<number[]>>,
    MustBeFalse<IsEmptyTuple<number[]>>,
    MustBeFalse<IsEmptyTuple<[number?]>>,
    MustBeFalse<IsEmptyTuple<[number?, ...number[]]>>
];
