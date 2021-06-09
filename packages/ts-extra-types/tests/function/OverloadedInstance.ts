import {AssertExact, OverloadedInstance} from "../../src";

declare class Foo {
    public name: "foo";

    constructor(x: number);
}

declare class Bar {
    public name: "bar";

    constructor();
    constructor(x: string, y: boolean);
}

declare class Baz {
    public name: "baz";

    constructor(x?: object);
    constructor(x: number);
    constructor(x: string, y: boolean);
}

type Zoo = {
    new(x?: 1): Baz;
    new(x: 2): Foo;
    new(x: 3): Bar;
};

declare type Test = [
    AssertExact<OverloadedInstance<typeof Foo, [number]>, Foo>,
    AssertExact<OverloadedInstance<typeof Bar, []>, Bar>,
    AssertExact<OverloadedInstance<typeof Baz, [string, boolean]>, Baz>,
    AssertExact<OverloadedInstance<Zoo, [2]>, Foo>,
    AssertExact<OverloadedInstance<Zoo, [1]>, Baz>,
    AssertExact<OverloadedInstance<Zoo, []>, Baz>,
    AssertExact<OverloadedInstance<Zoo, [3]>, Bar>,
];
