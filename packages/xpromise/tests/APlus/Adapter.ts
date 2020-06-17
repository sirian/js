import {IDeferred} from "../../src";

export class Adapter {
    protected static factory: <T>() => IDeferred<T>;

    public static resolved<T>(value?) {
        const d = this.deferred<T>();
        d.resolve(value);
        return d.promise;
    }

    public static deferred<T>() {
        const deferred = this.factory<T>();
        Promise.resolve(deferred.promise).catch((preventUnhandledWarnings) => {});
        return deferred;
    }

    public static rejected<T>(reason?: any) {
        const d = this.deferred<T>();
        d.reject(reason);
        return d.promise;
    }

    public static run(factory: () => IDeferred<any>) {
        Adapter.factory = factory;
        require("./2.1.2");
        require("./2.1.3");
        require("./2.2.1");
        require("./2.2.2");
        require("./2.2.3");
        require("./2.2.4");
        require("./2.2.5");
        require("./2.2.6");
        require("./2.2.7");
        require("./2.3.1");
        require("./2.3.2");
        require("./2.3.3");
        require("./2.3.4");
    }
}
