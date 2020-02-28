import {ByteArray, ByteArraySource} from "@sirian/common";
import {lzfCompress} from "./lzfCompress";
import {lzfDecompress} from "./lzfDecompress";

export const LZF = {
    compress: (value: ByteArraySource) => ByteArray.from(lzfCompress(ByteArray.from(value))),
    decompress: (value: ByteArraySource) => ByteArray.from(lzfDecompress(ByteArray.from(value))),
};
