import {ByteInput, toBytes} from "@sirian/common";
import {DELTA, mx, parseKey, toInt32, toUint32Array} from "./helper";

export const xxteaEncrypt = (data: ByteInput, key: ByteInput) => {
    const uint8Data = toBytes(data);
    const uint32Data = toUint32Array(uint8Data);

    const length = uint32Data.length + 1;
    const uint32 = new Uint32Array(length);
    uint32.set(uint32Data);
    uint32[length - 1] = uint8Data.length;

    const k = parseKey(key);
    const n = length - 1;
    let z = uint32[n];
    let sum = 0;
    for (let q = (6 + 52 / length) | 0; q > 0; --q) {
        sum = toInt32(sum + DELTA);
        const e = sum >>> 2 & 3;
        for (let p = 0; p <= n; ++p) {
            const y = uint32[p === n ? 0 : p + 1];
            z = uint32[p] = toInt32(uint32[p] + mx(k, sum, y, z, p, e));
        }
    }

    return toBytes(uint32.buffer);
};
