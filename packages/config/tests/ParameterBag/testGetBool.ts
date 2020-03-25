import {TestUtil} from "../../../common/tests/TestUtil";
import {ParameterBag} from "../../src";

describe("ParameterBag.get", () => {
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
    ];

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
    ];

    test.each(TestUtil.mergeData(trueData, falseData))("ParameterBag.getBool(%p) is %p", (v, expected) => {
        const p = new ParameterBag({v});
        expect(p.getBool("v")).toBe(expected);
    });
});
