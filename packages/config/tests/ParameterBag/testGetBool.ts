import {ParameterBag} from "../../src";

describe("ParameterBag.get", () => {
    const trueData = [
        true,
        1,
        "1",
        "y",
        "Y",
        "yes",
        "YES",
        "true",
        "TRUE",
        "on",
        "ON",
    ].map((v) => [v, true]);

    const falseData = [
        false,
        null,
        undefined,
        0,
        "",
        "0",
        -1,
        [],
        2,
    ].map((v) => [v, false]);

    test.each([...trueData, ...falseData])("ParameterBag.getBool(%p) is %p", (v, expected) => {
        const p = new ParameterBag({v});
        expect(p.getBool("v")).toBe(expected);
    });
});
