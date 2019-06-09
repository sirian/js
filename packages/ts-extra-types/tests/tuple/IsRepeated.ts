import {IsRepeatedTuple, MustBeFalse, MustBeTrue} from "../../src";

type Test = [
    MustBeTrue<IsRepeatedTuple<number[]>>,
    MustBeTrue<IsRepeatedTuple<[...number[]]>>,
    MustBeFalse<IsRepeatedTuple<[]>>,
    MustBeFalse<IsRepeatedTuple<[number]>>,
    MustBeFalse<IsRepeatedTuple<[number, ...number[]]>>,
    MustBeFalse<IsRepeatedTuple<[number?, ...number[]]>>
];
