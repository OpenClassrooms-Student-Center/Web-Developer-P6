const http = require('http');

const server = http.createServer((req,res)=> {
      res.end('This is the server response');
})

server.listen(3000) ;