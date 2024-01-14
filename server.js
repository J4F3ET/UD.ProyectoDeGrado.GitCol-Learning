import express from "express";
import morgan from "morgan";
import path from "path";
import { createServer } from 'node:http';
import * as dotenv from "dotenv";
dotenv.config();
const app = express();
export const server = createServer(app);
//Settings: Configuraciones del servidor (puerto, vistas, etc)
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "src", "view"));
app.set("view engine", "ejs");

// Middlewares: Funciones que se ejecutan antes de que lleguen a las rutas
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes: Rutas de la aplicacion
app.use(require("./src/controller/teaser-controller").default);
app.use(require("./src/controller/login-controller").default);
app.use(require("./src/controller/home-controller").default);
app.use(require("./src/controller/rooms-controller").default);
app.use(require("./src/controller/working-controller").default);
app.use(require("./src/controller/challenges-controller").default);
app.use(require("./src/controller/teamWorking-controller").default);
// Static files: Archivos que se envian al navegador(frontend)
app.use(express.static(path.join(__dirname, "src", "view")));
// Routes: Rutas de la aplicacion
server.listen(app.get("port"), () => {
	console.log(`Escuchando en el puerto ${app.get("port")}`);
});
