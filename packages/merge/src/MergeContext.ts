import {Cloner} from "@sirian/clone";
import {Obj, Ref, Var} from "@sirian/common";
import {MergeOptions} from "./Merge";

export interface MergeContextInit<T, S> {
    options?: MergeOptions;
    key?: string;
    parent?: MergeContext<any, any>;
}

export class MergeContext<T, S> {
    public readonly parent?: MergeContext<any, any>;
    public readonly depth: number;
    public readonly options: MergeOptions;
    public readonly key?: string;

    public target: T;
    public source: S;
    public readonly cloner: Cloner;

    constructor(target: T, source: S, init: MergeContextInit<T, S>) {
        this.parent = init.parent;
        this.target = target;
        this.source = source;
        this.key = init.key;
        this.depth = this.parent ? this.parent.depth + 1 : 0;
        this.options = {
            clone: true,
            deep: true,
            allowAdd: true,
            ...init.options,
        };

        this.cloner = this.options.cloner || Cloner.defaultCloner;
    }

    public merge() {
        const source: any = this.source;
        const {clone, allowAdd, deep} = this.options;
        let target: any = this.target;
        const keys = Obj.keys(source);

        if (clone) {
            target = this.cloner.clone(target);
        }

        for (const key of keys) {
            if (!allowAdd && !Ref.hasOwn(target, key)) {
                continue;
            }

            const value = target[key];
            const newValue = source[key];

            if (deep && Var.isPlainObject(value) && Var.isPlainObject(newValue)) {
                const ctx = new MergeContext(value, newValue, {
                    options: this.options,
                    parent: this,
                    key,
                });

                target[key] = ctx.merge();
                continue;
            }

            target[key] = newValue;
        }
        return target;
    }
}
