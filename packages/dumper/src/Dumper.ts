import {DumpItem} from "./DumpItem";

export const dump = <T>(arg: T) => Dumper.dump(arg);

export class Dumper {
    public static dump<T>(arg: T) {
        return new DumpItem(arg);
    }
}
