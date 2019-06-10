import {BufferHandler, Logger, LogLevel} from "../../src";

test("Test buffer size", () => {
    const handler = new BufferHandler({level: LogLevel.DEBUG, bufferLimit: 2});

    const logger = new Logger({
        handlers: [handler],
    });

    expect(handler.length).toBe(0);

    logger.info("foo");
    expect(handler.length).toBe(1);

    logger.info("bar");
    expect(handler.length).toBe(2);

    logger.info("zoo");
    expect(handler.length).toBe(2);

    handler.clear();
    expect(handler.length).toBe(0);
});
