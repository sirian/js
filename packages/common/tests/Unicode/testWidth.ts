import {Unicode} from "../../src";

describe("", () => {
    const data: Array<[string, number]> = [
        ["", 0],
        ["foo", 3],
        ["q\u0307\u0323", 1],
        ["Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘!͖̬̰̙̗̿̋ͥͥ̂ͣ̐́́͜͞", 6],
        ["💩", 1],
        ["𝌆", 1],
        ["😹🐶😹🐶", 4],
        ["\uD83C\uDF1F\u5FCD\u8005\u306E\u653B\u6483\uD83C\uDF1F", 7],
    ];

    test.each(data)("Unicode.from(%o).width === %o", (str, expected) => {
        expect(Unicode.from(str).graphemes.length).toBe(expected);
    });
});
