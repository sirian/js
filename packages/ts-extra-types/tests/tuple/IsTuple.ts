import {IsFiniteTuple, MustBeFalse, MustBeTrue} from "../../src";

type Test = [
    MustBeTrue<IsFiniteTuple<[]>>,
    MustBeTrue<IsFiniteTuple<[number]>>,
    MustBeTrue<IsFiniteTuple<[number?]>>,
    MustBeTrue<IsFiniteTuple<[number, string]>>,
    MustBeFalse<IsFiniteTuple<[number, ...number[]]>>,
    MustBeFalse<IsFiniteTuple<[number?, ...number[]]>>,
    MustBeFalse<IsFiniteTuple<number[]>>
];

export default Test;
