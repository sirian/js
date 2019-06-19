import {NativeMathSource} from "./source";

export interface IRandomSource {
    uint8(): number;
}

export class Random {
    protected readonly source: IRandomSource;

    constructor(source: IRandomSource = new NativeMathSource()) {
        this.source = source;
    }

    public uint32() {
        return this.uint(32);
    }

    public uint16() {
        return this.uint(16);
    }

    public uint8() {
        return (this.source.uint8() >>> 0) % 256;
    }

    public int32() {
        return this.int(32);
    }

    public int16() {
        return this.int(16);
    }

    public int8() {
        return this.int(8);
    }

    public real(min: number, max: number) {
        if (!isFinite(min) || !isFinite(max)) {
            throw new RangeError(`Expected [min, max] to be a finite numbers. Given [${min}, ${max}]`);
        }

        const delta = max - min;

        const real01 = this.uint32() / 2 ** 32;

        return min + delta * real01;
    }

    public integer(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        const range = max - min + 1;

        if (range <= 0) {
            throw new RangeError(`Max must be larger than min. Given [${min}, ${max} ]`);
        }

        const bytes = Math.ceil(Math.log2(range) / 8);

        if (!bytes) {
            return min;
        }

        const maxNum = 256 ** bytes;

        while (true) {
            let val = 0;

            for (let i = 0; i < bytes; i++) {
                val = (val << 8) + this.uint8();
            }

            if (val < maxNum - maxNum % range) {
                return min + (val % range);
            }
        }
    }

    public uuid4() {
        const tpl = "10000000-1000-4000-8000-100000000000";
        return tpl.replace(/[018]/g, (x) => {
            const shift = +x / 4;
            const y = this.integer(0, 15) >> shift;
            const v = +x ^ y;
            return v.toString(16);
        });
    }

    public shuffle<T extends any[]>(array: T): T {
        const length = array.length;
        if (length) {
            for (let i = length - 1; i > 0; --i) {
                const j = this.integer(0, i);
                if (i === j) {
                    continue;
                }
                const tmp = array[i];
                array[i] = array[j];
                array[j] = tmp;
            }
        }
        return array;
    }

    protected int(bits: number) {
        const x = 2 ** (bits - 1);
        return this.integer(-x, x - 1);
    }

    protected uint(bits: number) {
        return this.integer(0, 2 ** bits - 1);
    }
}
