import {makeArray, randomElement, randomInt} from "../src";

export class TestUtil {
    public static eval(code: string) {
        const fn = new Function(`return (${code})`);
        return fn();
    }

    public static randChar() {
        const ranges = [
            () => String.fromCodePoint(randomInt(32, 90, true)), // latin alphabet
            () => String.fromCodePoint(randomInt(0, 127, true)), // 7-bit ASCII
            () => String.fromCodePoint(randomInt(0, 0xd800)), // utf-8 code points below utf-16 surrogate halves
            () => String.fromCodePoint(randomInt(57_344, 1_114_111, true)), // utf-8 code points above utf-16 surrogate halves
            () => TestUtil.randEmoji(),
        ];
        return randomElement(ranges)();
    }

    public static randEmoji() {
        const ranges = [
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
        ] as const;

        const [min, max = min] = randomElement(ranges) as [number, number?];

        return String.fromCodePoint(randomInt(min, max, true));
    }

    public static randString(min: number, max = min) {
        return makeArray(randomInt(min, max, true), TestUtil.randChar).join("");
    }

    public static randStrings(count: number, minLength = 0, maxLength = 30) {
        return makeArray(count, () => TestUtil.randString(minLength, maxLength));
    }
}
