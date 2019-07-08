import {ICommandConstructor} from "./Command";

export interface ICommandLoader {
    get(name: string): Promise<ICommandConstructor>;

    has(name: string): boolean;

    getNames(): string[];
}
