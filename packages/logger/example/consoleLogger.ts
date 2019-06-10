import {ConsoleHandler, Logger, LogLevel} from "../src";

const logger = new Logger({
    handlers: [
        new ConsoleHandler({
            level: LogLevel.DEBUG,
        }),
    ],
});

logger.debug("Debug message. int(%.3f) = %d. Some code here: `const a = {};`", Math.PI, Math.PI);
logger.info("Info message. int(%.3f) = `%d`", Math.PI, Math.PI);
logger.info("User \\*Nobody\\* registered via *Facebook*");
logger.info("User *%s* registered via _%s_", "Nobody", "Google");
logger.warning("Expected *string*, but given *{value|t}* {value}", {value: {foo: "bar"}});
logger.warning("Expected _string_, but given %(value)t {value|O}", {value: {foo: "bar"}});
logger.error("Error1. {name} happened {message}", new TypeError("Something went wrong"));
logger.error("Error2. %O", new TypeError("Something went wrong"));
logger.error("Error3. ", new TypeError("Something went wrong"));
