import React, { ReactNode } from 'react';
import AllProductsContextProvider from './all-products-context';
import AppContextProvider from './app-context';
import AuthContextProvider from './auth-context';
import CategoriesContextProvider from './categories-context';
import ColorsContextProvider from './colors-context';
import CouriersContextProvider from './couriers-context';
import { EndOfDayExcelProvider } from './excel/end-of-day-excel-presets-context';
import { NewExcelProvider } from './excel/new-excel-context';
import LastUpdatedContextProvider from './last-updated-context';
import { ModalsContextProvider } from './modals/modals-context-provider';
import NewOrderContextProvider from './new-order-context';
import OrdersContextProvider from './orders-context';
import { SocketProvider } from './socket-context';
import SuppliersContextProvider from './suppliers-context';
import { ThemeProvider } from './theme-context';
import { TransitionsProvider } from './transitions-context';
import UserContextProvider from './user-context';

interface ContextChildrenType {
  children: ReactNode;
}

const ContextProvider: React.FC<ContextChildrenType> = ({ children }) => {
  return (
    <AuthContextProvider>
      <SocketProvider>
        <AppContextProvider>
          <ThemeProvider>
            <TransitionsProvider>
              <UserContextProvider>
                <EndOfDayExcelProvider>
                  <NewExcelProvider>
                    <ModalsContextProvider>
                      <ColorsContextProvider>
                        <CategoriesContextProvider>
                          <CouriersContextProvider>
                            <SuppliersContextProvider>
                              <AllProductsContextProvider>
                                <NewOrderContextProvider>
                                  <OrdersContextProvider>
                                    {/* Last Updated needs to be wrapped by all context that store data */}
                                    <LastUpdatedContextProvider>{children}</LastUpdatedContextProvider>
                                  </OrdersContextProvider>
                                </NewOrderContextProvider>
                              </AllProductsContextProvider>
                            </SuppliersContextProvider>
                          </CouriersContextProvider>
                        </CategoriesContextProvider>
                      </ColorsContextProvider>
                    </ModalsContextProvider>
                  </NewExcelProvider>
                </EndOfDayExcelProvider>
              </UserContextProvider>
            </TransitionsProvider>
          </ThemeProvider>
        </AppContextProvider>
      </SocketProvider>
    </AuthContextProvider>
  );
};

export default ContextProvider;
