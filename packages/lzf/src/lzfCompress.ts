export function lzfCompress(bytes?: Uint8Array | null) {
    const ByteArray = Uint8Array;
    if (bytes == null || !bytes.length) {
        return new ByteArray();
    }

    const HLOG = 16;
    const HSIZE = (1 << HLOG);
    const LZF_MAX_OFF = (1 << 13);
    const LZF_MAX_REF = ((1 << 8) + (1 << 3));
    const LZF_MAX_LIT = (1 << 5);

    const FRST = (d: Uint8Array, p: number) => (((d[p]) << 8) | d[p + 1]);
    const NEXT = (v: number, d: Uint8Array, p: number) => (((v) << 8) | d[p + 2]);
    const IDX = (h: number) => (((h * 0x1e35a7bd) >> (32 - HLOG - 8)) & (HSIZE - 1));

    const output = [];
    const htab = new Uint32Array(HSIZE);

    const inputLen = bytes.length;

    let ip = 0;
    let hval = FRST(bytes, ip);
    let op = 1;
    let lit = 0;

    const fill = () => {
        ++lit;
        output[op++] = bytes[ip++];

        if (lit === LZF_MAX_LIT) {
            output[op - lit - 1] = (lit - 1) & 255; /* stop run */
            lit = 0;
            op++; /* start run */
        }
    };

    while (ip < inputLen - 2) {
        hval = NEXT(hval, bytes, ip);
        const hslot = IDX(hval);
        const ref = htab[hslot];
        htab[hslot] = ip;

        const off = ip - ref - 1;

        if (ref < ip /* the next test will actually take care of this, but this is faster */
            && off < LZF_MAX_OFF
            && ref > 0
            && bytes[ref + 2] === bytes[ip + 2]
            && bytes[ref + 1] === bytes[ip + 1]
            && bytes[ref] === bytes[ip]
        ) {
            /* match found at *ref++ */
            let len = 2;
            let maxLen = inputLen - ip - len;
            maxLen = maxLen > LZF_MAX_REF ? LZF_MAX_REF : maxLen;

            output[op - lit - 1] = (lit - 1) & 255; /* stop run */
            if (lit === 0) {
                op -= 1; /* undo run if length is zero */
            }

            do {
                len++;
            }
            while (len < maxLen && bytes[ref + len] === bytes[ip + len]);

            len -= 2; /* len is now #octets - 1 */
            ip++;

            if (len < 7) {
                output[op++] = ((off >> 8) + (len << 5)) & 255;
            } else {
                output[op++] = ((off >> 8) + (7 << 5)) & 255;
                output[op++] = (len - 7) & 255;
            }

            output[op++] = off & 255;

            lit = 0;
            op++; /* start run */

            ip += len + 1;

            if (ip >= inputLen - 2) {
                break;
            }

            ip -= 2;

            hval = FRST(bytes, ip);

            hval = NEXT(hval, bytes, ip);
            htab[IDX(hval)] = ip++;

            hval = NEXT(hval, bytes, ip);
            htab[IDX(hval)] = ip++;
        } else {
            fill();
        }
    }

    while (ip < inputLen) {
        fill();
    }

    if (lit !== 0) {
        output[op - lit - 1] = (lit - 1) & 255; /* stop run */
    }

    const res = new ByteArray(output.length);
    res.set(output);
    return res;
}
