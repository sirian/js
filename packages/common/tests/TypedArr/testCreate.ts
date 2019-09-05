import {TypedArr, TypedArrayConstructor} from "../../src";

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
        const sourceView = new DataView(source.buffer);

        const arr = TypedArr.create(constructor, source);
        const view = new DataView(arr.buffer);

        const alignedLength = Math.ceil(source.buffer.byteLength / constructor.BYTES_PER_ELEMENT);

        expect(arr.length).toBe(alignedLength);

        for (let i = 0; i < arr.byteLength; i++) {
            const expected = i < source.buffer.byteLength ? sourceView.getInt8(i) : 0;
            expect(view.getInt8(i)).toBe(expected);
        }
    });

    test("", () => {
        const b = new Buffer([1, 2, 3]);
        expect(TypedArr.create(Uint8Array, b)).toStrictEqual(new Uint8Array([1, 2, 3]));
    });
});
