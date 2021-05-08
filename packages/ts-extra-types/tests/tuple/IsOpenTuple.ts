import {IsOpenTuple, MustBeFalse, MustBeTrue} from "../../src";

type Test = [
    MustBeTrue<IsOpenTuple<[true, ...boolean[]]>>,
    MustBeTrue<IsOpenTuple<[true, ...true[]]>>,
    MustBeTrue<IsOpenTuple<[true?, ...true[]]>>,
    MustBeTrue<IsOpenTuple<true[]>>,

    MustBeFalse<IsOpenTuple<[]>>,
    MustBeFalse<IsOpenTuple<[true]>>,
    MustBeFalse<IsOpenTuple<[true?]>>
];

export default Test;
