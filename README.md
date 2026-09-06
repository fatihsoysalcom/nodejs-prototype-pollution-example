# Nodejs Prototype Pollution Example

This example demonstrates the Prototype Pollution vulnerability in Node.js applications. It shows how a malicious input, when processed by a vulnerable property setting or object merging function, can modify the `Object.prototype`. This leads to all subsequent plain objects inheriting the injected properties, posing a significant security risk. The example also illustrates a simple mitigation strategy to prevent such attacks.

## Language

`javascript`

## How to Run

Save the code as `app.js`. Open your terminal, navigate to the directory where you saved the file, and run `node app.js`.

## Original Article

This example accompanies the Turkish article: [Node.js API'lerinde Prototip Kirliliği: Bir Kütüphane Hatası Değil, Süreç Geneli Bir Güven Kırılmasıdır](https://fatihsoysal.com/blog/node-js-apilerinde-prototip-kirliligi-bir-kutuphane-hatasi-degil-surec-geneli-bir-guven-kirilmasidir/).

## License

MIT — see [LICENSE](LICENSE).
