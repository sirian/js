import {Decorator} from "../../src";

// tslint:disable:max-classes-per-file

const map = new Map();
const decorator = Decorator.forProperty((foo?: string, bar: number = 3) => {
    return (target, key) => {
        map.set(target, [target, key, foo, bar]);
    };
});

function check(c: any, ...args: any[]) {
    const dArgs = [c.prototype, "foo"];
    expect(map.get(c.prototype)).toStrictEqual([...dArgs, ...args]);
}

test("@decorator", () => {
    class User {
        @decorator
        public foo!: string;
    }

    check(User, undefined, 3);
});

test("@decorator()", () => {
    class User {
        @decorator()
        public foo!: string;
    }

    check(User, undefined, 3);
});

test("@decorator('foo')", () => {
    class User {
        @decorator("foo")
        public foo!: string;
    }

    check(User, "foo", 3);
});

test("@decorator('foo', 4)", () => {
    class User {
        @decorator("foo", 4)
        public foo!: string;
    }

    check(User, "foo", 4);
});
