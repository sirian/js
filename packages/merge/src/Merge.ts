import {Cloner} from "@sirian/clone";
import {MergeContext} from "./MergeContext";

export interface MergeOptions {
    clone?: boolean;
    deep?: boolean;
    allowAdd?: boolean;
    cloner?: Cloner;
}

export class Merge {
    public static merge<T extends object[], O extends MergeOptions>(objects: T, options?: O) {
        if (!objects.length) {
            return;
        }

        let target: any = objects.shift();
        objects.unshift({});

        for (const source of objects) {
            const ctx = new MergeContext(target, source, {options});

            target = ctx.merge();
        }

        return target;
    }
}
