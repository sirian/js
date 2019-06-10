import {AllowDenyFilter, Filter} from "../../../src/Filter";

const data: Array<[Filter | Filter[], Filter | Filter[], boolean]> = [
    [[], [], true],
    [/foo/, [], true],
    [/bar/, [], false],
    [/foo/, /foo/, false],
    [[], /foo/, false],
];

test.each(data)("new AllowDenyFilter(%j, %j).test('foo') === %j", (allow, deny, expected) => {
    const filter = new AllowDenyFilter(allow, deny);
    expect(filter.test("foo")).toBe(expected);
});
