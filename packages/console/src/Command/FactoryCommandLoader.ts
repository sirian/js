import {hasOwn, Obj} from "@sirian/common";
import {CommandNotFoundError} from "../Error";
import {ICommandConstructor} from "./Command";
import {ICommandLoader} from "./ICommandLoader";

export class FactoryCommandLoader implements ICommandLoader {
    protected factories: Record<string, () => Promise<ICommandConstructor>>;

    constructor(factories: Record<string, () => Promise<ICommandConstructor>>) {
        this.factories = factories;

    }

    public has(name: string) {
        return hasOwn(this.factories, name);
    }

    public async get(name: string) {
        const cmd = this.factories[name];
        if (!cmd) {
            throw new CommandNotFoundError(`Command "${name}" does not exist.`);
        }
        return cmd();
    }

    public getNames() {
        return Obj.keys(this.factories);
    }
}
