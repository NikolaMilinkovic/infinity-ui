import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { CourierTypes } from '../types/allTsTypes';
import { fetchData } from '../util-methods/FetchMethods';
import { AuthContext } from './auth-context';
import { SocketContext } from './socket-context';

interface CouriersContextType {
  couriers: CourierTypes[];
  setCouriers: (couriers: CourierTypes[]) => void;
  getCouriers: () => CourierTypes[];
}
export const CouriersContext = createContext<CouriersContextType>({
  couriers: [],
  setCouriers: () => {},
  getCouriers: () => [],
});

interface CouriersContextProviderType {
  children: ReactNode;
}

/**
 * Caches all global courier objects
 */
function CouriersContextProvider({ children }: CouriersContextProviderType) {
  const [couriers, setCouriers] = useState<CourierTypes[]>([]);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;

  const setCouriersHandler = (couriers: CourierTypes[]) => {
    setCouriers(couriers);
  };
  const getCouriersHandler = () => {
    return couriers;
  };
  async function fetchCouriers(token: string) {
    const fetchedCouriers = await fetchData(token, 'couriers');
    console.log('[6][couriers-context] Initial fetch: true');

    if (fetchedCouriers !== false) setCouriers(fetchedCouriers);
  }

  useEffect(() => {
    if (token) fetchCouriers(token);
  }, [token]);

  // SOCKETS
  useEffect(() => {
    if (socket) {
      const handleCourierAdded = (newCourier: CourierTypes) => {
        setCouriers((prevCouriers) => [...prevCouriers, newCourier]);
      };
      const handleCourierRemoved = (courierId: string) => {
        setCouriers((prevCouriers) => prevCouriers.filter((courier) => courier._id !== courierId));
      };
      const handleCourierUpdated = (updatedCourier: CourierTypes) => {
        const newCourierObj = {
          _id: updatedCourier._id,
          name: updatedCourier.name,
          deliveryPrice: updatedCourier.deliveryPrice,
        };
        setCouriers((prevCouriers) =>
          prevCouriers.map((courier) => (courier._id === updatedCourier._id ? newCourierObj : courier))
        );
      };

      socket.on('courierAdded', handleCourierAdded);
      socket.on('courierRemoved', handleCourierRemoved);
      socket.on('courierUpdated', handleCourierUpdated);

      // Cleans up the listener on unmount
      // Without this we would get 2x the data as we are rendering multiple times
      return () => {
        socket.off('courierAdded', handleCourierAdded);
        socket.off('courierRemoved', handleCourierRemoved);
        socket.off('courierUpdated', handleCourierUpdated);
      };
    }
  }, [socket]);

  const value = { couriers, setCouriers: setCouriersHandler, getCouriers: getCouriersHandler };
  return <CouriersContext.Provider value={value}>{children}</CouriersContext.Provider>;
}

export default CouriersContextProvider;
