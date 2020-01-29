export function lzfDecompress(bytes?: Uint8Array | null) {
    const ByteArray = Uint8Array;
    if (null == bytes || !bytes.length) {
        return new ByteArray();
    }
    const input = new ByteArray(bytes);
    const output: number[] = [];

    let ip = 0;
    let op = 0;

    const throwError = () => {throw new Error("Invalid input");};

    const inputLength = input.length;
    do {
        let ctrl = input[ip++];

        if (ctrl < (1 << 5)) { /* literal run */
            ctrl++;

            if (ip + ctrl > inputLength) {
                throwError();
            }

            while (ctrl--) {
                output[op++] = input[ip++];
            }
        } else { /* back reference */
            let len = ctrl >> 5;
            let ref = op - ((ctrl & 0x1f) << 8) - 1;

            if (ip >= inputLength) {
                throwError();
            }

            if (len === 7) {
                len += input[ip++];

                if (ip >= inputLength) {
                    throwError();
                }
            }

            ref -= input[ip++];

            if (ref < 0) {
                throwError();
            }

            len += 2;

            do {
                output[op++] = output[ref++];
            } while (--len);
        }
    } while (ip < inputLength);

    const res = new ByteArray(output.length);
    res.set(output);
    return res;
}
