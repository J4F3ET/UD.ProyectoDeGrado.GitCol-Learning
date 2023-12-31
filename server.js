import express from "express";
import morgan from "morgan";
import path from "path";
import * as dotenv from "dotenv";
dotenv.config();
const server = express();

//Settings: Configuraciones del servidor (puerto, vistas, etc)
server.set("port", process.env.PORT || 3000);
server.set("views", path.join(__dirname, "src", "view"));
server.set("view engine", "ejs");

// Middlewares: Funciones que se ejecutan antes de que lleguen a las rutas
server.use(morgan("dev"));

// Routes: Rutas de la aplicacion
server.use(require("./src/controller/teaser-controller").default);
server.use(require("./src/controller/login-controller").default);
server.use(require("./src/controller/home-controller").default);
server.use(require("./src/controller/rooms-controller").default);
server.use(require("./src/controller/working-controller").default);
// Static files: Archivos que se envian al navegador(frontend)
server.use(express.static(path.join(__dirname, "src", "view")));
// Routes: Rutas de la aplicacion
server.listen(server.get("port"), () => {
	console.log(`Escuchando en el puerto ${server.get("port")}`);
});
