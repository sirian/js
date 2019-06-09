export class Proc {
    public static escapeArg(arg: string) {
        const ret = arg.replace(/[^\\]'/g, (m) => m.slice(0, 1) + "\\'");

        return "'" + ret + "'";
    }
}
