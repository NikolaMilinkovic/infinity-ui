import React, { ReactNode } from 'react';
import AuthContextProvider from './auth-context';
import { SocketProvider } from './socket-context';
import ColorsContextProvider from './colors-context';
import CategoriesContextProvider from './categories-context';
import DressesContextProvider from './dresses-context';
import PursesContextProvider from './purses-context';
import AllProductsContextProvider from './all-products-context';
import NewOrderContextProvider from './new-order-context';
import CouriersContextProvider from './couriers-context';

interface ContextChildrenType {
  children: ReactNode;
}

const ContextProvider: React.FC<ContextChildrenType> = ({ children }) => {
  return (
    <AuthContextProvider>
      <SocketProvider>
        <ColorsContextProvider>
          <CategoriesContextProvider>
            <CouriersContextProvider>
              <DressesContextProvider>
                <PursesContextProvider>
                  <AllProductsContextProvider>
                    <NewOrderContextProvider>
                      {children}
                    </NewOrderContextProvider>
                  </AllProductsContextProvider>
                </PursesContextProvider>
              </DressesContextProvider>
            </CouriersContextProvider>
          </CategoriesContextProvider>
        </ColorsContextProvider>
      </SocketProvider>
    </AuthContextProvider>
  );
};

export default ContextProvider;