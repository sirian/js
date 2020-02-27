import {ByteArray, ByteArrayInput} from "@sirian/common";
import {lzfCompress} from "./lzfCompress";
import {lzfDecompress} from "./lzfDecompress";

export const LZF = {
    compress: (value: ByteArrayInput) => ByteArray.from(lzfCompress(ByteArray.from(value))),
    decompress: (value: ByteArrayInput) => ByteArray.from(lzfDecompress(ByteArray.from(value))),
};
