const http = require('http');

const routes = require('./rotes');

const server = http.createServer(routes);

server.listen(3000);
