import {dedent} from "../src";

test("", () => {
    expect(dedent`foo`).toBe("foo");

    expect(dedent`foo
         bar`).toBe("foo\nbar");

    expect(dedent`
        foo
        bar`).toBe("foo\nbar");

    expect(dedent`
        foo
        bar
    `).toBe("foo\nbar");

    expect(dedent`
        foo

        bar
    `).toBe("foo\n\nbar");

    expect(dedent`

        foo
        bar
    `).toBe("\nfoo\nbar");

    expect(dedent`

        foo
        bar

    `).toBe("\nfoo\nbar\n");

    expect(dedent` foo
    bar`).toBe(" foo\nbar");

    expect(dedent` foo
    bar
        zoo`).toBe(" foo\nbar\n    zoo");

    expect(dedent`foo\n\tbar`).toBe("foo\n\tbar");
    expect(dedent("foo\n\tbar")).toBe("foo\nbar");
    expect(dedent(" foo\n\tbar")).toBe("foo\nbar");

    expect(dedent`foo\n\tbar`).toBe("foo\n\tbar");

    expect(dedent`\nfoo\n\tbar`).toBe("\nfoo\n\tbar");

    expect(dedent`\nfoo\n\tbar`).toBe("\nfoo\n\tbar");

    expect(dedent` foo `).toBe(" foo ");

    expect(dedent`
         foo

             bar
           baz
         `).toBe("foo\n\n    bar\n  baz");

    expect(dedent`
    Foo
      - item1
      - item2

    Bar
        - bar2
        - bar3
            - zoo
    `).toBe(`Foo\n  - item1\n  - item2\n\nBar\n    - bar2\n    - bar3\n        - zoo`);
});
