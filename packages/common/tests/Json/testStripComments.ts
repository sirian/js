import {Json} from "../../src";

describe("Json.stripComments", () => {
    const data: Array<{ source: string, expected: string }> = [
        {
            source: "\
			// this is a JSON file with comments\n\
			{\n\
				\"foo\": \"bar\",	// this is cool\n\
				\"bar\": [\n\
					\"baz\", \"bum\", \"zam\"\n\
				],\n\
			/* the rest of this document is just fluff\n\
			   in case you are interested. */\n\
				\"something\": 10,\n\
				\"else\": 20\n\
			}\n\
			\n\
			/* NOTE: You can easily strip the whitespace and comments\n\
			   from such a file with the JSON.minify() project hosted\n\
			   here on github at http://github.com/getify/JSON.minify\n\
			*/\n",
            expected: "{\"foo\":\"bar\",\"bar\":[\"baz\",\"bum\",\"zam\"],\"something\":10,\"else\":20}",
        },
        {
            source: "\
			\n\
			{\"/*\":\"*/\",\"//\":\"\",/*\"//\"*/\"/*/\"://\n\
			\"//\"}\n\
			\n",
            expected: "{\"/*\":\"*/\",\"//\":\"\",\"/*/\":\"//\"}",
        },
        {
            source: "\
			/*\n\
			this is a\n\
			multi line comment */{\n\
			\n\
			\"foo\"\n\
			:\n\
				\"bar/*\"// something\n\
				,	\"b\\\"az\":/*\n\
			something else */\"blah\"\n\
			\n\
			}\n",
            expected: "{\"foo\":\"bar/*\",\"b\\\"az\":\"blah\"}",
        },
        {
            source: "\
			{\"foo\": \"ba\\\"r//\", \"bar\\\\\": \"b\\\\\\\"a/*z\",\n\
				\"baz\\\\\\\\\": /* yay */ \"fo\\\\\\\\\\\"*/o\"\n\
			}\n",
            expected: "{\"foo\":\"ba\\\"r//\",\"bar\\\\\":\"b\\\\\\\"a/*z\",\"baz\\\\\\\\\":\"fo\\\\\\\\\\\"*/o\"}",
        },
    ];

    test.each(data.map((x) => [x.source, x.expected]))("Json.stripComments(%o) === %o", (value, expected) => {
        expect(Json.stripComments(value)).toBe(expected);
    });
});
