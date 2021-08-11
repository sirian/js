import {toArray} from "./arr";
import {isFunction} from "./Is";
import {entriesOf} from "./obj";
import {isPlainObject} from "./var";
import {XMapInitializer} from "./utils";


export const parseMapArgs = (src?: any, initializer?: any): [Array<[any, any]>, XMapInitializer | undefined] =>
    isFunction(src) ?
        [[], src] :
        [isPlainObject(src) ? entriesOf(src) : toArray(src), initializer];
