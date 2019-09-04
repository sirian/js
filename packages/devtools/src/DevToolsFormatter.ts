import {DevToolsMLNode} from "./DevToolsML";

export interface IDevToolsFormatter {
    header: (object: any, config?: any) => null | DevToolsMLNode;
    hasBody: (object: any, config?: any) => boolean;
    body: (object: any, config?: any) => null | DevToolsMLNode;
}

export abstract class DevToolsFormatter<T, C> {
    constructor() {

    }

    public header(object: T, config?: C) {

    }

    public hasBody(object: T, config?: C) {

    }

    public body(object: T, config?: C) {

    }

    public abstract supports(object: any): object is T;
}
