const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Join admin room if relevant
        socket.on('joinAdmin', () => {
            socket.join('admin');
            console.log(`Socket ${socket.id} joined admin room`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

const emitToAdmin = (event, data) => {
    if (io) {
        io.to('admin').emit(event, data);
    }
};

module.exports = { initSocket, getIO, emitToAdmin };
