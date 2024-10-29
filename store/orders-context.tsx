import { createContext, useEffect, useState, ReactNode, useContext, useMemo } from "react";
import { AuthContext } from "./auth-context";
import { SocketContext } from "./socket-context";
import { fetchData } from "../util-methods/FetchMethods";
import { betterConsoleLog } from "../util-methods/LogMethods";
import { OrderProductTypes, OrderTypes } from "../types/allTsTypes";

interface OrdersContextTypes {
  unprocessedOrders: OrderTypes[]
  processedOrders: OrderTypes[]
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
      const unprocessedOrdersData = await fetchData(token, 'orders/unprocessed');
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
  }, [token]);

  function handleOrderRemoved(orderId: string) {
    console.log('Order id is ' + orderId);
  
    setUnprocessedOrders((prevUnprocessedOrders) =>
      prevUnprocessedOrders.filter((order) => order._id !== orderId)
    );
  
    setProcessedOrders((prevProcessedOrders) =>
      prevProcessedOrders.filter((order) => order._id !== orderId)
    );
  }
  
  function handleBatchOrderRemoved(orderIds: string[]) {
    betterConsoleLog('> Order ids are', orderIds);
  
    setUnprocessedOrders((prevUnprocessedOrders) =>
      prevUnprocessedOrders.filter((order) => !orderIds.includes(order._id))
    );
  
    setProcessedOrders((prevProcessedOrders) =>
      prevProcessedOrders.filter((order) => !orderIds.includes(order._id))
    );
  }
  useEffect(() => {
    console.log('> Unprocessed orders length is: ', unprocessedOrders.length);
    console.log('> Processed orders length is: ', unprocessedOrders.length);
  }, [unprocessedOrders, processedOrders])

  // useEffect(() => {
  //   betterConsoleLog('> Neaktivne, procesovane porudzbine: ', processedOrders.length);
  // }, [processedOrders])
  // useEffect(() => {
  //   betterConsoleLog('> Aktivne, jos ne procesovane porudzbine: ', unprocessedOrders);
  // }, [unprocessedOrders])

  function handleOrderAdded(newOrder: OrderProductTypes){
    // betterConsoleLog('> Adding new order to unprocessed orders:', newOrder);
    setUnprocessedOrders((prev) => [...prev, newOrder]);
  }

  useEffect(() => {
    if(!socket) return;

    socket.on('orderAdded', handleOrderAdded);
    socket.on('orderRemoved', handleOrderRemoved);
    socket.on('orderBatchRemoved', handleBatchOrderRemoved);
    // socket.on('orderUpdated', handleOrderUpdated);

    // Cleans up the listener on unmount
    // Without this we would get 2x the data as we are rendering multiple times
    return () => {
      socket.off('orderAdded', handleOrderAdded);
      socket.off('orderRemoved', handleOrderRemoved);
      socket.off('orderBatchRemoved', handleBatchOrderRemoved);
      // socket.off('orderUpdated', handleOrderUpdated);
    };
  }, [socket]);

    // Memoizing the getters
    const value = useMemo(() => ({
      unprocessedOrders,
      processedOrders,
    }), [unprocessedOrders, processedOrders]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export default OrdersContextProvider