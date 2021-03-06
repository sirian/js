import {IsOptionalKey, MustBeFalse, MustBeTrue} from "../../src";

type Foo = {
    x?: number;
    y?: undefined;
    z: number | undefined;
};

declare type Test = [
    MustBeTrue<IsOptionalKey<Foo, "x">>,
    MustBeTrue<IsOptionalKey<Foo, "y">>,
    MustBeFalse<IsOptionalKey<Foo, "z">>
];
