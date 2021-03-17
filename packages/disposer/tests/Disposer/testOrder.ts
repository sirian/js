import {XWeakMap} from "@sirian/common";
import {Disposer, DisposerManager} from "../../src";

describe("Disposer", () => {
    const dm = new DisposerManager();
    // dm.on("error", console.error);

    const data = [
        ["ul", "^ul,^li1,$li1,^li2,^p1,$p1,^p2,$p2,$li2,^li3,^div1,$div1,$li3,$ul"],
        ["ul.li1", "^li1,$li1"],
        ["ul.li2", "^li2,^p1,$p1,^p2,$p2,$li2"],
        ["ul.li3", "^li3,^div1,$div1,$li3"],
        ["ul.li2.p1", "^p1,$p1"],
    ];

    const getNames = (o: object) => {
        const names: Array<[object, string]> = [];
        for (const [key, value] of Object.entries(o)) {
            names.push([value, key]);
            dm.for(o).addChild(value);
            names.push(...getNames(value));
        }
        return names;
    };

    test.each(data)("Dispose(obj.%s) === %o", (prop, expected) => {
        const obj = {
            ul: {
                li1: {},
                li2: {
                    p1: {},
                    p2: {},
                },
                li3: {
                    div1: {},
                },
            },
        };

        const calls: string[] = [];
        const names = new XWeakMap(getNames(obj));

        dm.on("dispose", (t, d) => calls.push("^" + names.get(t)));
        dm.on("disposed", (t, d) => calls.push("$" + names.get(t)));
        const target = prop.split(".").reduce((o: any, key) => o[key], obj);

        dm.dispose(target);
        expect(calls.join(",")).toStrictEqual(expected);
    });
});
