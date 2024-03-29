import {swap} from "./arr";
import {assert} from "./Error";
import {toInt} from "./num";

export const randomReal01 = () => Math.random();

export const randomBits = (bits: number) => toInt((2 ** bits) * randomReal01());
export const randomUint8 = () => randomBits(8);
export const randomUint16 = () => randomBits(16);
export const randomUint32 = () => randomBits(32);

export const randomInt = (min = 0, max: number = 2 ** 32 - 1, inclusive = true) => {
    const imin = Math.ceil(min);
    const imax = Math.floor(max);

    const delta = (imax - imin) + (inclusive ? 1 : 0);
    assert(inclusive ? delta >= 0 : delta > 0, "Invalid range", {min, max, inclusive});

    return imin + toInt(delta * randomReal01());
};

export const randomReal = (min: number, max: number) => min + (max - min) * randomReal01();

export const randomElement = <T>(items: ArrayLike<T>) => items[randomInt(0, items.length - 1)];

export const shuffle = <T extends any[]>(array: T): T => {
    for (let i = array.length - 1; i > 0; --i) {
        const j = randomInt(0, i);
        swap(array, i, j);
    }
    return array;
};

const weightedPickIndex = (array: number[]) => {
    const total = array.reduce((cur, a) => cur + a, 0);
    const threshold = randomReal(0, total);

    let sum = 0;
    for (const [i, element] of array.entries()) {
        sum += element;
        if (sum >= threshold) {
            return i;
        }
    }

    return array.length - 1;
};

export const weightedShuffle = <T>(array: T[], weight: (value: T) => number) => {
    const weights = array.map((v) => weight(v));
    const values = array.splice(0);
    while (weights.length) {
        const index = weightedPickIndex(weights);
        weights.splice(index, 1);
        const [v] = values.splice(index, 1);
        array.push(v);
    }
    return array;
};

export const weightedPick = <T>(array: T[], weight: (value: T) => number): T => {
    const tmp = array.map((v) => weight(v));
    const index = weightedPickIndex(tmp);
    return array[index];
};
