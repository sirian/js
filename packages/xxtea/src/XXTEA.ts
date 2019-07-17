import {ArrBufTarget, TypedArr} from "@sirian/common";

const DELTA = 0x9E3779B9;

// tslint:disable-next-line
export class XXTEA {
    protected key: Uint32Array;

    public constructor(key: ArrBufTarget) {
        this.key = TypedArr.create(Uint32Array, key).slice(0, 4);
    }

    public static encrypt(data: ArrBufTarget, key: ArrBufTarget) {
        return new XXTEA(key).encrypt(data);
    }

    public static decrypt(data: ArrBufTarget, key: ArrBufTarget) {
        return new XXTEA(key).decrypt(data);
    }

    public encrypt(data: ArrBufTarget) {
        const uint8Data = TypedArr.create(Uint8Array, data);
        const uint32Data = TypedArr.create(Uint32Array, data);
        const uint32DataWithLength = new Uint32Array([...uint32Data, uint8Data.byteLength]);

        const uint32 = this.encryptUint32Array(uint32DataWithLength);
        return new Uint8Array(uint32.buffer);
    }

    public decrypt(data: ArrBufTarget) {
        const uint32Data = TypedArr.create(Uint32Array, data);

        const uint32DecryptedWithLength = this.decryptUint32Array(uint32Data);

        return this.sliceDecrypted(uint32DecryptedWithLength);
    }

    protected sliceDecrypted(data: Uint32Array) {
        const length = data.length;

        let n = length << 2;

        const m = data[length - 1];
        n -= 4;

        if ((m < n - 3) || (m > n)) {
            n = 0;
        } else {
            n = m;
        }

        return TypedArr.create(Uint8Array, data).slice(0, n);
    }

    protected int32(i: number) {
        return i & 0xFFFFFFFF;
    }

    protected mx(sum: number, y: number, z: number, p: number, e: number) {
        const k = this.key;
        return ((z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4)) ^ ((sum ^ y) + (k[p & 3 ^ e] ^ z));
    }

    protected encryptUint32Array(v: Uint32Array) {
        const length = v.length;
        const n = length - 1;
        let z = v[n];
        let sum = 0;
        for (let q = Math.floor(6 + 52 / length) | 0; q > 0; --q) {
            sum = this.int32(sum + DELTA);
            const e = sum >>> 2 & 3;
            for (let p = 0; p <= n; ++p) {
                const y = v[p === n ? 0 : p + 1];
                z = v[p] = this.int32(v[p] + this.mx(sum, y, z, p, e));
            }
        }
        return v;
    }

    protected decryptUint32Array(v: Uint32Array) {
        const length = v.length;
        const n = length - 1;
        let y = v[0];
        const q = Math.trunc(6 + 52 / length);
        for (let sum = this.int32(q * DELTA); sum !== 0; sum = this.int32(sum - DELTA)) {
            const e = sum >>> 2 & 3;
            for (let p = n; p >= 0; --p) {
                const z = v[p > 0 ? p - 1 : n];
                y = v[p] = this.int32(v[p] - this.mx(sum, y, z, p, e));
            }
        }
        return v;
    }
}
