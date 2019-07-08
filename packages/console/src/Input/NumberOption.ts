import {IOptionInit, Option} from "./Option";

export class NumberOption extends Option<number> {
    constructor(name: string, shortcut: string, init?: IOptionInit<number>);
    constructor(name: string, init?: IOptionInit<number>);
    constructor(init?: IOptionInit<number>);

    constructor(...args: any[]) {
        const init = Option.resolveArgs<number>(args);

        super({
            valueRequired: true,
            normalizer: (value) => Number(value),
            ...init,
        });
    }
}
