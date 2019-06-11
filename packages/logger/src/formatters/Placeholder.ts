export class Placeholder {
    public value: any;
    public type?: string;
    public options: any;

    constructor(value: any, type?: string, options?: any) {
        this.value = value;
        this.type = type;
        this.options = options;
    }

    public toString() {
        return String(this.value);
    }
}
