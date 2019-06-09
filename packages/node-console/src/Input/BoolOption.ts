import {ValueNormalizeError} from "../Error";
import {IOptionInit, Option} from "./Option";

export class BoolOption extends Option<boolean> {
    protected trueValues: string[];
    protected falseValues: string[];

    constructor(name: string, shortcut: string, init?: IOptionInit<boolean>);
    constructor(name: string, init?: IOptionInit<boolean>);
    constructor(init?: IOptionInit<boolean>);

    constructor(...args: any[]) {
        const init = Option.resolveArgs<boolean>(args);

        super({
            default: false,
            defaultValue: true,
            valueRequired: false,
            normalizer: (value) => {
                if (this.falseValues.includes(value)) {
                    return false;
                }

                if (this.trueValues.includes(value)) {
                    return true;
                }

                throw new ValueNormalizeError(`Could not normalize value "${value}" for option ${this.getName()}`);
            },
            ...init,
        });

        this.trueValues = ["1", "y", "yes", "true"];
        this.falseValues = ["", "0", "n", "no", "false"];
    }
}
