import {strGraphemes} from "../../src";

describe("", () => {
    const data: Array<[string, string[]]> = [
        ["", []],
        ["foo", ["f", "o", "o"]],
        ["q\u0307\u0323", ["q̣̇"]],
        ["Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘!͖̬̰̙̗̿̋ͥͥ̂ͣ̐́́͜͞", ["Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍", "A̴̵̜̰͔ͫ͗͢", "L̠ͨͧͩ͘", "G̴̻͈͍͔̹̑͗̎̅͛́", "Ǫ̵̹̻̝̳͂̌̌͘", "!͖̬̰̙̗̿̋ͥͥ̂ͣ̐́́͜͞"]],
        ["💩", ["💩"]],
        ["𝌆", ["𝌆"]],
        ["😹🐶😹🐶", ["😹", "🐶", "😹", "🐶"]],
        ["\uD83C\uDF1F\u5FCD\u8005\u306E\u653B\u6483\uD83C\uDF1F", ["🌟", "忍", "者", "の", "攻", "撃", "🌟"]],
    ];

    test.each(data)("getGraphemes(%p) === %p", (str, expected) => {
        expect(strGraphemes(str)).toStrictEqual(expected);
    });
});
