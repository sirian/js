import {TaskCallback} from "./TaskQueue";

const setImmediateMessageChannel = (fn: TaskCallback) => {
    const c = new MessageChannel();
    c.port1.onmessage = fn;
    c.port2.postMessage("");
    c.port2.close();
};

export const setImmediate = (fn: TaskCallback) => {
    let handled = 0;

    const handle = () => {
        if (!handled++) {
            clearTimeout(timeout);
            fn();
        }
    };

    const timeout = setTimeout(handle);
    setImmediateMessageChannel(handle);
};
