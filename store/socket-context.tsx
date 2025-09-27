import Constants from 'expo-constants';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { AuthContext } from './auth-context';
const backendURI = Constants.expoConfig?.extra?.backendURI;

interface ISocketContext {
  socket: Socket | null;
}
export const SocketContext = createContext<ISocketContext | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  // const lastUpdatedCtx = useContext(LastUpdatedContext);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (authCtx.isAuthenticated) {
      const newSocket = io(process.env.EXPO_PUBLIC_BACKEND_URI || backendURI, {
        transports: ['websocket'],
        reconnectionAttempts: 5,
        auth: {
          token: `Bearer ${authCtx.token}`,
        },
      });

      newSocket.on('reconnect', (attempt) => {
        console.log(`> Socket reconnected after ${attempt} attempts`);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('> Socket disconnected:', reason);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      setSocket(newSocket);

      return () => {
        if (newSocket) {
          newSocket.disconnect();
          console.log('> Socket disconnected in cleanup');
        }
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        console.log('> Socket disconnected due to authentication state');
      }
    }
  }, [authCtx.isAuthenticated]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
