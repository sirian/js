import {stringifyVar} from "@sirian/common";

interface GlobOptions {
    // Whether we are matching so called "extended" globs (like bash) and should
    // support single character matching, matching ranges of characters, group
    // matching, etc.
    extended: boolean;

    // When globstar is _false_ (default), '/foo/*' is translated a regexp like
    // '^\/foo\/.*$' which will match any string beginning with '/foo/'
    // When globstar is _true_, '/foo/*' is translated to regexp like
    // '^\/foo\/[^/]*$' which will match any string beginning with '/foo/' BUT
    // which does not have a '/' to the right of it.
    // E.g. with '/foo/*' these will match: '/foo/bar', '/foo/bar.txt' but
    // these will not '/foo/bar/baz', '/foo/bar/baz.txt'
    // Lastely, when globstar is _true_, '/foo/**' is equivelant to '/foo/*' when
    // globstar is _false_
    globstar: boolean;

    // RegExp flags (eg "i" ) to pass in to RegExp constructor.
    flags: string;
}

export class Glob {
    public static toRegex(glob: string, options: Partial<GlobOptions> = {}) {
        const str = stringifyVar(glob);

        const opts = {
            extended: false,
            globstar: false,
            flags: "",
            ...options,
        };

        // The regexp we are building, as a string.
        let reStr = "";

        const {extended, globstar, flags} = opts;

        // If we are doing extended matching, this boolean is true when we are inside
        // a group (eg {*.html,*.js}), and false otherwise.
        let inGroup = false;

        const len = str.length;
        for (let i = 0; i < len; i++) {
            const c = str[i];

            // noinspection FallThroughInSwitchStatementJS
            if (-1 !== "/$^+.()=!|".indexOf(c)) {
                reStr += "\\" + c;
                continue;
            }
            if (extended) {
                if (c === "?") {
                    reStr += ".";
                    continue;
                }
                if ("[" === c || "]" === c) {
                    reStr += c;
                }

                if ("{" === c) {
                    inGroup = true;
                    reStr += "(";
                    continue;
                }

                if ("}" === c) {
                    inGroup = false;
                    reStr += ")";
                    continue;
                }
            }

            if ("," === c) {
                reStr += inGroup ? "|" : "\\" + c;
                continue;
            }

            if ("*" === c) {
                // Move over all consecutive "*"'s.
                // Also store the previous and next characters
                const prevChar = str[i - 1];
                let starCount = 1;
                while (str[i + 1] === "*") {
                    starCount++;
                    i++;
                }
                const nextChar = str[i + 1];

                if (!globstar) {
                    // globstar is disabled, so treat any number of "*" as one
                    reStr += ".*";
                } else {
                    // globstar is enabled, so determine if this is a globstar segment
                    const isGlobstar = starCount > 1                      // multiple "*"'s
                        && (prevChar === "/" || prevChar === undefined)   // from the start of the segment
                        && (nextChar === "/" || nextChar === undefined);   // to the end of the segment

                    if (isGlobstar) {
                        // it's a globstar, so match zero or more path segments
                        reStr += "((?:[^/]*(?:/|$))*)";
                        i++; // move over the "/"
                    } else {
                        // it's not a globstar, so only match one path segment
                        reStr += "([^/]*)";
                    }
                }
                continue;
            }

            reStr += c;
        }

        // When regexp 'g' flag is specified don't
        // constrain the regular expression with ^ & $
        if (-1 === flags.indexOf("g")) {
            reStr = "^" + reStr + "$";
        }

        return new RegExp(reStr, flags);
    }
}
