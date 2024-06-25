import express from "express";
import morgan from "morgan";
import { Server } from 'socket.io';
import path from "path";
import { createServer } from 'node:http';
import { SocketHandler } from "./src/controller/teamWorking-socket-server.js";
import { swaggerDoc } from "./docs/swagger.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

//Settings: Configuraciones del servidor (puerto, vistas, etc)
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "src", "view"));
app.set("view engine", "ejs");

// Middlewares: Funciones que se ejecutan antes de que lleguen a las rutas
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Socket.io: Configuraciones de socket.io
new SocketHandler(io);
// Routes: Rutas de la aplicacion
app.use(require("./src/controller/login-controller").default);
app.use(require("./src/controller/home-controller").default);
app.use(require("./src/controller/rooms-controller").default);
app.use(require("./src/controller/challenges-controller").default);
app.use(require("./src/controller/teamWorking-controller").default);
app.use(require("./src/controller/aloneWorking-controller").default);

// Static files: Archivos que se envian al navegador(frontend)
app.use(express.static(path.join(__dirname, "src", "view")));

server.listen(app.get("port"), () => {
	console.log(` ${app.get("port")}`);
	swaggerDoc(app, app.get("port"));
});
