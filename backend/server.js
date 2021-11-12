require('dotenv').config()
const http = require('http'); // https requires an SSL certificate to be obtained with a domain name
const app = require('./app');

//The normalizePort function returns a valid port, whether supplied as a number or a string
// this configures the connection port for the environment
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || '3000'); // Add the connection port if it is not declared by the environment - If no port is provided we will listen on port 3000
app.set('port', port);

// the errorHandler function looks for various errors and handles them appropriately
// and then logs to the server
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
// create a server with express that uses app & create a constant for server calls (requests and responses)
const server = http.createServer(app); // https requires an SSL certificate

// manage server events for a console return
server.on('error', errorHandler); // Start the server and show which port to connect to or handle errors if any
server.on('listening', () => { // An event listener that logs the named port the server is running on in the console
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port); // The server listens to the port defined above
