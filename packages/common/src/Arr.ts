import {Var} from "./Var";
import {XSet} from "./XSet";

export class Arr {
    public static removeItem<T>(array: T[], value: T, limit?: number) {
        return Arr.remove(array, (item) => Var.isEqual(item, value), limit);
    }

    public static remove<T>(array: T[], predicate: (value: T, index: number, obj: T[]) => boolean, limit = 1 / 0) {
        let removed = 0;

        for (let i = 0; i < array.length;) {
            if (removed >= limit) {
                break;
            }

            const remove = predicate(array[i], i, array);

            if (!remove) {
                i++;
                continue;
            }

            removed++;
            array.splice(i, 1);
        }

        return array;
    }

    public static intersect<T>(array: T[], ...arrays: T[][]): T[] {
        const sets = arrays.map((arr) => new Set(arr));

        return array.filter((value) => sets.every((set) => set.has(value)));
    }

    public static chunk(value: any[], size: number) {
        const result = [];

        for (let i = 0; i < value.length; i += size) {
            result.push(value.slice(i, i + size));
        }
        return result;
    }

    public static cast<T>(value: T | T[]): T[] {
        return Var.isArray(value) ? value : [value];
    }

    public static removeDuplicates<T>(array: T[]) {
        const set = new XSet(array);

        array.splice(0, array.length, ...set);

        return array;
    }

    public static range(from: number, to: number, step: number = 1) {
        const result = [];
        const sign = Math.sign(step);
        while (sign * (to - from) >= 0) {
            result.push(from);
            from += step;
        }
        return result;
    }
}
