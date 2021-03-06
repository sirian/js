import {URL} from "url";
import {objSnapshot} from "../../src";

describe("Obj.snapshot", () => {
    test("Obj.snapshot", () => {
        class Foo {
            constructor(public x = 1) {}

            get y() {
                return this.x - 1;
            }

            public bar() {
                return 3;
            }
        }

        const target = new Foo();

        const expected = {
            x: 1,
            y: 0,
        };

        expect({...target}).toStrictEqual({x: 1});
        expect(JSON.stringify(target)).toStrictEqual(JSON.stringify({x: 1}));

        expect(objSnapshot(target)).toStrictEqual(expected);
        expect(JSON.stringify(objSnapshot(target))).toStrictEqual(JSON.stringify(expected));
    });

    test("Obj.snapshot(URL)", () => {
        const url = new URL("https://example.org/foo?x=1#bar");

        const expected = {
            hash: "#bar",
            host: "example.org",
            hostname: "example.org",
            href: "https://example.org/foo?x=1#bar",
            origin: "https://example.org",
            password: "",
            pathname: "/foo",
            port: "",
            protocol: "https:",
            search: "?x=1",
            searchParams: url.searchParams,
            username: "",
        };
        expect(objSnapshot(url)).toStrictEqual(expected);
    });
});
