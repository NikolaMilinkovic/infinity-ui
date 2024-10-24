import { createContext, useEffect, useState, ReactNode, useContext } from "react";
import { AuthContext } from "./auth-context";
import { SocketContext } from "./socket-context";
import { fetchData } from "../util-methods/FetchMethods";
import { betterConsoleLog } from "../util-methods/LogMethods";
import { OrderProductTypes } from "../types/allTsTypes";

interface OrdersContextTypes {
  unprocessedOrders: any[]
  processedOrders: any[]
}

export const OrdersContext = createContext<OrdersContextTypes>({
  unprocessedOrders: [],
  processedOrders: [],
})

interface OrdersContextProviderTypes {
  children: ReactNode
}

function OrdersContextProvider({ children }: OrdersContextProviderTypes){
  const [unprocessedOrders, setUnprocessedOrders] = useState<OrderProductTypes[]>([]);
  const [processedOrders, setProcessedOrders] = useState<OrderProductTypes[]>([]);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;

  // Initial orders data fetch
  useEffect(() => {
    async function fetchUnprocessedOrdersData(){
      const unprocessedOrdersData = await fetchData(token, 'orders/unprocessed')
      console.log('> Unprocessed orders fetched length is: ', unprocessedOrdersData.orders.length);
      setUnprocessedOrders(unprocessedOrdersData.orders);
    }
    if(token) fetchUnprocessedOrdersData();
  }, [token])
  useEffect(() => {
    async function fetchProcessedOrdersData(){
      const processedOrdersData = await fetchData(token, 'orders/processed');
      console.log('> Processed orders fetched length is: ', processedOrdersData.orders.length);
      setProcessedOrders(processedOrdersData.orders);
    }
    if(token) fetchProcessedOrdersData();
  }, [token])

  useEffect(() => {
    betterConsoleLog('> Neaktivne, procesovane porudzbine: ', processedOrders.length);
  }, [processedOrders])
  useEffect(() => {
    betterConsoleLog('> Aktivne, jos ne procesovane porudzbine: ', unprocessedOrders);
  }, [unprocessedOrders])

  function handleOrderAdded(newOrder: OrderProductTypes){
    betterConsoleLog('> Adding new order to unprocessed orders:', newOrder);
    setUnprocessedOrders((prev) => [...prev, newOrder]);
  }

  useEffect(() => {
    if(!socket) return;

    socket.on('orderAdded', handleOrderAdded);
    // socket.on('orderRemoved', handleOrderRemoved);
    // socket.on('orderUpdated', handleOrderUpdated);

    // Cleans up the listener on unmount
    // Without this we would get 2x the data as we are rendering multiple times
    return () => {
      socket.off('orderAdded', handleOrderAdded);
      // socket.off('orderRemoved', handleOrderRemoved);
      // socket.off('orderUpdated', handleOrderUpdated);
    };
  }, [socket]);

  const value = {
    unprocessedOrders,
    processedOrders,
  }

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export default OrdersContextProvider