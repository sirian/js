import {CloneOptions, Cloner} from "@sirian/clone";
import {CtorArgs} from "@sirian/ts-extra-types";

export interface DumpOptions {
    cloner: Cloner;
    clone: Partial<CloneOptions>;
}

export class Dump<T = any> {
    public target: T;
    public options: DumpOptions;
    public snapshot: T;

    constructor(target: any, options: Partial<DumpOptions> = {}) {
        this.target = target;
        this.options = {
            cloner: Cloner.defaultCloner,
            clone: {},
            ...options,
        };

        const {clone, cloner} = this.options;
        this.snapshot = cloner.clone(target, clone);
    }
}

export const dump = (...args: CtorArgs<typeof Dump>) => new Dump(...args);
