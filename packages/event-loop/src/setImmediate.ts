import {TaskCallback} from "./TaskQueue";

let immediateMessageChannel: MessageChannel | undefined;
let immediateTasks: Map<number, TaskCallback>;
let immediateTimeouts: Map<number, any>;
let immediateTaskId = 0;

const handleImmediate = (id: number) => {
    const task = immediateTasks?.get(id);
    clearImmediate(id);
    task?.();
};

const getImmediateMessageChannel = () => {
    if (!immediateMessageChannel) {
        immediateMessageChannel = new MessageChannel();
        immediateMessageChannel.port1.onmessage = (e) => handleImmediate(e.data);
    }
    return immediateMessageChannel;
};

export const setImmediate = (fn: TaskCallback) => {
    const taskId = ++immediateTaskId;

    immediateTasks ??= new Map();
    immediateTimeouts ??= new Map();
    immediateTasks.set(taskId, fn);
    getImmediateMessageChannel().port2.postMessage(taskId);
    immediateTimeouts.set(taskId, setTimeout(handleImmediate, 0, taskId));
};

export const clearImmediate = (id: number) => {
    clearTimeout(immediateTimeouts?.get(id));
    immediateTimeouts?.delete(id);
    immediateTasks?.delete(id);
};
