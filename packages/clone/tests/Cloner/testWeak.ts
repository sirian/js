import {clone, cloneDeep, CloneError} from "../../src";

const data = [
    new WeakMap(),
    new WeakSet(),
];

test.each(data)("%o", (o) => {
    expect(() => clone(o)).toThrow(CloneError);
    expect(() => cloneDeep(o)).toThrow(CloneError);
    expect(clone(o, {bypass: () => true})).toBe(o);
});
