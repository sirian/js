import {ByteArray, TypedArrayConstructor} from "../../src";

describe("", () => {
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

    test.each(data)("", (constructor: TypedArrayConstructor) => {
        const source = new Int16Array([0, -1, 1, -129, -128, 127, 128, -32768, 32767, 65535, 65536]);
        const sourceBuffer = source.buffer;
        const sourceView = new DataView(sourceBuffer);

        const arr = ByteArray.from(source).to(constructor);
        const view = new DataView(arr.buffer);

        const alignedLength = Math.ceil(sourceBuffer.byteLength / constructor.BYTES_PER_ELEMENT);

        expect(arr.length).toBe(alignedLength);

        for (let i = 0; i < arr.byteLength; i++) {
            const expected = i < sourceBuffer.byteLength ? sourceView.getInt8(i) : 0;
            expect(view.getInt8(i)).toBe(expected);
        }
    });

    test("", () => {
        const b = Buffer.from([1, 2, 3]);
        expect(ByteArray.from(b).to(Uint8Array)).toStrictEqual(new Uint8Array([1, 2, 3]));
        expect(ByteArray.from(b)).toStrictEqual(new ByteArray([1, 2, 3]));
    });
});
