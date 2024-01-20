import { verifyUrl } from "./util/teamWorking-middleware";
export const socketRoomController = (io) => {
    io.on('connection', (socket) => {
        io.use(verifyUrl);
        socket.on('chat', (msg) => {
            console.log('message: ' + msg);
        });
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        
    });
}
