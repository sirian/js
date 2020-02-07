import {Cloner} from "@sirian/clone";
import {hasOwn, isPlainObject, Obj} from "@sirian/common";

export interface MergeOptions {
    clone?: boolean;
    maxDepth?: number;
    allowAdd?: boolean;
    cloner?: Cloner;
}

export class Merge {
    public static merge<T extends object[], O extends MergeOptions>(objects: T, opts?: O) {
        if (!objects.length) {
            return;
        }

        const options = {
            clone: true,
            maxDepth: 1 / 0,
            allowAdd: true,
            cloner: Cloner.defaultCloner,
            ...opts,
        };

        let target: any = objects.shift();

        for (const source of objects) {
            target = this.doMerge(target, source, options);
        }

        return target;
    }

    protected static doMerge(target: any, source: any, options: Required<MergeOptions>) {
        const {clone, cloner, maxDepth, allowAdd} = options;

        if (!isPlainObject(source)) {
            if (clone) {
                source = cloner.clone(source);
            }
            return source;
        }

        if (clone) {
            target = cloner.clone(target);
        }

        const keys = Obj.keys(source);

        for (const key of keys) {
            if (!allowAdd && !hasOwn(target, key)) {
                continue;
            }

            const value = target[key];
            const newValue = source[key];

            if (maxDepth > 0 && isPlainObject(value) && isPlainObject(newValue)) {
                const childOptions = {...options};
                childOptions.maxDepth--;

                target[key] = this.doMerge(value, newValue, childOptions);
                continue;
            }

            target[key] = newValue;
        }

        return target;
    }
}
