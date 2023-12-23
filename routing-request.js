var http = require("http");

var server = http.createServer((request, response) => {
    if(request.url == '/')
    {
        response.writeHead(200, {"Content-Type": "text/html"});
        
        response.write(`
            <html>
                <head>
                    <title>anasayfa</title>
                </head>
                <body>
                    <h1>Anasayfa</h1>
                </body>
            </html>
        `);
    }
    else if(request.url == '/urunler')
    {
        response.writeHead(200, {"Content-Type": "text/html"});
        
        response.write(`
            <html>
                <head>
                    <title>anasayfa</title>
                </head>
                <body>
                    <h1>Anasayfa</h1>
                    <h3>Urunler</h3>
                </body>
            </html>
        `);
    }else{
        response.writeHead(404, {"Content-Type": "text/html"});
        response.write(`
            <html>
                <head>
                    <title>Aradiginiz kaynak bulunamadi</title>
                </head>
                <body>
                    <h1>Aradiginiz kaynak bulunamadi</h1>
                    
                </body>
            </html>
        `);
    }

    response.end();
});

server.listen(3000);
console.log("node.js server at port 3000");