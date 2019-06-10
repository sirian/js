import {CloneError, Cloner} from "../../src";

const data = [
    new WeakMap(),
    new WeakSet(),
];

test.each(data)("%o", (o) => {
    expect(() => Cloner.clone(o)).toThrow(CloneError);
    expect(() => Cloner.cloneDeep(o)).toThrow(CloneError);
    expect(Cloner.clone(o, {bypass: () => true})).toBe(o);
});
