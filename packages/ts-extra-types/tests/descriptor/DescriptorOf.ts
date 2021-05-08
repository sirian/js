import {AssertExact, DescriptorOf} from "../../src";

type Foo = {
    x: number;
    y?: string;
    z: boolean | undefined;
};

type Test = [
    AssertExact<TypedPropertyDescriptor<number>, DescriptorOf<Foo, "x">>,
    AssertExact<TypedPropertyDescriptor<string | undefined>, DescriptorOf<Foo, "y">>,
    AssertExact<TypedPropertyDescriptor<boolean | undefined>, DescriptorOf<Foo, "z">>,
    AssertExact<PropertyDescriptor, DescriptorOf<Foo, "a">>
];
