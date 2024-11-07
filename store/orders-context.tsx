import { createContext, useEffect, useState, ReactNode, useContext, useMemo } from "react";
import { AuthContext } from "./auth-context";
import { SocketContext } from "./socket-context";
import { fetchData } from "../util-methods/FetchMethods";
import { betterConsoleLog } from "../util-methods/LogMethods";
import { OrderProductTypes, OrderTypes } from "../types/allTsTypes";

interface OrdersContextTypes {
  unprocessedOrders: OrderTypes[]
  processedOrders: OrderTypes[]
  customOrderSet: OrderTypes[]
  setCustomOrderSet: (orders: OrderTypes[]) => void
}

export const OrdersContext = createContext<OrdersContextTypes>({
  unprocessedOrders: [],
  processedOrders: [],
  customOrderSet: [],
  setCustomOrderSet: () => {}
})

interface OrdersContextProviderTypes {
  children: ReactNode
}

function OrdersContextProvider({ children }: OrdersContextProviderTypes){
  const [unprocessedOrders, setUnprocessedOrders] = useState<OrderProductTypes[]>([]);
  const [processedOrders, setProcessedOrders] = useState<OrderProductTypes[]>([]);
  const [customOrderSet, setCustomOrderSet] = useState<OrderProductTypes[]>([]);
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
    setUnprocessedOrders((prev) => [...prev, newOrder]);
  }
  function handleOrderUpdated(updatedOrder: OrderTypes){
    console.log('> handleOrderUpdated')
    betterConsoleLog('> Logging updated order', updatedOrder)
    const hasAllIds = updatedOrder.products.every(product => product._id);
    if (!hasAllIds) {
      console.warn("Updated order contains products without _id fields:", updatedOrder);
    }
    setUnprocessedOrders((prevOrders) => 
      prevOrders.map((order) => 
        order._id.toString() === updatedOrder._id.toString() ? updatedOrder : order
      )  
    );
  }

  useEffect(() => {
    if(!socket) return;

    socket.on('orderAdded', handleOrderAdded);
    socket.on('orderRemoved', handleOrderRemoved);
    socket.on('orderBatchRemoved', handleBatchOrderRemoved);
    socket.on('orderUpdated', handleOrderUpdated);

    // Cleans up the listener on unmount
    // Without this we would get 2x the data as we are rendering multiple times
    return () => {
      socket.off('orderAdded', handleOrderAdded);
      socket.off('orderRemoved', handleOrderRemoved);
      socket.off('orderBatchRemoved', handleBatchOrderRemoved);
      socket.off('orderUpdated', handleOrderUpdated);
    };
  }, [socket]);

    // Memoizing the getters
    const value = useMemo(() => ({
      unprocessedOrders,
      processedOrders,
      customOrderSet,
      setCustomOrderSet
    }), [unprocessedOrders, processedOrders, customOrderSet]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export default OrdersContextProvider