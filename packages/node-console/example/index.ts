import {Obj, Ref, Var} from "@sirian/common";
import {Application, Command, CommandNotFoundError, ICommandLoader} from "../src";

class MyLoader implements ICommandLoader {
    protected factories: Record<string, () => Promise<any>>;

    constructor(factories: Record<string, () => Promise<any>>) {
        this.factories = factories;

    }

    public has(name: string) {
        return Ref.hasOwn(this.factories, name);
    }

    public getNames() {
        return Obj.keys(this.factories);
    }

    public async get(name: string) {
        const fn = this.factories[name];
        const importResult = await fn();
        for (const [key, value] of Object.entries(importResult)) {
            if (Var.isSubclassOf(value, Command)) {
                return value;
            }
        }
        throw new CommandNotFoundError(`Command "${name}" not found`);
    }
}

const app = new Application({
    name: "Example application",
    commandLoader: new MyLoader({
        progress: () => import("./ProgressCommand"),
        table: () => import("./HelloCommand"),
        hello: () => import("./TableCommand"),
    }),
});

app.run();
