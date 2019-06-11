import {InvalidArgumentError} from "../Error";
import {FormatterStyle} from "./FormatterStyle";

export class FormatterStyleStack {
    protected styles: FormatterStyle[];
    protected emptyStyle: FormatterStyle;

    constructor(emptyStyle?: FormatterStyle) {
        this.styles = [];
        this.emptyStyle = emptyStyle || new FormatterStyle();
        this.reset();
    }

    public reset() {
        this.styles.length = 0;
    }

    public push(style: FormatterStyle) {
        this.styles.push(style);
    }

    public pop(style?: FormatterStyle): FormatterStyle {
        const styles = this.styles;

        if (!styles.length) {
            return this.emptyStyle;
        }

        if (!style) {
            return styles.pop()!;
        }

        for (let index = styles.length - 1; index >= 0; index--) {
            const stackedStyle = styles[index];

            if (style.apply("") === stackedStyle.apply("")) {
                this.styles = styles.slice(0, index);

                return stackedStyle;
            }
        }

        throw new InvalidArgumentError("Incorrectly nested style tag found.");
    }

    public getCurrent() {
        const styles = this.styles;

        if (!styles.length) {
            return this.emptyStyle;
        }

        return styles[styles.length - 1];
    }

    public setEmptyStyle(emptyStyle: FormatterStyle) {
        this.emptyStyle = emptyStyle;

        return this;
    }

    public getEmptyStyle() {
        return this.emptyStyle;
    }
}
