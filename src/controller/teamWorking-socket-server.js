import { verifyUrl } from "./util/teamWorking-middleware";
export const socketRoomController = (io) => {
    io.on('connection', (socket) => {
        io.use(verifyUrl);
        socket.join(socket.request.headers.referer.split("=")[1])
        socket.on('disconnect', () => {
            socket.leave(socket.request.headers.referer.split("=")[1])
        });
        io.to(socket.request.headers.referer.split("=")[1]).emit('message', 'Hello everyone!'+ socket.request.headers.referer.split("=")[1]);
    });
}
