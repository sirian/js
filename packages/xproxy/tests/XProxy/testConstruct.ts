import {XProxy} from "../../src";

describe("XProxy construct", () => {
    class Foo {
        public x = 1;
    }

    function Bar(this: any) {
        this.x = 1;
    }

    const data: any[] = [
        Foo,
        Bar,
    ];

    test.each(data)("construct XProxy.forFunction(%o)", (target) => {
        const p = XProxy.forFunction<any>({target});

        const foo = new p();
        expect(p.name).toBe(target.name);
        expect(foo).toBeInstanceOf(target);
        expect(foo).toBeInstanceOf(p);
        expect(foo.x).toBe(1);
    });

    test("construct XProxy.forFunction(() => 1)", () => {
        const target: any = () => 1;
        const p = XProxy.forFunction({target});

        let expectedError: any;
        try {
            Reflect.construct(target, []);
        } catch (e) {
            expectedError = e;
        }

        expect(() => new p()).toThrow(expectedError);
    });
});
