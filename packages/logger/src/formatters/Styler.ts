import {dashCase, entriesOf, hasOwn, isObject, stringifyVar} from "@sirian/common";
import {StyleInit} from "./StyleStack";

export class Styler {
    protected styles: Record<string, StyleInit>;

    constructor(styles: Record<string, StyleInit> = {}) {
        this.styles = {};
        this.addStyles(styles);
    }

    public static normalizeStyle(style?: string | Record<string, string | number>): string {
        if (!isObject(style)) {
            return stringifyVar(style);
        }

        const result = [];
        for (const [key, value] of entriesOf(style)) {
            result.push(dashCase(key), ":", value, ";");
        }
        return result.join("");
    }

    public setStyles(styles: Record<string, StyleInit>) {
        this.styles = {};
        this.addStyles(styles);
        return this;
    }

    public addStyles(styles: Record<string, StyleInit>) {
        for (const [name, style] of entriesOf(styles)) {
            this.setStyle(name, style);
        }
        return this;
    }

    public getStyle(name: string, defaultValue?: string) {
        return this.hasStyle(name) ? this.styles[name] : defaultValue;
    }

    public hasStyle(name: string) {
        return hasOwn(this.styles, name);
    }

    public setStyle(name: string, style: StyleInit) {
        this.styles[name] = Styler.normalizeStyle(style);
        return this;
    }

    public compute(styleNames: string[]) {
        return styleNames
            .map((name) => this.getStyle(name, ""))
            .join("");
    }
}
