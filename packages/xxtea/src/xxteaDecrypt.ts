import {ByteInput, toBytes} from "@sirian/common";
import {DELTA, mx, parseKey, toInt32, toUint32Array} from "./helper";

export const xxteaDecrypt = (data: ByteInput, key: ByteInput) => {
    const uint32 = toUint32Array(data);
    const k = parseKey(key);

    const {length, buffer} = uint32;

    let y = uint32[0];
    const q = (6 + 52 / length) | 0;
    const lastIndex = length - 1;
    for (let sum = toInt32(q * DELTA); sum !== 0; sum = toInt32(sum - DELTA)) {
        const e = sum >>> 2 & 3;
        for (let p = lastIndex; p >= 0; --p) {
            const z = uint32[p > 0 ? p - 1 : lastIndex];
            y = uint32[p] = toInt32(uint32[p] - mx(k, sum, y, z, p, e));
        }
    }

    let n = (length << 2) - 4;

    const m = uint32[lastIndex];

    if ((m < n - 3) || (m > n)) {
        n = 0;
    } else {
        n = m;
    }

    return toBytes(buffer.slice(0, n));
};
