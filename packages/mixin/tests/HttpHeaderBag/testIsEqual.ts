import {HttpHeaderBag} from "../../src";

describe("isEqual", () => {
    const data: Array<[HttpHeaderBag, HttpHeaderBag, boolean]> = [
        [new HttpHeaderBag({bar: 1, foo: 2}), new HttpHeaderBag({foo: 2, BAR: 1}), true],
        [new HttpHeaderBag({bar: 1}), new HttpHeaderBag({bar: 1}), true],
        [new HttpHeaderBag({bar: 1}), new HttpHeaderBag({bar: 2}), false],
        [new HttpHeaderBag({bar: 1}), new HttpHeaderBag({foo: 1}), false],
        [new HttpHeaderBag({}), new HttpHeaderBag({foo: 1}), false],
        [new HttpHeaderBag({foo: 1}), new HttpHeaderBag({foo: 1, bar: ""}), false],
    ];

    test.each(data)("%O.isEqual(%O) === %O", (a, b, expected) => {
        expect(a.isEqual(b)).toBe(expected);
        expect(b.isEqual(a)).toBe(expected);
    });
});
