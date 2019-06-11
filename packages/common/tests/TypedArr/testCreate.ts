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
        const source = new Int8Array([-1, 1, -100, 16, -127]);

        const arr = TypedArr.create(constructor, source);
        const view = new DataView(arr.buffer);

        const alignedLength = Math.ceil(source.length / constructor.BYTES_PER_ELEMENT);
        expect(arr.length).toBe(alignedLength);

        for (let i = 0; i < arr.byteLength; i++) {
            expect(view.getInt8(i)).toBe(source[i] || 0);
        }
    });
});
