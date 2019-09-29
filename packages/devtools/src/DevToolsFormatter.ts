import {Ctor} from "@sirian/ts-extra-types";
import {DevTools} from "./DevTools";
import {DevToolsMLNode} from "./DevToolsML";
import {DevToolsWrapper} from "./DevToolsWrapper";

export interface IDevToolsFormatter<T = any, C = any> {
    header: (object: T, config?: C) => void | null | DevToolsMLNode;
    hasBody: (object: T, config?: C) => boolean;
    body: (object: T, config?: C) => void | null | DevToolsMLNode;
    priority?: number;
}

export abstract class DevToolsFormatter<T = any, C = any> implements IDevToolsFormatter {
    protected readonly wrapper: DevToolsWrapper<T, C>;

    constructor() {
        this.wrapper = new DevToolsWrapper(this);
    }

    public static enable<F extends DevToolsFormatter, A extends any[]>(this: Ctor<F, A>, ...args: A) {
        return new this(...args);
    }

    public header(object: T, config: C) {

    }

    public hasBody(object: T, config: C) {
        return false;
    }

    public body(object: T, config: C) {

    }

    public abstract resolveConfig(target: any, config?: any): C | undefined;

    public enable(win: Window = window) {
        DevTools.addFormatter(this.wrapper);
    }

    public disable(win: Window = window) {
        DevTools.removeFormatter(this.wrapper);
    }
}
