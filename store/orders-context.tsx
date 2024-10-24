import { createContext, useEffect, useState, ReactNode, useContext } from "react";
import { AuthContext } from "./auth-context";
import { SocketContext } from "./socket-context";
import { fetchData } from "../util-methods/FetchMethods";

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
  const [unprocessedOrders, setUnprocessedOrders] = useState([]);
  const [processedOrders, setProcessedOrders] = useState([]);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;

  // Initial orders data fetch
  useEffect(() => {
    async function fetchUnprocessedOrdersData(){
      setUnprocessedOrders(await fetchData(token, 'orders/unprocessed'));
    }
    if(token) fetchUnprocessedOrdersData();
  }, [unprocessedOrders])
  useEffect(() => {
    async function fetchProcessedOrdersData(){
      setProcessedOrders(await fetchData(token, 'orders/processed'));
    }
    if(token) fetchProcessedOrdersData();
  }, [processedOrders])

  useEffect(() => {
    if(!socket) return;

    // socket.on('orderAdded', handleOrderAdded);
    // socket.on('orderRemoved', handleOrderRemoved);
    // socket.on('orderUpdated', handleOrderUpdated);

    // Cleans up the listener on unmount
    // Without this we would get 2x the data as we are rendering multiple times
    return () => {
      // socket.off('orderAdded', handleOrderAdded);
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