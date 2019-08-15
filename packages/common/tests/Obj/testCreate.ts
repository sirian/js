import {Obj} from "../../src";

describe("Obj.create", () => {
    const empty = Object.create(null);

    class Foo {}

    const data: Array<[any[], object]> = [
        [[], empty],

        [[null], empty],
        [[null, undefined], empty],
        [[null, {}], empty],

        [[undefined], empty],
        [[undefined, undefined], empty],
        [[undefined, {}], empty],

        [[{}], {}],
        [[Foo.prototype], new Foo()],

        [[{}, {x: {value: 3}}], {x: 3}],
    ];

    test.each(data)("Obj.create(...%p) === %p", (args, expected) => {
        const obj = Obj.create(...args);
        expect(obj).toMatchObject(expected);
        expect(expected).toMatchObject(obj);
    });
});
