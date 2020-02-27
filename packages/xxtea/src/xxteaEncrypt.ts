import {DELTA, mx, toInt32} from "./util";

export function xxteaEncrypt(v: Uint32Array, key: Uint32Array) {
    const length = v.length;
    const n = length - 1;
    let z = v[n];
    let sum = 0;
    for (let q = Math.floor(6 + 52 / length) | 0; q > 0; --q) {
        sum = toInt32(sum + DELTA);
        const e = sum >>> 2 & 3;
        for (let p = 0; p <= n; ++p) {
            const y = v[p === n ? 0 : p + 1];
            z = v[p] = toInt32(v[p] + mx(key, sum, y, z, p, e));
        }
    }
    return v;
}
