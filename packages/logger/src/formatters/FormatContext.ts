import {Var} from "@sirian/common";
import {PropertyPath} from "./PropertyPath";
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

    public getArgument(path?: string | number) {
        if (Var.isNullable(path)) {
            path = this.argIndex++;
        }

        if (Var.isNumber(path) || /^[0-9]+$/.test(path)) {
            const index = +path;
            this.handledArgs[index] = true;
            return this.args[index];
        }

        const arg: any = this.getArgument(0);

        return this.readProperty(arg, path);
    }

    public getExtraArgs() {
        return this.args
            .filter((arg, index) => !this.isHandledArg(index));
    }

    public toString() {
        return this.formatted.join("");
    }

    protected readProperty(value: any, path: string) {
        const p = new PropertyPath(path);
        for (const part of p) {
            if (!Var.isObjectOrFunction(value)) {
                return "";
            }
            value = (value as any)[part.key];
        }
        return value;
    }
}
