import {base64Decode} from "@sirian/base64";
import {ByteInput, makeArray, toBytes, toUTF} from "@sirian/common";
import {lzfCompress, lzfDecompress} from "../../src";

const check = (str: ByteInput, compressed?: ByteInput) => {
    if (compressed) {
        expect(lzfCompress(str)).toStrictEqual(toBytes(compressed));
    }

    const decompressed = lzfDecompress(lzfCompress(str));

    expect(toUTF(decompressed)).toStrictEqual(str);
};

describe("LZF", () => {
    const data: Array<[string, number[]]> = [
        ["", []],
        ["Hello world!", [11, 72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33]],
        ["123123123123", [3, 49, 50, 51, 49, 128, 2, 1, 50, 51]],
        ["111111111111", [1, 49, 49, 192, 0, 1, 49, 49]],
    ];

    test.each(data)("LZF.compress %o", check);

    test("compresses and decompresses all printable UTF-16 characters", () => {
        let str = "";

        for (let i = 32; i < 127; ++i) {
            str += String.fromCharCode(i);
        }
        for (let i = 128 + 32; i < 55_296; ++i) {
            str += String.fromCharCode(i);
        }
        for (let i = 63_744; i < 65_536; ++i) {
            str += String.fromCharCode(i);
        }
        check(str);
    });

    test("compresses and decompresses a string that repeats", () => {
        for (let i = 1; i < 6; i++) {
            check("x".repeat(10 ** i));
        }
    });

    test("compresses and decompresses a long string", () => {
        const str = makeArray(1000, Math.random).join("");
        check(str);
    });

    test("Check predefined long string", () => {
        const b64 = `F2E6Njp7czo4OiJiYXRjaF9pZCI7YToxNEAUEjExOiJTQ0hFTUFfTkFNRSI7TjsgFAcwOiJUQUJMRaATIBELNDoiZGF0YWZsb3dfYEUAIkAVIDwFQ09MVU1O4AAo4ARkIDcANeAAIQxQT1NJVElPTiI7aToxIBoKOToiREFUQV9UWVAgdgdzOjM6ImludEBWADcgGQVFRkFVTFSAjiBTA05VTExAkAQiO2I6MCAsCDY6IkxFTkdUSIAhIGUCU0NBQB5AviBZBVBSRUNJU2BtQBEgQQdVTlNJR05FREBBQH4gZAZQUklNQVJZwBEAMSBUoBLgCKwgQAZJREVOVElUoC4AfSAvISUGcHJvZmlsZeFUUuAHZyARIO+hd+EDVQAyIBog++EaVSBCAjoiMEFrINjhV1tBr+ENW6Ga4QNZADBBWSCUA3N0b3LhVVbgBGQgoeENUwAzIBrhB1NAOQNtYWxs4gquIEfhk1gi9AZhZGFwdGVy5FEB4ANjIQ7hDVYANCAa4QdWIDgFdmFyY2hhIJxgDeQTBEPCI6/EBGQ+AjEyOELSIHHkIQxCgiB4o/dECuIpriCHBXBhcmFtc+FRVOACYuEQUwA1IBrhB1MltgJ0ZXjlG1XhBlBBF+FoSETpCGNyZWF0ZWRfYSC05k+k4AdnIBEg6+UKUQA2IBrhB1IgDwh0aW1lc3RhbXBCbiI94iKo4WlXAX19`;
        const expected = `a:6:{s:8:"batch_id";a:14:{s:11:"SCHEMA_NAME";N;s:10:"TABLE_NAME";s:14:"dataflow_batch";s:11:"COLUMN_NAME";s:8:"batch_id";s:15:"COLUMN_POSITION";i:1;s:9:"DATA_TYPE";s:3:"int";s:7:"DEFAULT";N;s:8:"NULLABLE";b:0;s:6:"LENGTH";N;s:5:"SCALE";N;s:9:"PRECISION";N;s:8:"UNSIGNED";b:1;s:7:"PRIMARY";b:1;s:16:"PRIMARY_POSITION";i:1;s:8:"IDENTITY";b:1;}s:10:"profile_id";a:14:{s:11:"SCHEMA_NAME";N;s:10:"TABLE_NAME";s:14:"dataflow_batch";s:11:"COLUMN_NAME";s:10:"profile_id";s:15:"COLUMN_POSITION";i:2;s:9:"DATA_TYPE";s:3:"int";s:7:"DEFAULT";s:1:"0";s:8:"NULLABLE";b:0;s:6:"LENGTH";N;s:5:"SCALE";N;s:9:"PRECISION";N;s:8:"UNSIGNED";b:1;s:7:"PRIMARY";b:0;s:16:"PRIMARY_POSITION";N;s:8:"IDENTITY";b:0;}s:8:"store_id";a:14:{s:11:"SCHEMA_NAME";N;s:10:"TABLE_NAME";s:14:"dataflow_batch";s:11:"COLUMN_NAME";s:8:"store_id";s:15:"COLUMN_POSITION";i:3;s:9:"DATA_TYPE";s:8:"smallint";s:7:"DEFAULT";s:1:"0";s:8:"NULLABLE";b:0;s:6:"LENGTH";N;s:5:"SCALE";N;s:9:"PRECISION";N;s:8:"UNSIGNED";b:1;s:7:"PRIMARY";b:0;s:16:"PRIMARY_POSITION";N;s:8:"IDENTITY";b:0;}s:7:"adapter";a:14:{s:11:"SCHEMA_NAME";N;s:10:"TABLE_NAME";s:14:"dataflow_batch";s:11:"COLUMN_NAME";s:7:"adapter";s:15:"COLUMN_POSITION";i:4;s:9:"DATA_TYPE";s:7:"varchar";s:7:"DEFAULT";N;s:8:"NULLABLE";b:1;s:6:"LENGTH";s:3:"128";s:5:"SCALE";N;s:9:"PRECISION";N;s:8:"UNSIGNED";N;s:7:"PRIMARY";b:0;s:16:"PRIMARY_POSITION";N;s:8:"IDENTITY";b:0;}s:6:"params";a:14:{s:11:"SCHEMA_NAME";N;s:10:"TABLE_NAME";s:14:"dataflow_batch";s:11:"COLUMN_NAME";s:6:"params";s:15:"COLUMN_POSITION";i:5;s:9:"DATA_TYPE";s:4:"text";s:7:"DEFAULT";N;s:8:"NULLABLE";b:1;s:6:"LENGTH";N;s:5:"SCALE";N;s:9:"PRECISION";N;s:8:"UNSIGNED";N;s:7:"PRIMARY";b:0;s:16:"PRIMARY_POSITION";N;s:8:"IDENTITY";b:0;}s:10:"created_at";a:14:{s:11:"SCHEMA_NAME";N;s:10:"TABLE_NAME";s:14:"dataflow_batch";s:11:"COLUMN_NAME";s:10:"created_at";s:15:"COLUMN_POSITION";i:6;s:9:"DATA_TYPE";s:9:"timestamp";s:7:"DEFAULT";N;s:8:"NULLABLE";b:1;s:6:"LENGTH";N;s:5:"SCALE";N;s:9:"PRECISION";N;s:8:"UNSIGNED";N;s:7:"PRIMARY";b:0;s:16:"PRIMARY_POSITION";N;s:8:"IDENTITY";b:0;}}`;
        const compressed = base64Decode(b64);
        check(expected, compressed);
    });
});
