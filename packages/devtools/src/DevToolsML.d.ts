export type DevToolsMLTag = "object" | "span" | "div" | "table" | "tr" | "td" | "ol" | "li";

export interface DevToolsMLAttr {
    style?: string;
    object?: object;
    config?: any;
}

export type DevToolsMLValue = DevToolsMLNode | string;

export type DevToolsMLNode = [DevToolsMLTag, DevToolsMLAttr, ...DevToolsMLValue[]];
