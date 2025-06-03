import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useAppContexts } from '../hooks/useAppContexts';
import { CategoryTypes, ColorTypes, CourierTypes, SupplierTypes } from '../types/allTsTypes';
import { popupMessage } from '../util-components/PopupMessage';
import { fetchData } from '../util-methods/FetchMethods';
import { betterErrorLog } from '../util-methods/LogMethods';
import { AuthContext } from './auth-context';
import { SocketContext } from './socket-context';

interface LastUpdatedDataType {
  appSchemaLastUpdatedAt: Date;
  userLastUpdatedAt: Date;
  categoryLastUpdatedAt: Date;
  colorLastUpdatedAt: Date;
  dressLastUpdatedAt: Date;
  dressColorLastUpdatedAt: Date;
  purseLastUpdatedAt: Date;
  purseColorLastUpdatedAt: Date;
  supplierLastUpdatedAt: Date;
  productDisplayCounterLastUpdatedAt: Date;
  processedOrdersForPeriodLastUpdatedAt: Date;
  orderLastUpdatedAt: Date;
}

interface lastUpdatedResponseDataType {
  lastUpdated?: LastUpdatedDataType;
  updatedData?: any[];
  message: string;
  isSynced: boolean;
}

interface LastUpdatedContextType {
  lastUpdatedData: LastUpdatedDataType | undefined;
  setLastUpdatedData: React.Dispatch<React.SetStateAction<LastUpdatedDataType | undefined>>;
}
interface LastUpdatedContextProviderType {
  children: ReactNode;
}

export const LastUpdatedContext = createContext<LastUpdatedContextType>({
  lastUpdatedData: undefined,
  setLastUpdatedData: () => {},
});

function LastUpdatedContextProvider({ children }: LastUpdatedContextProviderType) {
  const [lastUpdatedData, setLastUpdatedData] = useState<LastUpdatedDataType>();
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;
  const contexts = useAppContexts();
  const [firstConnect, setFirstConnect] = useState(true);

  /**
   * Fetches the lastUpdated data & updates lastUpdatedData
   */
  useEffect(() => {
    if (token) {
      async function getLastUpdatedData(token: string) {
        try {
          const response = await fetchData(token, 'last-updated/get-last-updated-data');
          setLastUpdatedData(response.data);
        } catch (error) {
          popupMessage(`Neuspešno preuzimanje podataka o vremenima ažuriranja`, 'danger');
          console.error(error);
        }
      }
      getLastUpdatedData(token);
    }
  }, [token]);

  function handleSyncLastUpdated(data: LastUpdatedDataType) {
    setLastUpdatedData(data);
  }

  /**
   * Upon establishing connection send lastUpdatedData to validate if our data is up to date
   */
  useEffect(() => {
    if (socket) {
      const handleConnect = () => {
        if (lastUpdatedData) {
          socket.emit('lastUpdated', lastUpdatedData);
        } else {
          if (firstConnect) {
            setFirstConnect(false);
          } else {
            popupMessage('LastUpdated data is missing', 'danger');
          }
        }
      };

      const handleLastUpdatedResponse = async (responseData: lastUpdatedResponseDataType) => {
        if (responseData.isSynced) {
          popupMessage(responseData.message, 'success');
        } else {
          popupMessage(responseData.message, 'success');
          const sortSuccess = await sortDataOnClientSync(responseData.updatedData);
          if (sortSuccess) {
            popupMessage('Ažuriranje svih podataka uspešno izvršeno', 'success');
            if (responseData.lastUpdated) handleSyncLastUpdated(responseData.lastUpdated);
          } else {
            popupMessage('Došlo je do problema prilikom ažuriranja podataka', 'danger');
          }
        }
      };

      socket.on('connect', handleConnect);
      socket.on('lastUpdatedResponse', handleLastUpdatedResponse);
      socket.on('syncLastUpdated', handleSyncLastUpdated);

      // Cleanup
      return () => {
        socket.off('connect', handleConnect);
        socket.off('lastUpdatedResponse', handleLastUpdatedResponse);
        socket.off('syncLastUpdated', handleSyncLastUpdated);
      };
    }
  }, [socket, lastUpdatedData, firstConnect]);

  /**
   * @param data
   * @returns Boolean value - true [All data is updated] | false [There was an issue while updating data]
   */
  async function sortDataOnClientSync(data: any) {
    let isAllSorted = true;
    let productsAlreadyUpdated = false;
    for (const dataType of data) {
      switch (dataType.key) {
        case 'color':
          updateColorContext(dataType.data);
          break;
        case 'category':
          updateCategoriesContext(dataType.data);
          break;
        case 'courier':
          updateCouriersContext(dataType.data);
          break;
        case 'dress':
          if (productsAlreadyUpdated) break;
          productsAlreadyUpdated = true;
          await fetchAllProducts();
          break;
        case 'dressColor':
          if (productsAlreadyUpdated) break;
          productsAlreadyUpdated = true;
          await fetchAllProducts();
          break;
        case 'purse':
          if (productsAlreadyUpdated) break;
          productsAlreadyUpdated = true;
          await fetchAllProducts();
          break;
        case 'purseColor':
          if (productsAlreadyUpdated) break;
          productsAlreadyUpdated = true;
          await fetchAllProducts();
          break;
        case 'supplier':
          updateSuppliersContext(dataType.data);
          break;
        case 'order':
          if (productsAlreadyUpdated) break;
          productsAlreadyUpdated = true;
          updateOrdersContext(dataType.data);
          await fetchAllProducts();
          await updateProcessedOrdersForPeriod();
          break;

        default:
          isAllSorted = false;
          popupMessage(`> Došlo je do problema prilikom razvrstavanja podataka za ${dataType.key}`, 'danger');
          betterErrorLog(`> Unhandled case in sortDataOnClientSync for key ${dataType.key}`, dataType);
      }
    }

    return isAllSorted;
  }

  // Color
  function updateColorContext(newData: ColorTypes[]) {
    contexts.colors.setColors(newData);
  }
  // Category
  function updateCategoriesContext(newData: CategoryTypes[]) {
    contexts.categories.setCategories(newData);
  }
  // Courier
  function updateCouriersContext(newData: CourierTypes[]) {
    contexts.couriers.setCouriers(newData);
  }
  // All Products
  async function fetchAllProducts() {
    await contexts.allProducts.fetchAllProducts();
  }
  // Supplier
  function updateSuppliersContext(newData: SupplierTypes[]) {
    contexts.suppliers.setSuppliers(newData);
  }
  // Processed Orders For Period
  async function updateProcessedOrdersForPeriod() {
    await contexts.processedOrdersForPeriod.fetchOrderStatisticsData();
  }
  // Order
  function updateOrdersContext(newData: any) {
    contexts.orders.setProcessedOrders(newData.processed);
    contexts.orders.setUnprocessedOrders(newData.unprocessed);
  }

  const value = useMemo(
    () => ({
      lastUpdatedData,
      setLastUpdatedData: setLastUpdatedData,
    }),
    [lastUpdatedData]
  );

  return <LastUpdatedContext.Provider value={value}>{children}</LastUpdatedContext.Provider>;
}

export default LastUpdatedContextProvider;
