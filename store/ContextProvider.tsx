import React, { ReactNode } from 'react';
import AllProductsContextProvider from './all-products-context';
import AppContextProvider from './app-context';
import AuthContextProvider from './auth-context';
import CategoriesContextProvider from './categories-context';
import ColorsContextProvider from './colors-context';
import CouriersContextProvider from './couriers-context';
import DressesContextProvider from './dresses-context';
import LastUpdatedContextProvider from './last-updated-context';
import LogContextProvider from './log-context';
import { ModalsContextProvider } from './modals/modals-context-provider';
import NewOrderContextProvider from './new-order-context';
import OrdersContextProvider from './orders-context';
import PursesContextProvider from './purses-context';
import { SocketProvider } from './socket-context';
import SuppliersContextProvider from './suppliers-context';
import UserContextProvider from './user-context';

interface ContextChildrenType {
  children: ReactNode;
}

const ContextProvider: React.FC<ContextChildrenType> = ({ children }) => {
  return (
    <ModalsContextProvider>
      <AuthContextProvider>
        <LogContextProvider>
          <SocketProvider>
            <AppContextProvider>
              <UserContextProvider>
                <ColorsContextProvider>
                  <CategoriesContextProvider>
                    <CouriersContextProvider>
                      <SuppliersContextProvider>
                        <DressesContextProvider>
                          <PursesContextProvider>
                            <AllProductsContextProvider>
                              <NewOrderContextProvider>
                                <OrdersContextProvider>
                                  {/* Last Updated needs to be wrapped by all context that store data */}
                                  <LastUpdatedContextProvider>{children}</LastUpdatedContextProvider>
                                </OrdersContextProvider>
                              </NewOrderContextProvider>
                            </AllProductsContextProvider>
                          </PursesContextProvider>
                        </DressesContextProvider>
                      </SuppliersContextProvider>
                    </CouriersContextProvider>
                  </CategoriesContextProvider>
                </ColorsContextProvider>
              </UserContextProvider>
            </AppContextProvider>
          </SocketProvider>
        </LogContextProvider>
      </AuthContextProvider>
    </ModalsContextProvider>
  );
};

export default ContextProvider;
