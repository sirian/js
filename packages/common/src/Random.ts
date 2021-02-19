import {assert, swap} from "@sirian/common";

export const randomBits = (bits: number) => (2 ** bits) * randomReal01();
export const randomReal01 = () => Math.random();
export const randomUint8 = () => randomBits(8);
export const randomUint16 = () => randomBits(8);
export const randomUint32 = () => randomBits(32);

export const randomInt = (amin: number = 0, amax: number = 2 ** 32 - 1, inclusive: boolean = true) => {
    const imin = Math.ceil(amin);
    const imax = Math.floor(amax);

    const delta = (imax - imin) + (inclusive ? 1 : 0);
    assert(inclusive ? delta >= 0 : delta > 0, `Invalid range [${amin}, ${amax}]`);

    return imin + Math.trunc(delta * randomReal01());
};

export const randomReal = (min: number, max: number) => {
    return min + (max - min) * randomReal01();
};

export const randomElement = <T>(items: ArrayLike<T>) => {
    return items[randomInt(0, items.length - 1)];
};

export const shuffle = <T extends any[]>(array: T): T => {
    for (let i = array.length - 1; i > 0; --i) {
        const j = randomInt(0, i);
        swap(array, i, j);
    }
    return array;
};

export const weightShuffle = <T extends any[]>(array: T, weight: (value: T[number], index: number) => number): T => {
    array
        .map((v, i) => [weight(v, i) * randomReal01(), v])
        .sort((a, b) => b[0] - a[0])
        .forEach(([w, v], i) => array[i] = v)
    ;
    return array;
};
