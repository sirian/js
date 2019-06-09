import {debounce} from "../../src";

// tslint:disable:max-classes-per-file

test("", () => {
    expect(() => {
        class Foo {
            @(debounce as any)()
            protected x: any;

            @(debounce as any)({
                ms: (key: string) => 100,
            })
            protected foo(key: number) {

            }
        }
        return Foo;
    }).toThrow("Only put a @debounce decorator on a method");
});
