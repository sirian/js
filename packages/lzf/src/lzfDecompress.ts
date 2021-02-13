import {ByteInput, toBytes} from "@sirian/common";

const assert = (value: boolean) => {
    if (!value) {
        throw new Error("sInvalid input");
    }
};

export const lzfDecompress = (input2: ByteInput) => {
    const bytes = toBytes(input2);
    const output: number[] = [];

    let ip = 0;
    let op = 0;

    const inputLength = bytes.length;
    if (!inputLength) {
        return new Uint8Array();
    }
    do {
        let ctrl = bytes[ip++];

        if (ctrl < (1 << 5)) { /* literal run */
            ctrl++;

            assert(ip + ctrl <= inputLength);

            while (ctrl--) {
                output[op++] = bytes[ip++];
            }
        } else { /* back reference */
            let len = ctrl >> 5;
            let ref = op - ((ctrl & 0x1f) << 8) - 1;

            assert(ip < inputLength);

            if (len === 7) {
                len += bytes[ip++];

                assert(ip < inputLength);
            }

            ref -= bytes[ip++];

            assert(ref >= 0);

            len += 2;

            do {
                output[op++] = output[ref++];
            } while (--len);
        }
    } while (ip < inputLength);

    return new Uint8Array(output);
};
