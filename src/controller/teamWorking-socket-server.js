import { verifyUrl } from "./util/teamWorking-middleware";
export const socketRoomController = (io) => {
    try {
        io.on('connection', (socket) => {
            socket.use(verifyUrl(socket,io.next));
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
            socket.on('chat', (msg) => {
                console.log('message: ' + msg);
            });
        });
    } catch (error) {
        console.log(error);
    }
}
