import React, { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { AuthContext } from './auth-context';

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
    let newSocket: Socket | null = null;

    if(authCtx.isAuthenticated){
      newSocket = io(process.env.EXPO_PUBLIC_BACKEND_URI);
      newSocket.on('connect', () => {
        console.log('> Socket connected');
      })
    }
    setSocket(newSocket);

    return () => {
      if(newSocket){
        newSocket.disconnect();
        console.log('> Socket disconnected in cleanup')
      }
    }
  }, [authCtx.isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}