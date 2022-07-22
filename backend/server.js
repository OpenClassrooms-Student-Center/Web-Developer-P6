// Modules
const http = require("http");
const app = require("./app");
// Fin modules

//NormalizerPort (renvoi un port valide)
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
// Fin

//Definition du port
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);
//Fin

//Fonction ErrorHandler
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};
//Fin

//Creation Serveur
const server = http.createServer(app);

server.on("error", errorHandler); // Gère les erreurs
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind); // Indique le port dans la console
});

server.listen(port);
//Fin
