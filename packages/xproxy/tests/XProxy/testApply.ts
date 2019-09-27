import {XProxy} from "../../src";

describe("XProxy apply", () => {
    const data: any[] = [
        () => 123,
        function() { return 123; },
    ];

    test.each(data)("apply XProxy.forFunction(%o)", (target) => {
        const p = XProxy.forFunction<any>({target});
        expect(p.name).toBe(target.name);

        const expected = target();
        const actual = p();
        expect(actual).toBe(expected);
    });

    test("apply XProxy.forFunction(class Foo {})", () => {
        const target: any = class Foo {};
        const p = XProxy.forFunction({target});

        let expectedError: any;
        try {
            target();
        } catch (e) {
            expectedError = e;
        }

        expect(() => p()).toThrow(expectedError);
    });
});
