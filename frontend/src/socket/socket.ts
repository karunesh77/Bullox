import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io('/', {
      transports: ['websocket', 'polling'],
      auth: { token: localStorage.getItem('accessToken') ?? '' },
      autoConnect: false,
    });
  }
  return socket;
};

export const connectSocket = () => getSocket().connect();
export const disconnectSocket = () => socket?.disconnect();
