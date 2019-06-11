export type JsonMLTag = "object" | "span" | "div" | "table" | "tr" | "td" | "ol" | "li";

export interface JsonMLAttr {
    style?: string;
    object?: object;
    config?: any;
}

export interface JsonML extends Array<string | JsonMLAttr | JsonML> {
    [0]: JsonMLTag;
    [1]: JsonMLAttr;
}
