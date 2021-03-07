import {debounce} from "../../src";

test("", () => {
    expect(() => {
        class Foo {
            @(debounce as any)()
            protected x: any;
        }

        return Foo;
    }).toThrow("[debounce] requires descriptor");
});
