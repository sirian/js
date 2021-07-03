/* eslint-disable unicorn/prefer-math-trunc */
import {ByteInput, toBytes} from "@sirian/common";
import {DELTA, mx, parseKey, toUint32Array} from "./helper";

export const xxteaDecrypt = (data: ByteInput, key: ByteInput) => {
    const uint32 = toUint32Array(data);
    const k = parseKey(key);
    const length = uint32.length;

    let y = uint32[0];
    const q = (6 + 52 / length) | 0;
    const lastIndex = length - 1;
    for (let sum = (q * DELTA) | 0; sum !== 0; sum = (sum - DELTA) | 0) {
        const e = sum >>> 2 & 3;
        for (let p = lastIndex; p >= 0; --p) {
            const z = uint32[p > 0 ? p - 1 : lastIndex];
            y = uint32[p] = (uint32[p] - mx(k, sum, y, z, p, e)) | 0;
        }
    }

    let n = (length << 2) - 4;

    const m = uint32[lastIndex];

    n = (m < n - 3) || (m > n) ? 0 : m;

    return toBytes(uint32.buffer.slice(0, n));
};
