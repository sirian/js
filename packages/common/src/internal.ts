import {toArray} from "./Arr";
import {isFunction} from "./Is";
import {entriesOf} from "./Obj";
import {isPlainObject} from "./Var";
import {XMapInitializer} from "./XUtils";


export const parseMapArgs = (src?: any, initializer?: any): [Array<[any, any]>, XMapInitializer | undefined] =>
    isFunction(src) ?
        [[], src] :
        [isPlainObject(src) ? entriesOf(src) : toArray(src), initializer];
