const http = require("http");

const start = Date.now();

function request() {
    const id = Math.floor(Math.random() * 100) + 1;
    http.request(`http://localhost:3000/users/${id}`, (res) => {
        res.on("data", () => {});
        res.on("end", () => {
            console.log(`id: ${id}, time: ${Date.now() - start}`);
        });
    }).end();
}

request();
request();
request();
request();
request();
request();
request();
request();
request();
request();
request();
request();
