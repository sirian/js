const buf = require('buffer');
const Buffer = buf.Buffer;
delete buf.Buffer;

const engines = {
    Base64: require('../build/cjs').Base64,
    "js-base64": require('js-base64').Base64,
};

// tslint:disable:no-console max-line-length

const str = "Sed ut perspiciatis, unde omnis iste natus ";

const str64 = Buffer.from(str).toString('base64');

function test(N, Base64) {
    if ("function" === typeof gc) {
        gc();
    }
    const start = Date.now();
    for (let i = 0; i < N; i++) {
        console.assert(str64 === Base64.encode(str));
        console.assert(str === Base64.decode(str64));
    }
    return Date.now() - start;
}

const data = {};
for (let i = 3; i < 7; i++) {
    const N = 10 ** i;
    const times = {};
    for (const [name, engine] of Object.entries(engines)) {
        console.log(N, name);
        const time = test(N, engine);
        times[name] = time;
    }
    data[N] = times;
}
buf.Buffer = Buffer;
console.table(data);
