import {extendDescriptor} from "../../src";

describe("extendDescriptor", () => {
    const def = {configurable: true, enumerable: false};
    const defData = {...def, writable: true};
    const set1 = () => {};
    const set2 = () => {};
    const get1 = () => {};
    const get2 = () => {};

    const data: Array<[any, any, any]> = [
        [null, {}, {...defData}],
        [undefined, {}, {...defData}],
        [{}, {}, {...defData}],
        [{value: 1, writable: true}, {get: get2}, {...def, get: get2}],
        [{set: set1, get: get1}, {set: set2}, {...def, get: get1, set: set2}],
        [{get: get1}, {get: get2}, {...def, get: get2}],
        [{get: get1, set: set1}, {writable: false}, {...def, writable: false}],
        [{get: get1, set: set1}, {value: 2}, {...def, writable: true, value: 2}],
        [{value: null}, {}, {...defData, writable: true, value: null}],
    ];

    test.each(data)("Descriptor.extend(%p, %p) === %p", (desc, value, expected) => {
        expect(extendDescriptor(desc, value)).toStrictEqual(expected);
    });
});
