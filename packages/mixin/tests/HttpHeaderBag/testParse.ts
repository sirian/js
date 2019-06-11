import {HttpHeaderBag} from "../../src";

test("", () => {
    const input = [
        "Date: Tue, 10 Jun 2014 07:29:20 GMT",
        "Connection: keep-alive",
        "Transfer-Encoding: chunked",
        "Age: foo",
        "Age: bar",
        "Set-Cookie: cookie",
        "X-List: A",
        "X-Multi-Line-Header: Foo",
        " Bar",
        "X-List: B",
        "",
    ].join("\r\n");

    const expected = [
        ["Date", "Tue, 10 Jun 2014 07:29:20 GMT"],
        ["Connection", "keep-alive"],
        ["Transfer-Encoding", "chunked"],
        ["Age", "foo"],
        ["Age", "bar"],
        ["Set-Cookie", "cookie"],
        ["X-List", "A"],
        ["X-Multi-Line-Header", "Foo Bar"],
        ["X-List", "B"],
    ];

    const bag = HttpHeaderBag.fromString(input);

    const headers = bag.all().map((h) => [h.name, h.value]);

    expect(headers).toStrictEqual(expected);
});
