import {ByteArray, ByteArrayInput} from "@sirian/common";

export const DELTA = 0x9E3779B9;
export const parseKey = (key: ByteArrayInput) => ByteArray.convert(key, Uint32Array).slice(0, 4);
export const toInt32 = (i: number) => (i & 0xFFFFFFFF);
export const mx = (key: Uint32Array, sum: number, y: number, z: number, p: number, e: number) =>
    ((z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4)) ^ ((sum ^ y) + (key[p & 3 ^ e] ^ z));
