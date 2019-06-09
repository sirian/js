import {AccessorPropertyDescriptor, AssertExtends, AssertNotExtends, DataPropertyDescriptor} from "../../src";

type Test = [
    AssertExtends<{}, DataPropertyDescriptor>,
    AssertExtends<{ value: unknown }, DataPropertyDescriptor>,
    AssertExtends<{ value: any, writable: true }, DataPropertyDescriptor>,

    AssertExtends<{ set(x: string): void }, AccessorPropertyDescriptor<string>>,
    AssertExtends<{ get(): string; }, AccessorPropertyDescriptor<string>>,

    AssertExtends<{ value: 1 }, DataPropertyDescriptor<number>>,
    AssertExtends<{ configurable: true }, DataPropertyDescriptor>,

    AssertNotExtends<{}, AccessorPropertyDescriptor>,
    AssertNotExtends<{}, AccessorPropertyDescriptor>,
    AssertNotExtends<{ value: undefined }, AccessorPropertyDescriptor>
];
