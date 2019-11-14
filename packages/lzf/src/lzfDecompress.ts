export function lzfDecompress(bytes?: Uint8Array | null) {
    if (null == bytes || !bytes.length) {
        return new Uint8Array();
    }
    const input = new Uint8Array(bytes);
    const output: number[] = [];

    let ip = 0;
    let op = 0;

    do {
        let ctrl = input[ip++];

        if (ctrl < (1 << 5)) { /* literal run */
            ctrl++;

            if (ip + ctrl > input.length) {
                throw new Error("Invalid input");
            }

            while (ctrl--) {
                output[op++] = input[ip++];
            }
        } else { /* back reference */
            let len = ctrl >> 5;
            let ref = op - ((ctrl & 0x1f) << 8) - 1;

            if (ip >= input.length) {
                throw new Error("Invalid input");
            }

            if (len === 7) {
                len += input[ip++];

                if (ip >= input.length) {
                    throw new Error("Invalid input");
                }
            }

            ref -= input[ip++];

            if (ref < 0) {
                throw new Error("Invalid input");
            }

            len += 2;

            do {
                output[op++] = output[ref++];
            } while (--len);
        }
    } while (ip < input.length);

    const res = new Uint8Array(output.length);
    res.set(output);
    return res;
}
