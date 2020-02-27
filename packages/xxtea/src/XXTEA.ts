import {ByteArray, ByteArrayInput} from "@sirian/common";
import {parseKey} from "./util";
import {xxteaDecrypt} from "./xxteaDecrypt";
import {xxteaEncrypt} from "./xxteaEncrypt";

// tslint:disable-next-line
export class XXTEA {
    protected key: Uint32Array;

    public constructor(key: ByteArrayInput) {
        this.key = parseKey(key);
    }

    public static encrypt(data: ByteArrayInput, key: ByteArrayInput) {
        const uint8Data = ByteArray.from(data);
        const uint32Data = uint8Data.to(Uint32Array);
        const uint32DataWithLength = new Uint32Array(uint32Data.length + 1);
        uint32DataWithLength.set(uint32Data);
        uint32DataWithLength[uint32Data.length] = uint8Data.length;

        const uint32 = xxteaEncrypt(uint32DataWithLength, parseKey(key));
        return new ByteArray(uint32.buffer);
    }

    public static decrypt(data: ByteArrayInput, key: ByteArrayInput) {
        const uint32Data = ByteArray.convert(data, Uint32Array);
        const uint32DecryptedWithLength = xxteaDecrypt(uint32Data, parseKey(key));

        const {length, buffer} = uint32DecryptedWithLength;

        let n = length << 2;

        const m = uint32DecryptedWithLength[length - 1];
        n -= 4;

        if ((m < n - 3) || (m > n)) {
            n = 0;
        } else {
            n = m;
        }

        return new ByteArray(buffer.slice(0, n));
    }

    public encrypt(data: ByteArrayInput) {
        return XXTEA.encrypt(data, this.key);
    }

    public decrypt(data: ByteArrayInput) {
        return XXTEA.decrypt(data, this.key);
    }
}
