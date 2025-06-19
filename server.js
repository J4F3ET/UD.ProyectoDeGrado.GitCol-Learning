import express from "express";
import morgan from "morgan";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "node:http";
import { dirname } from "node:path";
import { SocketHandler } from "./src/controller/teamWorking-socket-server.js";
import { swaggerDoc } from "./docs/swagger.js";

const app = express();
const server = createServer(app);
const io = new Server(server);
const __dirname = dirname(fileURLToPath(import.meta.url));
//Settings: Configuraciones del servidor (puerto, vistas, etc)
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "src", "view"));
app.set("view engine", "ejs");

// Middlewares: Funciones que se ejecutan antes de que lleguen a las rutas
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Socket.io: Configuraciones de socket.io
const ws = new SocketHandler(io);
// Routes: Rutas de la aplicacion
async function uploadCtrl(app) {
	app.use((await import("./src/controller/login-controller.js")).default);
	app.use((await import("./src/controller/home-controller.js")).default);
	app.use((await import("./src/controller/rooms-controller.js")).default);
	app.use((await import("./src/controller/teamWorking-controller.js")).default);
	app.use(
		(await import("./src/controller/aloneWorking-controller.js")).default
	);
}
uploadCtrl(app);
// Static files: Archivos que se envian al navegador(frontend)
app.use(express.static(path.join(__dirname, "src", "view")));
server.listen(app.get("port"), () => {
	console.log("✅ " + app.get("port"));
	swaggerDoc(app, app.get("port"));
});
