//import http necessaire au serveur
const http = require("http");

//import variable d'environnement
require('dotenv').config()

//import de l'application
const app = require("./app");

//parametrage du port
app.set("port", process.env.PORT);

//creation du server/ ecoute sur le port
const server = http.createServer(app);
server.listen(process.env.PORT);