import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CourierTypesWithNoId, OrderTypes } from '../types/allTsTypes';
import { fetchData } from '../util-methods/FetchMethods';
import { betterErrorLog } from '../util-methods/LogMethods';
import { AppContext } from './app-context';
import { AuthContext } from './auth-context';
import { SocketContext } from './socket-context';

interface OrdersContextTypes {
  orders: OrderTypes[];
  unprocessedOrders: OrderTypes[];
  processedOrders: OrderTypes[];
  customOrderSet: OrderTypes[];
  setCustomOrderSet: (orders: OrderTypes[]) => void;
  customReservationsSet: OrderTypes[];
  setCustomReservationsSet: (reservations: OrderTypes[]) => void;
  unpackedOrders: OrderTypes[];
  processedOrdersStats: any;
  fetchOrders: () => Promise<void>;
  setOrders: React.Dispatch<React.SetStateAction<OrderTypes[]>>;
}

export const OrdersContext = createContext<OrdersContextTypes>({
  orders: [],
  unprocessedOrders: [],
  processedOrders: [],
  customOrderSet: [],
  setCustomOrderSet: () => {},
  customReservationsSet: [],
  setCustomReservationsSet: () => {},
  unpackedOrders: [],
  processedOrdersStats: {},
  fetchOrders: async () => {},
  setOrders: () => {},
});

interface OrdersContextProviderTypes {
  children: ReactNode;
}

function OrdersContextProvider({ children }: OrdersContextProviderTypes) {
  const [orders, setOrders] = useState<OrderTypes[]>([]);
  const [processedOrdersStats, setProcessedOrdersStats] = useState(null);
  const [customOrderSet, setCustomOrderSet] = useState<OrderTypes[]>([]);
  const [customReservationsSet, setCustomReservationsSet] = useState<OrderTypes[]>([]);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;
  const appCtx = useContext(AppContext);
  const boutiqueId = appCtx.data._id.toString();

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      const [unprocessedData, processedData] = await Promise.all([
        fetchData(token, 'orders/unprocessed'),
        fetchData(token, 'orders/processed'),
      ]);

      // merge both sets
      const merged = [...unprocessedData.orders, ...processedData.orders];
      setOrders(merged);
      setProcessedOrdersStats(processedData.stats || null);
    } catch (err) {
      betterErrorLog('> Error refetching orders', err);
    }
  }, [token, boutiqueId]);

  // ✅ initial load
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // FILTER AND SET UNPACKED ORDERS
  const unprocessedOrders = useMemo(() => orders.filter((o) => !o.processed && !o.reservation), [orders]);
  const processedOrders = useMemo(() => orders.filter((o) => o.processed && !o.reservation), [orders]);
  const unpackedOrders = useMemo(() => orders.filter((o) => !o.packed && !o.reservation), [orders]);

  function handleOrderRemoved(orderId: string) {
    setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
  }
  function handleBatchOrderRemoved(orderIds: string[]) {
    setOrders((prevOrders) => prevOrders.filter((order) => !orderIds.includes(order._id)));
  }

  function handleOrderAdded(newOrder: OrderTypes) {
    setOrders((prev) => [newOrder, ...prev]);
  }
  function handleOrderUpdated(updatedOrder: OrderTypes) {
    const hasAllIds = updatedOrder.products.every((product) => product._id);
    if (!hasAllIds) {
      console.warn('Updated order contains products without _id fields:', updatedOrder);
    }
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order._id.toString() === updatedOrder._id.toString() ? updatedOrder : order))
    );
  }

  function handleStockIndicatorToTrue(id: string) {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order._id === id) {
          return { ...order, packedIndicator: !order.packedIndicator };
        }
        return order;
      })
    );
  }
  function handleStockIndicatorToFalse(id: string) {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order._id === id) {
          return { ...order, packedIndicator: !order.packedIndicator };
        }
        return order;
      })
    );
  }
  function handlePackOrders(orderIds: string[]) {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (orderIds.includes(order._id) ? { ...order, packed: true } : order))
    );
  }
  interface ReservationType {
    _id: string;
  }
  interface ReservationsToOrdersDataTypes {
    courier: CourierTypesWithNoId;
    reservations: ReservationType[];
  }
  function handleReservationsToOrders(data: ReservationsToOrdersDataTypes) {
    const updatedIds = data.reservations.map((data) => String(data._id));
    setOrders((prevOrders) =>
      prevOrders.map((item) => {
        if (updatedIds.includes(item._id)) {
          return {
            ...item,
            reservation: false,
            courier: {
              name: data.courier.name,
              deliveryPrice: data.courier.deliveryPrice,
            },
            createdAt: new Date() as any,
          };
        }
        return item;
      })
    );
  }

  function handleProcessOrdersByIds(orderIds: string[]) {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (orderIds.includes(order._id.toString()) ? { ...order, processed: true } : order))
    );
  }

  // TO DO: Type for statistics file
  function handleGetProcessedOrdersStatistics(statisticsFile: any) {
    setProcessedOrdersStats(statisticsFile);
  }

  useEffect(() => {
    if (!socket) return;

    socket.on('orderAdded', handleOrderAdded);
    socket.on('orderRemoved', handleOrderRemoved);
    socket.on('orderBatchRemoved', handleBatchOrderRemoved);
    socket.on('orderUpdated', handleOrderUpdated);
    socket.on('setStockIndicatorToTrue', handleStockIndicatorToTrue);
    socket.on('setStockIndicatorToFalse', handleStockIndicatorToFalse);
    socket.on('packOrdersByIds', handlePackOrders);
    socket.on('reservationsToOrders', handleReservationsToOrders);
    socket.on('processOrdersByIds', handleProcessOrdersByIds);
    socket.on('getProcessedOrdersStatistics', handleGetProcessedOrdersStatistics);

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
      socket.off('getProcessedOrdersStatistics', handleGetProcessedOrdersStatistics);
    };
  }, [socket, token, boutiqueId]);

  const value = useMemo(
    () => ({
      orders,
      setOrders,
      unprocessedOrders,
      processedOrders,
      unpackedOrders,
      customOrderSet,
      customReservationsSet,
      processedOrdersStats,
      setCustomOrderSet,
      setCustomReservationsSet,
      fetchOrders,
    }),
    [
      orders,
      unprocessedOrders,
      processedOrders,
      customOrderSet,
      customReservationsSet,
      unpackedOrders,
      processedOrdersStats,
    ]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export default OrdersContextProvider;
