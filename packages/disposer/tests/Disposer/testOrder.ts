import {XWeakMap} from "@sirian/common";
import {Disposer} from "../../src";

describe("Disposer", () => {
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
            Disposer.for(o).addChild(value);
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

        Disposer.events.on("dispose", (d) => calls.push("^" + names.get(d.target)));
        Disposer.events.on("disposed", (d) => calls.push("$" + names.get(d.target)));
        const target = prop.split(".").reduce((o: any, key) => o[key], obj);

        Disposer.dispose(target);
        expect(calls.join(",")).toStrictEqual(expected);

        Disposer.events.removeAllListeners();
    });
});
