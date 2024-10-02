import React, { ReactNode } from 'react';
import AuthContextProvider from './auth-context';
import { SocketProvider } from './socket-context';
import ColorsContextProvider from './colors-context';

interface ContextChildrenType {
  children: ReactNode;
}

const ContextProvider: React.FC<ContextChildrenType> = ({ children }) => {
  return (
    <AuthContextProvider>
      <SocketProvider>
        <ColorsContextProvider>
          {children}
        </ColorsContextProvider>
      </SocketProvider>
    </AuthContextProvider>
  );
};

export default ContextProvider;