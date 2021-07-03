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
            () => String.fromCodePoint(randomInt(0, 0xd8_00)), // utf-8 code points below utf-16 surrogate halves
            () => String.fromCodePoint(randomInt(57_344, 1_114_111, true)), // utf-8 code points above utf-16 surrogate halves
            () => TestUtil.randEmoji(),
        ];
        return randomElement(ranges)();
    }

    public static randEmoji() {
        const ranges = [
            [0x00_A9],
            [0x00_AE],
            [0x20_3C],
            [0x20_49],
            [0x20_E3],
            [0x21_22],
            [0x21_39],
            [0x21_94, 0x21_99],
            [0x21_A9, 0x21_AA],
            [0x23_1A],
            [0x23_1B],
            [0x23_28],
            [0x23_CF],
            [0x23_E9, 0x23_F3],
            [0x23_F8, 0x23_FA],
            [0x24_C2],
            [0x25_AA],
            [0x25_AB],
            [0x25_B6],
            [0x25_C0],
            [0x25_FB, 0x25_FE],
            [0x26_00, 0x27_EF],
            [0x29_34],
            [0x29_35],
            [0x2B_00, 0x2B_FF],
            [0x30_30],
            [0x30_3D],
            [0x32_97],
            [0x32_99],
            [0x1_F0_00, 0x1_F0_2F],
            [0x1_F0_A0, 0x1_F0_FF],
            [0x1_F1_00, 0x1_F6_4F],
            [0x1_F6_80, 0x1_F6_FF],
            [0x1_F9_10, 0x1_F9_6B],
            [0x1_F9_80, 0x1_F9_E0],
        ] as const;

        const [min, max = min] = randomElement(ranges) as [number, number?];

        return String.fromCodePoint(randomInt(min, max, true));
    }

    public static randString(min: number, max = min) {
        return makeArray(randomInt(min, max, true), () => TestUtil.randChar()).join("");
    }

    public static randStrings(count: number, minLength = 0, maxLength = 30) {
        return makeArray(count, () => TestUtil.randString(minLength, maxLength));
    }
}
