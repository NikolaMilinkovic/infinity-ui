import React, { ReactNode } from 'react';
import AuthContextProvider from './auth-context';
import { SocketProvider } from './socket-context';
import ColorsContextProvider from './colors-context';
import CategoriesContextProvider from './categories-context';
import DressesContextProvider from './dresses-context';

interface ContextChildrenType {
  children: ReactNode;
}

const ContextProvider: React.FC<ContextChildrenType> = ({ children }) => {
  return (
    <AuthContextProvider>
      <SocketProvider>
        <ColorsContextProvider>
          <CategoriesContextProvider>
            <DressesContextProvider>
              {children}
            </DressesContextProvider>
          </CategoriesContextProvider>
        </ColorsContextProvider>
      </SocketProvider>
    </AuthContextProvider>
  );
};

export default ContextProvider;