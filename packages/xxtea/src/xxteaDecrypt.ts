import {DELTA, mx, toInt32} from "./util";

export function xxteaDecrypt(v: Uint32Array, key: Uint32Array) {
    const length = v.length;
    const n = length - 1;
    let y = v[0];
    const q = Math.trunc(6 + 52 / length);
    for (let sum = toInt32(q * DELTA); sum !== 0; sum = toInt32(sum - DELTA)) {
        const e = sum >>> 2 & 3;
        for (let p = n; p >= 0; --p) {
            const z = v[p > 0 ? p - 1 : n];
            y = v[p] = toInt32(v[p] - mx(key, sum, y, z, p, e));
        }
    }
    return v;
}
