import {Obj} from "../../src";
import * as globals from "../../src/native";

describe("", () => {
    const data: Array<[any, any]> = Obj.entries(globals).filter(([key]) => /^_/.test(key));

    test.each(data)(`%o is equal to global value`, (key, value) => {
        const globalKey = key.replace(/^_/, "");
        if (globalKey === key) {
            return;
        }

        const fn = new Function(`return ${globalKey};`);
        const expected = fn();

        expect(value).toBe(expected);
    });
});
