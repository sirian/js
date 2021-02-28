import {DecoratorType, isDecoratorArgs} from "../../src";

describe("decorator.isDecoratorArgs('class')", () => {
    const data: Array<[any[], boolean]> = [
        [[], false],
        [[{}], false],
        [[() => void 0], false],
        [[class {}], true],
        [[function() {}], true],
        [[class {}, "foo"], false],
        [[class extends Date {}], true],
    ];

    test.each(data)("decorator.isDecoratorArgs('class', %p) === %p", (args, expected) => {
        expect(isDecoratorArgs(DecoratorType.CLASS, args)).toBe(expected);
    });
});
