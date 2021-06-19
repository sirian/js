import {ByteInput, convertBytes, toBytes} from "@sirian/common";

export const DELTA = 0x9E3779B9;
export const parseKey = (key: ByteInput) => toUint32Array(key).slice(0, 4);
export const mx = (key: Uint32Array, sum: number, y: number, z: number, p: number, e: number) =>
    ((z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4)) ^ ((sum ^ y) + (key[p & 3 ^ e] ^ z));
export const toUint32Array = (input: ByteInput) => convertBytes(toBytes(input), Uint32Array);
