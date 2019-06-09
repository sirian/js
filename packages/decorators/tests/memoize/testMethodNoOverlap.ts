import {memoize} from "../../src";

test("", () => {
    class Foo {
        constructor(protected x: number) {

        }

        @memoize
        public getX() {
            return this.x;
        }
    }

    const f1 = new Foo(1);
    const f2 = new Foo(2);

    expect(f1.getX()).toBe(1);
    expect(f2.getX()).toBe(2);
});
