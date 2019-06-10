export type StyleInit = string | Record<string, string | number>;

export class StyleStack {
    protected readonly stack: string[];

    constructor(stack: string[] = []) {
        this.stack = [...stack];
    }

    public push(...names: string[]) {
        this.stack.push(...names);
    }

    public pop(...names: string[]) {
        const stack = this.stack;

        if (!names.length) {
            return this.stack.splice(-1);
        }

        const result = [];

        for (let i = names.length - 1; i >= 0; --i) {
            const name = names[i];

            const pos = stack.lastIndexOf(name);
            if (-1 === pos) {
                continue;
            }
            const splice = stack.splice(pos);
            result.unshift(...splice);
        }

        return result;
    }

    public getStack() {
        return [...this.stack];
    }
}
