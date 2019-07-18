import {Obj} from "../../src";

describe("Obj.snapshot", () => {
    test("Obj.snapshot", () => {
        class Foo {
            constructor(public x = 1) {}

            get y() {
                return this.x - 1;
            }

            public bar() {
                return 3;
            }
        }

        const target = new Foo();

        const expected = {
            x: 1,
            y: 0,
        };

        expect({...target}).toStrictEqual({x: 1});
        expect(JSON.stringify(target)).toStrictEqual(JSON.stringify({x: 1}));

        expect(Obj.snapshot(target)).toStrictEqual(expected);
        expect(JSON.stringify(Obj.snapshot(target))).toStrictEqual(JSON.stringify(expected));
    });
});
