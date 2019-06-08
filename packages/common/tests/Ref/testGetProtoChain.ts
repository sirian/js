import {Ref, Var} from "../../src";

describe("Ref.getProtoChain", () => {
    class Foo {}

    class Bar extends Foo {}

    class Zoo extends Array {}

    class Baz extends Function {}

    const fnProto = Function.prototype;
    const objProto = Object.prototype;

    const data: Array<[any, object[]]> = [
        [1, []],
        ["", []],
        [null, []],
        [undefined, []],

        [Foo, [fnProto, objProto]],
        [Bar, [Foo, fnProto, objProto]],
        [Baz, [Function, fnProto, objProto]],
        [Zoo, [Array, fnProto, objProto]],
        [Array, [fnProto, objProto]],

        [[], [Array.prototype, objProto]],
        [Object(null), [objProto]],
        [{}, [objProto]],
        [new Bar(), [Bar.prototype, Foo.prototype, objProto]],
        [new Baz(), [Baz.prototype, fnProto, objProto]],
    ];

    for (const [target, chain] of data) {
        if (Var.isObjectOrFunction(target)) {
            chain.unshift(target);
        }
    }

    test.each(data)("Ref.getProtoChain(%p) === %p", (target, expected) => {
        const chain = Ref.getProtoChain(target);
        expect(chain).toStrictEqual(expected);
    });

});