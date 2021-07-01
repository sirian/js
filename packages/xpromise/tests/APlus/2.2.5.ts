/* eslint-disable @typescript-eslint/no-floating-promises */
import {Adapter} from "./Adapter";
import {specify} from "./helper";

const dummy = {dummy: "dummy"}; // we fulfill or reject with this when we don't intend to test against it

describe("2.2.5 `onFulfilled` and `onRejected` must be called as functions (i.e. with no `this` value).", function() {
    describe("strict mode", function() {
        specify("fulfilled", function(done) {
            Adapter.resolved(dummy).then(function onFulfilled(this: any) {
                "use strict";

                expect(this).toBe(undefined);
                done();
            });
        });

        specify("rejected", function(done) {
            Adapter.rejected(dummy).then(null, function onRejected(this: any) {
                "use strict";

                expect(this).toBe(undefined);
                done();
            });
        });
    });

    describe.skip("sloppy mode", function() {
        specify("fulfilled", function(done) {
            Adapter.resolved(dummy).then(function onFulfilled(this: any) {
                expect(this).toBe(global);
                done();
            });
        });

        specify("rejected", function(done) {
            Adapter.rejected(dummy).then(null, function onRejected(this: any) {
                expect(this).toBe(global);
                done();
            });
        });
    });
});
