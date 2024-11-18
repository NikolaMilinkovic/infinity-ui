import React, { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { AuthContext } from './auth-context';
import Constants from 'expo-constants';
const backendURI = Constants.expoConfig?.extra?.backendURI;

interface ISocketContext {
  socket: Socket | null
}
export const SocketContext = createContext<ISocketContext | null>(null);


interface SocketProviderProps {
  children: ReactNode
}
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (authCtx.isAuthenticated) {
      const newSocket = io(process.env.EXPO_PUBLIC_BACKEND_URI || backendURI, {
        transports: ['websocket'],
        reconnectionAttempts: 5,
      });

      newSocket.on('connect', () => {
        console.log('> Socket connected');
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

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}