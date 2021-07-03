import {convertBytes, TypedArrayConstructor} from "../../src";

describe("convertBytes", () => {
    const data: Array<[TypedArrayConstructor]> = [
            [Int8Array],
            [Int16Array],
            [Int32Array],
            [Uint8Array],
            [Uint8ClampedArray],
            [Uint16Array],
            [Uint32Array],
            [Float32Array],
            [Float64Array],
        ]
    ;

    test.each(data)("to %O", (constructor: TypedArrayConstructor) => {
        const source = new Int16Array([0, -1, 1, -129, -128, 127, 128, -32_768, 32_767, 65_535, 65_536]);
        const sourceBuffer = source.buffer;
        const sourceView = new DataView(sourceBuffer);

        const arr = convertBytes(source, constructor);

        const view = new DataView(arr.buffer);

        const alignedLength = Math.ceil(sourceBuffer.byteLength / constructor.BYTES_PER_ELEMENT);

        expect(arr.length).toBe(alignedLength);

        for (let i = 0; i < arr.byteLength; i++) {
            const expected = i < sourceBuffer.byteLength ? sourceView.getInt8(i) : 0;
            expect(view.getInt8(i)).toBe(expected);
        }
    });
});
