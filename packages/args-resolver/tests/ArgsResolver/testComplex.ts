import {ArgsResolver} from "../../src";

type Options = { x: number, y?: string };

test.skip("", () => {
    function foo(...args: [number] | [string, number] | [Options]) {
        return ArgsResolver
            .switch(args)
            .when<[number]>([Number as any], (x) => ({x}))
            .when<[string, number]>([String, Number] as any, (y, x) => ({x, y}))
            // todo> .when<[Options]>([Object], (obj) => obj)
            .resolve();
    }

    expect(foo(3)).toStrictEqual({x: 3});
    expect(foo("42", 3)).toStrictEqual({x: 3, y: "42"});
    expect(foo({x: 3})).toStrictEqual({x: 3});
    expect(foo({x: 3, y: "42"})).toStrictEqual({x: 3, y: "42"});
});
