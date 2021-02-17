import {castArray, stringifyStr} from "@sirian/common";
import {TagToken} from "../../parser/token";

export class JML {
    public readonly tagName: string;
    public readonly classes: Set<string>;
    protected parent?: JML;
    protected children: any[];

    constructor(tagName: string) {
        this.tagName = JML.normalizeTagName(tagName);
        this.classes = new Set<string>();
        this.children = [];
    }

    public static fromToken(token: TagToken) {
        const classes = token.tag.split(".");
        return this.create(classes[0]).setClasses(classes);
    }

    public static create(tag: string) {
        return new JML(tag);
    }

    public static normalizeTagName(tagName: string) {
        return stringifyStr(tagName).toLowerCase();
    }

    public addClass(name: string) {
        this.classes.add(name);

        return this;
    }

    public removeClass(names?: string | string[]) {
        if (!names) {
            this.classes.clear();
            return this;
        }
        for (const name of castArray(names)) {
            this.classes.delete(name);
        }

        return this;
    }

    public getClasses() {
        return [...this.classes];
    }

    public setClasses(names: string[]) {
        this.classes.clear();
        this.addClasses(names);
        return this;
    }

    public addClasses(names: string[]) {
        for (const name of names) {
            this.addClass(name);
        }
        return this;
    }

    public append(...children: any[]) {
        this.children.push(...children);
        return this;
    }

    public setParent(parent?: JML) {
        this.parent = parent;
        return this;
    }

    public getParent() {
        return this.parent;
    }

    public getChildren() {
        return this.children;
    }

    public closest(tagName?: string): JML | undefined {
        const parent = this.parent;

        if (!parent) {
            return;
        }

        if (!tagName) {
            return parent;
        }

        if (parent.tagName === tagName) {
            return parent;
        }

        return parent.closest(tagName);
    }
}
