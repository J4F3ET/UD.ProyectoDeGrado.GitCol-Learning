import { verifyUrl } from "./util/teamWorking-middleware";
export const socketRoomController = (io) => {
    io.use(verifyUrl);
    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        socket.on('chat message', (msg) => {
            console.log('message: ' + msg);
        });
    });
}
