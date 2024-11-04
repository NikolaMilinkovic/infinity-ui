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
import OrdersContextProvider from './orders-context';
import AppContextProvider from './app-context';
import UserContextProvider from './user-context';

interface ContextChildrenType {
  children: ReactNode;
}

const ContextProvider: React.FC<ContextChildrenType> = ({ children }) => {
  return (
    <AuthContextProvider>
      <SocketProvider>
        <AppContextProvider>
          <UserContextProvider>
            <ColorsContextProvider>
              <CategoriesContextProvider>
                <CouriersContextProvider>
                  <DressesContextProvider>
                    <PursesContextProvider>
                      <AllProductsContextProvider>
                        <NewOrderContextProvider>
                          <OrdersContextProvider>
                            {children}
                          </OrdersContextProvider>
                        </NewOrderContextProvider>
                      </AllProductsContextProvider>
                    </PursesContextProvider>
                  </DressesContextProvider>
                </CouriersContextProvider>
              </CategoriesContextProvider>
            </ColorsContextProvider>
          </UserContextProvider>
        </AppContextProvider>
      </SocketProvider>
    </AuthContextProvider>
  );
};

export default ContextProvider;