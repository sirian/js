import {AssertExact, PickDescriptor} from "../../src";

type Foo = {
    x: number;
    y?: string;
    z: boolean | undefined;
};

type Test = [
    AssertExact<TypedPropertyDescriptor<number>, PickDescriptor<Foo, "x">>,
    AssertExact<undefined | TypedPropertyDescriptor<string | undefined>, PickDescriptor<Foo, "y">>,
    AssertExact<TypedPropertyDescriptor<boolean | undefined>, PickDescriptor<Foo, "z">>,
    AssertExact<PropertyDescriptor | undefined, PickDescriptor<Foo, "a">>
];
