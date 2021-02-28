import {valuesOf} from "@sirian/common";
import {Args} from "@sirian/ts-extra-types";
import {Decorators, DecoratorType, parseDecoratorArgs} from "../../src";
// tslint:disable:un

describe("", () => {
    const data: Array<[DecoratorType, any]> = [];

    const factory = <T extends DecoratorType>(type: T) => {
        return ((...args: Args<Decorators[T]>) => {
            data.push([type, args]);
        }) as Decorators[T];
    };

    @factory(DecoratorType.CLASS)
    class Foo {
        @factory(DecoratorType.PROPERTY)
        protected prop?: number;

        @factory(DecoratorType.PROPERTY)
        protected get getterProp() {
            return 1;
        }

        @factory(DecoratorType.METHOD)
        protected get getterMethod() {
            return 2;
        }

        @factory(DecoratorType.METHOD)
        protected foo(@factory(DecoratorType.PARAMETER) x: number) {

        }
    }

    expect(Foo).toBe(Foo);

    test.each(data)("Decorator.parseArgs(%s, %O)", (type, args) => {
        const params = parseDecoratorArgs(type, args);
        expect(valuesOf(params)).toStrictEqual(args);
    });

});
