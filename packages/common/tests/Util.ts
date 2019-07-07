import {Push} from "@sirian/ts-extra-types";

export class Util {
    public static eval(code: string) {
        const fn = new Function(`return (${code})`);
        return fn();
    }

    public static mergeData<T>(trueData: T[], falseData: T[], oneArg: true): Array<[T, boolean]>;
    public static mergeData<T extends any[]>(trueData: T[], falseData: T[], oneArg: false): Array<Push<T, boolean>>;

    public static mergeData(trueData: any[], falseData: any[], oneArg: boolean) {
        return [
            ...trueData.map((values) => oneArg ? [values, true] : [...values, true]),
            ...falseData.map((values) => oneArg ? [values, false] : [...values, false]),
        ] as any;
    }
}
