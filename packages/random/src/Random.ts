import {isArray, Num} from "@sirian/common";
import {IterableEntries} from "@sirian/ts-extra-types";
import {NativeMathSource} from "./NativeMathSource";

export interface IRandomSource {
    nextByte(): number;
}

export class Random {
    protected readonly source: IRandomSource;
    protected maxAttempts = 64;

    constructor(source?: IRandomSource) {
        this.source = source || new NativeMathSource();
    }

    public pick<V>(target: V[]): [number, V];
    public pick<K, V>(target: IterableEntries<[K, V]>): [K, V];

    public pick(target: string[] | IterableEntries) {
        if (!isArray(target)) {
            const entries = [...target.entries()];
            const [/*index*/, entry] = this.pick(entries);
            return entry;
        }

        const index = this.int(0, target.length - 1);
        const elem = target[index];
        return [index, elem];
    }

    public real(min: number, max: number, bits: number = 32) {
        if (!isFinite(min) || !isFinite(max)) {
            throw new RangeError(`Expected [min, max] to be a finite numbers. Given [${min}, ${max}]`);
        }

        const delta = max - min;

        const real01 = this.real01(bits);

        return min + delta * real01;
    }

    public real01(bits: number = 32) {
        const max = 2 ** bits;
        return this.int(0, max) / (max);
    }

    public int(min: number, max: number) {
        const iMin = Math.ceil(min);
        const iMax = Math.floor(max);

        const range = iMax - iMin;

        if (range < 0 || !Num.isFinite(range)) {
            throw new RangeError(`Invalid range [${min}, ${max}]`);
        }

        const big = this.bigInt(BigInt(iMin), BigInt(iMax));
        return Number(big);
    }

    public bigInt(min: bigint, max: bigint) {
        if (min === max) {
            return min;
        }

        const range = max - min + 1n;

        let bytes = 0n;
        let maxNum = 1n;

        while (range > maxNum) {
            maxNum <<= 8n;
            bytes++;
        }

        const {maxAttempts, source} = this;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            let val = 0n;

            for (let i = 0; i < bytes; i++) {
                const byte = source.nextByte();
                const uint8 = (byte >>> 0) % 256;
                val = (val << 8n) + BigInt(uint8);
            }

            if (val < maxNum - maxNum % range) {
                return min + (val % range);
            }
        }

        throw new Error(`Random integer generation [${min}, ${max}] failed after ${maxAttempts} attempts`);
    }

    public uuid4() {
        const tpl = "10000000-1000-4000-8000-100000000000";
        return tpl.replace(/[018]/g, (x) => {
            const shift = +x / 4;
            const y = this.int(0, 15) >> shift;
            const v = +x ^ y;
            return v.toString(16);
        });
    }

    public shuffle<T extends any[]>(array: T): T {
        for (let i = array.length - 1; i > 0; --i) {
            const j = this.int(0, i);
            if (i === j) {
                continue;
            }
            const tmp = array[i];
            array[i] = array[j];
            array[j] = tmp;
        }
        return array;
    }
}
