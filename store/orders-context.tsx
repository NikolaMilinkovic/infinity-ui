import { createContext, useEffect, useState, ReactNode, useContext, useMemo } from "react";
import { AuthContext } from "./auth-context";
import { SocketContext } from "./socket-context";
import { fetchData } from "../util-methods/FetchMethods";
import { betterConsoleLog } from "../util-methods/LogMethods";
import { CourierTypesWithNoId, OrderProductTypes, OrderTypes } from "../types/allTsTypes";
import { resetToDefaults } from "@testing-library/react-native";

interface OrdersContextTypes {
  unprocessedOrders: OrderTypes[]
  processedOrders: OrderTypes[]
  customOrderSet: OrderTypes[]
  setCustomOrderSet: (orders: OrderTypes[]) => void
  customReservationsSet: OrderTypes[]
  setCustomReservationsSet: (reservations: OrderTypes[]) => void
  unpackedOrders: OrderTypes[]
  setUnpackedOrders: (orders: OrderTypes[]) => void
}

export const OrdersContext = createContext<OrdersContextTypes>({
  unprocessedOrders: [],
  processedOrders: [],
  customOrderSet: [],
  setCustomOrderSet: () => {},
  customReservationsSet: [],
  setCustomReservationsSet: () => {},
  unpackedOrders: [],
  setUnpackedOrders: () => {},
})

interface OrdersContextProviderTypes {
  children: ReactNode
}

function OrdersContextProvider({ children }: OrdersContextProviderTypes){
  const [unprocessedOrders, setUnprocessedOrders] = useState<OrderTypes[]>([]);
  const [processedOrders, setProcessedOrders] = useState<OrderTypes[]>([]);
  const [customOrderSet, setCustomOrderSet] = useState<OrderTypes[]>([]);
  const [customReservationsSet, setCustomReservationsSet] = useState<OrderTypes[]>([]);
  const [unpackedOrders, setUnpackedOrders] = useState<OrderTypes[]>([]);
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
    async function fetchProcessedOrdersData(){
      const processedOrdersData = await fetchData(token, 'orders/processed');
      console.log('> Processed orders fetched length is: ', processedOrdersData.orders.length);
      setProcessedOrders(processedOrdersData.orders);
    }
    async function fetchUnpackedOrders(){
      const unpackedOrdersData = await fetchData(token, 'orders/unpacked');
      console.log('> Unpacked orders fetched length is: ', unpackedOrdersData.orders.length);
      setUnpackedOrders(unpackedOrdersData.orders);
    }
    if(token){
      fetchUnprocessedOrdersData();
      fetchProcessedOrdersData();
      fetchUnpackedOrders();
    }
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

  function handleOrderAdded(newOrder: OrderTypes){
    setUnprocessedOrders((prev) => [...prev, newOrder]);
  }
  function handleOrderUpdated(updatedOrder: OrderTypes){
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

  function handleStockIndicatorToTrue(id: string){
    setUnpackedOrders((prevOrders) => 
      prevOrders.map((order) =>
        order._id === id 
        ? {...order, packedIndicator: true} 
        : order
      )
    )
  }
  function handleStockIndicatorToFalse(id: string){
    setUnpackedOrders((prevOrders) => 
      prevOrders.map((order) =>
        order._id === id 
        ? {...order, packedIndicator: false} 
        : order
      )
    )
  }
  function handlePackOrders(orderIds: string[]){
    setUnpackedOrders((prevOrders) => 
      prevOrders.map((order) => 
        orderIds.includes(order._id)
          ? { ...order, packed: true }
          : order
      )
    )
  }
  interface ReservationType {
    _id: string
  }
  interface ReservationsToOrdersDataTypes {
    courier: CourierTypesWithNoId
    reservations: ReservationType[]
  }
  function handleReservationsToOrders(data: ReservationsToOrdersDataTypes){
    const updatedIds = data.reservations.map((data) => String(data._id));
    setUnprocessedOrders((prevOrders) =>
      prevOrders.map((item) => {
        if (updatedIds.includes(item._id)) {
          return {
            ...item,
            reservation: false,
            courier: {
              name: data.courier.name,
              deliveryPrice: data.courier.deliveryPrice,
            },
            totalPrice: Number(item.productsPrice) + Number(data.courier.deliveryPrice),
          };
        }
        return item;
      })
    );
  }

  function handleProcessOrdersByIds(orderIds: string[]){
    const ids = orderIds.map((data) => String(data));
    let items: OrderTypes[] = [];

    // Filter and remove matching orders from setUnprocessedOrders
    setUnprocessedOrders((prevOrders) => {
      return prevOrders.filter((order) => {
        if (ids.includes(String(order._id))) {
          items.push({ ...order, processed: true });
          return false;
        }
        return true;
      });
    });

    // Add updated items to setProcessedOrders
    setProcessedOrders((prevProcessedOrders) => {
      return [...prevProcessedOrders, ...items];
    });
  }
  
  useEffect(() => {
    if(!socket) return;

    socket.on('orderAdded', handleOrderAdded);
    socket.on('orderRemoved', handleOrderRemoved);
    socket.on('orderBatchRemoved', handleBatchOrderRemoved);
    socket.on('orderUpdated', handleOrderUpdated);
    socket.on('setStockIndicatorToTrue', handleStockIndicatorToTrue);
    socket.on('setStockIndicatorToFalse', handleStockIndicatorToFalse);
    socket.on('packOrdersByIds', handlePackOrders);
    socket.on('reservationsToOrders', handleReservationsToOrders);
    socket.on('processOrdersByIds', handleProcessOrdersByIds);

    // Cleans up the listener on unmount
    // Without this we would get 2x the data as we are rendering multiple times
    return () => {
      socket.off('orderAdded', handleOrderAdded);
      socket.off('orderRemoved', handleOrderRemoved);
      socket.off('orderBatchRemoved', handleBatchOrderRemoved);
      socket.off('orderUpdated', handleOrderUpdated);
      socket.off('setStockIndicatorToTrue', handleStockIndicatorToTrue);
      socket.off('setStockIndicatorToFalse', handleStockIndicatorToFalse);
      socket.off('packOrdersByIds', handlePackOrders);
      socket.off('reservationsToOrders', handleReservationsToOrders);
      socket.off('processOrdersByIds', handleProcessOrdersByIds);
    };
  }, [socket]);

    // Memoizing the getters
    const value = useMemo(() => ({
      unprocessedOrders,
      processedOrders,
      customOrderSet,
      setCustomOrderSet,
      customReservationsSet,
      setCustomReservationsSet,
      unpackedOrders,
      setUnpackedOrders,
    }), [unprocessedOrders, processedOrders, customOrderSet, customReservationsSet, unpackedOrders]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export default OrdersContextProvider