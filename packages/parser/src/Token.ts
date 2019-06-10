export type TokenTypes = Record<number | string, any>;

export class Token<T extends TokenTypes = TokenTypes, K extends keyof T = keyof T> {
    public readonly type: K;
    public readonly value: T[K];
    public readonly position: number;

    constructor(type: K, value: T[K], pos: number) {
        this.type = type;
        this.value = value;
        this.position = pos;
    }

    public toString() {
        const {position, value, type} = this;

        if (value) {
            return `<${type} "${value}" at ${position}>`;
        }

        return `<${type} at ${position}> `;
    }

    public is(...types: Array<keyof T>) {
        return -1 !== types.indexOf(this.type);
    }

    public test(type: keyof T, value: any) {
        return this.type === type && value === this.value;
    }
}
