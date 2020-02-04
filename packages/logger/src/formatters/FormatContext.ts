import {isNullable, isNumber} from "@sirian/common";
import {Property} from "@sirian/property-access";
import {StyleStack} from "./StyleStack";

export class FormatContext {
    public readonly args: any[];
    protected argIndex: number;
    protected formatted: any[] = [];
    protected handledArgs: boolean[] = [];
    protected styleStack: StyleStack;

    constructor(args: any[]) {
        this.args = args;
        this.argIndex = 0;
        this.styleStack = new StyleStack();
    }

    public isHandledArg(index: number) {
        return this.handledArgs[index];
    }

    public push(...values: any[]) {
        this.formatted.push(...values);
        return this;
    }

    public getFormatted() {
        return this.formatted;
    }

    public setFormatted(values: any[]) {
        this.formatted = values;
        return this;
    }

    public getArgument(path?: string | number): any {
        if (isNullable(path)) {
            path = this.argIndex++;
        }

        if (isNumber(path) || /^[0-9]+$/.test(path)) {
            const index = +path;
            this.handledArgs[index] = true;
            return this.args[index];
        }

        const arg = this.getArgument(0);

        return Property.read(arg, path);
    }

    public getExtraArgs() {
        return this.args
            .filter((arg, index) => !this.isHandledArg(index));
    }

    public toString() {
        return this.formatted.join("");
    }
}
