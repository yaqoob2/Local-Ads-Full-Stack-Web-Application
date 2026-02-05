import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export const useSocket = (room) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        if (room) {
            newSocket.on('connect', () => {
                if (room === 'admin') {
                    newSocket.emit('joinAdmin');
                }
            });
        }

        return () => newSocket.close();
    }, [room]);

    return socket;
};
