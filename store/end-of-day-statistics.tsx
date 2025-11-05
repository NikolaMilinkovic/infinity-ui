import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { ProcessedOrderStatisticsFileTypes as StatFileTypes } from '../types/allTsTypes';
import { fetchData } from '../util-methods/FetchMethods';
import { AuthContext } from './auth-context';
import { SocketContext } from './socket-context';

interface OrderStatisticsContextType {
  statisticData: StatFileTypes[];
  setStatisticData: (data: StatFileTypes[]) => void;
  fetchOrderStatisticsData: () => Promise<void>;
}
interface OrderStatisticsContextProviderType {
  children: ReactNode;
}

export const OrderStatisticsContext = createContext<OrderStatisticsContextType>({
  statisticData: [],
  setStatisticData: () => {},
  fetchOrderStatisticsData: async () => {},
});

function EndOfDayStatisticsContextProvider({ children }: OrderStatisticsContextProviderType) {
  const [statisticData, setStatisticData] = useState<StatFileTypes[]>([]);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;

  // Fetched data
  useEffect(() => {
    if (token) {
      async function getOrderStatisticsData(token: string) {
        try {
          const fetchedData = await fetchData(token, 'orders/get-order-statistic-files-for-period');
          setStatisticData(fetchedData.data);
        } catch (error) {
          console.error(error);
        }
      }
      getOrderStatisticsData(token);
    }
  }, [token]);

  // TO DO : Add types
  function handleAddNewStatisticFile(file: any) {
    setStatisticData((prev) => [file, ...prev]);
  }

  // Set up socket listeners
  useEffect(() => {
    if (socket) {
      socket.on('addNewStatisticFile', handleAddNewStatisticFile);

      return () => {
        socket.off('addNewStatisticFile', handleAddNewStatisticFile);
      };
    }
  }, [socket]);

  async function fetchOrderStatisticsData() {
    if (!token) return;
    try {
      const fetchedData = await fetchData(token, 'orders/get-order-statistic-files-for-period');
      setStatisticData(fetchedData.data);
    } catch (error) {
      console.error(error);
    }
  }

  const value = useMemo(
    () => ({
      statisticData,
      setStatisticData: setStatisticData,
      fetchOrderStatisticsData: fetchOrderStatisticsData,
    }),
    [statisticData]
  );

  return <OrderStatisticsContext.Provider value={value}>{children}</OrderStatisticsContext.Provider>;
}

export default EndOfDayStatisticsContextProvider;
