import {Decorator} from "../../src";

// tslint:disable:max-classes-per-file
// tslint:disable:no-empty

const map = new Map();
const decorator = Decorator.forMethod((foo?: string, bar: number = 3) => {
    return (target, key, descriptor: PropertyDescriptor) => {
        map.set(target, [target, key, descriptor, foo, bar]);
    };
});

function check(c: any, ...args: any[]) {
    const dArgs = [c.prototype, "foo", Object.getOwnPropertyDescriptor(c.prototype, "foo")];
    expect(map.get(c.prototype)).toStrictEqual([...dArgs, ...args]);
}

test("@decorator", () => {
    class User {
        @decorator
        public foo() {}
    }

    check(User, undefined, 3);
});

test("@decorator()", () => {
    class User {
        @decorator()
        public foo() {}
    }

    check(User, undefined, 3);
});

test("@decorator('foo')", () => {
    class User {
        @decorator("foo")
        public foo() {}
    }

    check(User, "foo", 3);
});

test("@decorator('foo', 4)", () => {
    class User {
        @decorator("foo", 4)
        public foo() {}
    }

    check(User, "foo", 4);
});
