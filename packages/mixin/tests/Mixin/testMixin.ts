import {Mixin} from "../../src";

interface ITimestampable {
    createdAt: Date;
    getCreatedAt: () => Date;
}

interface ISoftDeletable {
    isDeleted: () => boolean;
    deletedAt?: Date;
    setDeletedAt: (date: Date) => any;
}

const checkType = <T>(x: T) => {};

describe("Mixer.createConstructableMixin", () => {
    const Timestampable = Mixin.createConstructable((superclass) => class Timestampable extends superclass {
        public createdAt = new Date();

        public getCreatedAt() {
            return this.createdAt;
        }
    });

    const SoftDeletable = Mixin.createConstructable((superclass) => class SoftDeletable extends superclass {
        public deletedAt?: Date;

        public isDeleted() {
            return !!this.deletedAt;
        }

        public setDeletedAt(date = new Date()) {
            this.deletedAt = date;
        }
    });

    test("Timestampable", () => {
        const o = new Timestampable();
        expect(o).toBeInstanceOf(Timestampable);
        expect(o.createdAt).toBeInstanceOf(Date);
    });

    test("mix(SoftDeletable, Timestampable)", () => {
        const Foo = Mixin.mix(SoftDeletable, Timestampable);
        const o = new Foo();

        expect(o).toBeInstanceOf(Foo);
        expect(o).toBeInstanceOf(SoftDeletable);
        expect(o).toBeInstanceOf(Timestampable);

        expect(o.createdAt).toBeInstanceOf(Date);
        expect(o.isDeleted()).toBe(false);

        const date = new Date();
        o.setDeletedAt(date);
        expect(o.isDeleted()).toBe(true);
        expect(o.deletedAt).toBe(date);
    });

    test("mix(Bar, Timestampable, SoftDeletable)", () => {
        class Bar {
            public value: number;

            constructor(v: number) {
                this.value = v;
            }

            public get x() {
                return this.value;
            }

            public getX() {
                return this.x;
            }
        }

        class Foo extends Mixin.mix(Bar, Timestampable, SoftDeletable) {
            public foo = 3;
        }

        const value = 123;
        const o = new Foo(value);

        expect(o).toBeInstanceOf(Foo);
        expect(o).toBeInstanceOf(Bar);
        expect(o).toBeInstanceOf(SoftDeletable);
        expect(o).toBeInstanceOf(Timestampable);
        expect(o.isDeleted()).toBe(false);
        expect(o.createdAt).toBeInstanceOf(Date);
        expect(o.getCreatedAt()).toBeInstanceOf(Date);
        expect(o.x).toBe(value);
        expect(o.foo).toBe(3);
        expect(o.getX()).toBe(value);

        checkType<ITimestampable & ISoftDeletable>(o);
    });
});
