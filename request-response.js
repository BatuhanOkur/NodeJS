var http = require("http");

var server = http.createServer((request, response) => {
    response.setHeader("Content-Type", "text/html");
    response.statusCode = 200;
    response.statusMessage = "OK";

    response.write("anasayfa");
    response.end();
});

server.listen(3000);
console.log("node.js server at port 3000");