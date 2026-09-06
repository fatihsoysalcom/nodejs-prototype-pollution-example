# nodejs-prototype-pollution-example
This example demonstrates the Prototype Pollution vulnerability in Node.js applications. It shows how a malicious input, when processed by a vulnerable property setting or object merging function, can modify the `Object.prototype`. This leads to all subsequent plain objects inheriting the injected properties, posing a significant security risk. The
