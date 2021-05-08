import {IsEmptyTuple, MustBeFalse, MustBeTrue} from "../../src";

type Test = [
    MustBeTrue<IsEmptyTuple<[]>>,

    MustBeFalse<IsEmptyTuple<[1?]>>,
    MustBeFalse<IsEmptyTuple<[1]>>,
    MustBeFalse<IsEmptyTuple<1[]>>,
    MustBeFalse<IsEmptyTuple<[1?, ...1[]]>>
];

export default Test;
