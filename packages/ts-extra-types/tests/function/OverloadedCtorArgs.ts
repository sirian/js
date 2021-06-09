import {AssertExact, OverloadedCtorArgs} from "../../src";

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
    new(x: 1): Baz;
    new(x: 2): Foo;
    new(x: 3): Bar;
};

declare type Test = [
    AssertExact<OverloadedCtorArgs<typeof Foo>, [number]>,
    AssertExact<OverloadedCtorArgs<typeof Bar>, [] | [string, boolean]>,
    AssertExact<OverloadedCtorArgs<typeof Baz>, [number] | [string, boolean] | [object?]>,
    AssertExact<OverloadedCtorArgs<Zoo>, [2] | [3] | [1]>,
];
