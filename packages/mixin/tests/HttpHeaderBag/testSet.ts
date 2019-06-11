import {HttpHeaderBag} from "../../src";

test("HttpHeaderBag.set", () => {
    const h = new HttpHeaderBag();

    h.set("FOO", 1);
    expect(h.toString()).toBe("Foo: 1\r\n");

    h.set("foo", "2");
    expect(h.toString()).toBe("Foo: 2\r\n");

    h.set("bar", 3);
    expect(h.toString()).toBe("Bar: 3\r\nFoo: 2\r\n");
});
