import {And, IsArray, Push} from "@sirian/ts-extra-types";
import {isArray, makeArray} from "../src";

export class TestUtil {
    public static eval(code: string) {
        const fn = new Function(`return (${code})`);
        return fn();
    }

    public static delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    public static mergeData<X extends readonly any[], Y extends readonly any[]>(trueData: X, falseData: Y) {
        const oneArg = [...trueData, ...falseData].some((v) => !isArray(v));
        return [
            ...trueData.map((v) => oneArg ? [v, true] : [...v, true]),
            ...falseData.map((v) => oneArg ? [v, false] : [...v, false]),
        ] as And<IsArray<X[number]>, IsArray<Y[number]>> extends true
             ? Array<Push<X[number], true> | Push<Y[number], false>>
             : Array<[X[number], true] | [Y[number], false]>;
    }

    public static rand(x: number, y: number) {
        return x + Math.trunc((y - x + 1) * Math.random());
    }

    public static randChar() {
        const ranges = [
            () => String.fromCodePoint(TestUtil.rand(32, 90)), // latin alphabet
            () => String.fromCodePoint(TestUtil.rand(0, 128)), // 7-bit ASCII
            () => String.fromCodePoint(TestUtil.rand(0, 0xd800)), // utf-8 code points below utf-16 surrogate halves
            () => String.fromCodePoint(TestUtil.rand(57_344, 1_114_111)), // utf-8 code points above utf-16 surrogate halves
            () => TestUtil.randEmoji(),
        ];
        return TestUtil.randElement(ranges)();
    }

    public static randEmoji() {
        const ranges: Array<[number, number?]> = [
            [0x00A9],
            [0x00AE],
            [0x203C],
            [0x2049],
            [0x20E3],
            [0x2122],
            [0x2139],
            [0x2194, 0x2199],
            [0x21A9, 0x21AA],
            [0x231A],
            [0x231B],
            [0x2328],
            [0x23CF],
            [0x23E9, 0x23F3],
            [0x23F8, 0x23FA],
            [0x24C2],
            [0x25AA],
            [0x25AB],
            [0x25B6],
            [0x25C0],
            [0x25FB, 0x25FE],
            [0x2600, 0x27EF],
            [0x2934],
            [0x2935],
            [0x2B00, 0x2BFF],
            [0x3030],
            [0x303D],
            [0x3297],
            [0x3299],
            [0x1F000, 0x1F02F],
            [0x1F0A0, 0x1F0FF],
            [0x1F100, 0x1F64F],
            [0x1F680, 0x1F6FF],
            [0x1F910, 0x1F96B],
            [0x1F980, 0x1F9E0],
        ];

        const [min, max = min] = TestUtil.randElement(ranges);

        return String.fromCodePoint(TestUtil.rand(min, max));
    }

    public static randElement<T>(x: T[]) {
        return x[TestUtil.rand(0, x.length - 1)];
    }

    public static randString(min: number, max = min) {
        return makeArray(TestUtil.rand(min, max), TestUtil.randChar).join("");
    }

    public static randStrings(count: number, minLength = 0, maxLength = 30) {
        return makeArray(count, () => TestUtil.randString(minLength, maxLength));
    }
}
