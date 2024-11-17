import { createContext, useEffect, useState, ReactNode, useContext, useMemo } from "react";
import { AuthContext } from "./auth-context";
import { SocketContext } from "./socket-context";
import { fetchData } from "../util-methods/FetchMethods";
import { ProcessedOrderStatisticsFileTypes as StatFileTypes } from "../types/allTsTypes";
import { betterConsoleLog } from "../util-methods/LogMethods";

interface OrderStatisticsContextType {
  statisticData: StatFileTypes[];
  setStatisticData: (data: StatFileTypes[]) => void;
}
interface OrderStatisticsContextProviderType {
  children: ReactNode;
}

export const OrderStatisticsContext = createContext<OrderStatisticsContextType>({
  statisticData: [],
  setStatisticData: () => {},
});

function EndOfDayStatisticsContextProvider({ children }: OrderStatisticsContextProviderType) {
  const [statisticData, setStatisticData] = useState<StatFileTypes[]>([]);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;

  // Fetched data
  useEffect(() => {
    console.log('> getOrderStatisticsData USE EFFECT IS RUNNING NOW.')
    if (token) {
      async function getOrderStatisticsData(token: string) {
        try{
          const fetchedData = await fetchData(token, 'orders/get-order-statistic-files-for-period');
          setStatisticData(fetchedData.data);
          betterConsoleLog('> LOGGING OUT FETCHED ORDERS STATISTICS DATA FILE LENGTH', fetchedData.data.length);
        } catch(error){
          console.error(error);
        }
      }
      getOrderStatisticsData(token);
    }
  }, [token]);

  // Set up socket listeners
  useEffect(() => {
    if (socket) {
      // socket.on('activeDressAdded', handleActiveDressAdded);

      return () => {
        // socket.off("activeDressAdded", handleActiveDressAdded);
      };
    }
  }, [socket]);

  // Memoizing the getters
  const value = useMemo(() => ({
    statisticData,
    setStatisticData: setStatisticData,
  }), [statisticData]);

  return <OrderStatisticsContext.Provider value={value}>{children}</OrderStatisticsContext.Provider>;
}

export default EndOfDayStatisticsContextProvider;
