var http = require("http");
var fs = require("fs");
const { error } = require("console");

var server = http.createServer((request, response) => {
    if(request.url == '/')
    {
        fs.readFile('index.html', (error, html) => {
            response.writeHead(200, {"Content-Type": "text/html"});
        
            response.write(html);
            response.end();
        });
        
    }
    else if(request.url == '/urunler')
    {
        fs.readFile('urunler.html', (error, html) => {
            response.writeHead(200, {"Content-Type": "text/html"});
        
            response.write(html);
            response.end();
        });
    }else{
        fs.readFile('404.html', (error, html) => {
            response.writeHead(200, {"Content-Type": "text/html"});
        
            response.write(html);
            response.end();
        });
    }

    
});

server.listen(3000);
console.log("node.js server at port 3000");