import {IsRepeatedTuple, MustBeFalse, MustBeTrue} from "../../src";

type Test = [
    MustBeTrue<IsRepeatedTuple<1[]>>,
    MustBeTrue<IsRepeatedTuple<Array<1 | undefined>>>,
    MustBeTrue<IsRepeatedTuple<[...1[]]>>,
    MustBeTrue<IsRepeatedTuple<readonly [...1[]]>>,
    MustBeTrue<IsRepeatedTuple<readonly 1[]>>,

    MustBeFalse<IsRepeatedTuple<[]>>,
    MustBeFalse<IsRepeatedTuple<readonly []>>,
    MustBeFalse<IsRepeatedTuple<[1?, ...1[]]>>,
    MustBeFalse<IsRepeatedTuple<[1, ...1[]]>>,
    MustBeFalse<IsRepeatedTuple<[1]>>,
    MustBeFalse<IsRepeatedTuple<[1, ...1[]]>>,
    MustBeFalse<IsRepeatedTuple<[1?, ...1[]]>>,
    MustBeFalse<IsRepeatedTuple<[2?, ...1[]]>>
];

export default Test;
