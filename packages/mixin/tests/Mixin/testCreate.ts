import {Mixin} from "../../src";

describe("", () => {
    const MyMixin = Mixin.createConstructable((superclass) => class extends superclass {
        public x = 1;
        public field = "field";

        public get getter() {
            return "getter";
        }

        public getX() {
            return this.x;
        }

        public getField() {
            return this.field;
        }
    });

    const validate = (o: any) => {
        expect(o).toBeInstanceOf(MyMixin);
        expect(o.field).toBe("field");
        expect(o.getter).toBe("getter");
        expect(o.getX()).toBe(o.x);
        expect(o.getField()).toBe("field");
    };

    class ExtendedMixin extends MyMixin {
        public x = 2;
    }

    class Foo {
        public x = 3;
    }

    class FooMixined extends MyMixin(Foo) {
        public x = 4;
    }

    class Bar extends FooMixined {
        public x = 5;
    }

    test("", () => {
        const obj = new MyMixin();
        validate(obj);
        expect(obj.x).toBe(1);
    });

    test("", () => {
        const obj = new ExtendedMixin();
        validate(obj);
        expect(obj).toBeInstanceOf(ExtendedMixin);
        expect(obj.x).toBe(2);
    });

    test("", () => {
        const obj = new FooMixined();
        validate(obj);
        expect(obj).toBeInstanceOf(Foo);
        expect(obj).toBeInstanceOf(FooMixined);
        expect(obj.x).toBe(4);
    });

    test("", () => {
        const obj = new Bar();
        validate(obj);
        expect(obj).toBeInstanceOf(Foo);
        expect(obj).toBeInstanceOf(FooMixined);
        expect(obj).toBeInstanceOf(Bar);
        expect(obj.x).toBe(5);
    });
});
