import {isObject} from "@sirian/common";

export class Transition<S extends string = any> {
    public readonly name: string;
    public readonly froms: S[];
    public readonly tos: S[];

    constructor(name: string, froms: S | Iterable<S>, tos: S | Iterable<S>) {
        Transition.validateName(name);

        this.name = name;
        this.froms = this.normalize(froms);
        this.tos = this.normalize(tos);
    }

    public static validateName(name: string) {
        if (!/^[-_\w]+$/.test(name)) {
            throw new Error(`The transition "${name}" contains invalid characters.`);
        }
    }

    protected normalize(value: S | Iterable<S>) {
        if (isObject(value)) {
            return [...value];
        }

        return [value];
    }
}
