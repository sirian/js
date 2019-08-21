import {Descriptor} from "../../src";

describe("Descriptor.extend", () => {
    const def = {configurable: true, enumerable: false};
    const defData = {...def, value: undefined, writable: true};
    const set1 = () => {};
    const set2 = () => {};
    const get1 = () => {};
    const get2 = () => {};

    const data: Array<[any, any, any]> = [
        [{}, {}, {...defData}],
        [{value: 1, writable: true}, {get: get2}, {...def, get: get2, set: undefined}],
        [{set: set1, get: get1}, {set: set2}, {...def, get: get1, set: set2}],
        [{get: get1}, {get: get2}, {...def, get: get2, set: undefined}],
        [{value: null}, {}, {...defData, value: null}],
    ];

    test.each(data)("Descriptor.extend(%p, %p) === %p", (desc, value, expected) => {
        expect(Descriptor.extend(desc, value)).toStrictEqual(expected);
    });
});
