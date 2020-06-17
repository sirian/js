import {CloneOptions, cloner, Cloner} from "@sirian/clone";
import {CtorArgs} from "@sirian/ts-extra-types";

export interface DumpOptions {
    cloner: Cloner;
    clone: Partial<CloneOptions>;
}

export const dump = (...args: CtorArgs<typeof Dump>) => new Dump(...args);

export class Dump<T = any> {
    public target: T;
    public options: DumpOptions;
    public snapshot: T;

    constructor(target: any, options: Partial<DumpOptions> = {}) {
        this.target = target;
        this.options = {
            cloner,
            clone: {},
            ...options,
        };

        const {clone, cloner: c} = this.options;
        this.snapshot = c.clone(target, clone);
    }
}
