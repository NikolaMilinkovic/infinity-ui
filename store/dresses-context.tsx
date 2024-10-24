import { createContext, useEffect, useState, ReactNode, useContext, useMemo } from "react";
import { AuthContext } from "./auth-context";
import { SocketContext } from "./socket-context";
import { fetchData } from "../util-methods/FetchMethods";
import { betterConsoleLog } from "../util-methods/LogMethods";
import { DressTypes } from "../types/allTsTypes";
import { decreaseDressStock } from "../util-methods/StockMethods";

interface DressContextType {
  activeDresses: DressTypes[];
  inactiveDresses: DressTypes[];
  setActiveDresses: (dresses: DressTypes[]) => void;
  setInactiveDresses: (dresses: DressTypes[]) => void;
  getActiveDresses: () => DressTypes[];
  getInactiveDresses: () => DressTypes[];
}
interface DressContextProviderType {
  children: ReactNode;
}

export const DressesContext = createContext<DressContextType>({
  activeDresses: [],
  inactiveDresses: [],
  setActiveDresses: () => {},
  setInactiveDresses: () => {},
  getActiveDresses: () => [],
  getInactiveDresses: () => [],
});

function DressesContextProvider({ children }: DressContextProviderType) {
  const [activeDresses, setActiveDresses] = useState<DressTypes[]>([]);
  const [inactiveDresses, setInactiveDresses] = useState<DressTypes[]>([]);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;

  // Setters
  const setActiveDressesHandler = (dresses: DressTypes[]) => {
    setActiveDresses(dresses);
  };
  const setInactiveDressesHandler = (dresses: DressTypes[]) => {
    setInactiveDresses(dresses);
  };

  // Getters with memoization
  const getActiveDressesHandler = () => activeDresses;
  const getInactiveDressesHandler = () => inactiveDresses;

  // Fetched data
  useEffect(() => {
    if (token) {
      async function getDressesData(token: string) {
        const fetchActiveDresses = await fetchData(token, 'products/active-dresses');
        if (fetchActiveDresses !== false) setActiveDresses(fetchActiveDresses);

        const fetchInactiveDresses = await fetchData(token, 'products/inactive-dresses');
        if (fetchInactiveDresses !== false) setInactiveDresses(fetchInactiveDresses);
      }
      getDressesData(token);
    }
  }, [token]);

  // Event handlers for socket updates
  function handleActiveDressAdded(newDress: DressTypes) {
    setActiveDresses((prevDresses) => [...prevDresses, newDress]);
  }

  function handleInactiveDressAdded(newDress: DressTypes) {
    setInactiveDresses((prevDresses) => [...prevDresses, newDress]);
  }

  function handleActiveDressRemoved(dressId: string) {
    setActiveDresses((prevDresses) => prevDresses.filter((dress) => dress._id !== dressId));
  }

  function handleInactiveDressRemoved(dressId: string) {
    setInactiveDresses((prevDresses) => prevDresses.filter((dress) => dress._id !== dressId));
  }

  function handleActiveToInactive(dressId: string) {
    setActiveDresses((prevDresses) => {
      const removedDress = prevDresses.find((dress) => dress._id === dressId);
      if (removedDress) {
        setInactiveDresses((prevInactive) => [...prevInactive, removedDress]);
        return prevDresses.filter((dress) => dress._id !== dressId);
      }
      return prevDresses;
    });
  }

  function handleInactiveToActive(dressId: string) {
    setInactiveDresses((prevDresses) => {
      const removedDress = prevDresses.find((dress) => dress._id === dressId);
      if (removedDress) {
        setActiveDresses((prevActive) => [...prevActive, removedDress]);
        return prevDresses.filter((dress) => dress._id !== dressId);
      }
      return prevDresses;
    });
  }

  function decreaseDressStockHandler(data: any){
    if(data.stockType === 'Boja-Veličina-Količina'){
      decreaseDressStock(data, setActiveDresses as React.Dispatch<React.SetStateAction<DressTypes[]>>)
    }
  }
  

  // Set up socket listeners
  useEffect(() => {
    if (socket) {
      socket.on('activeDressAdded', handleActiveDressAdded);
      socket.on('inactiveDressAdded', handleInactiveDressAdded);
      socket.on('activeDressRemoved', handleActiveDressRemoved);
      socket.on('inactiveDressRemoved', handleInactiveDressRemoved);
      socket.on('activeDressToInactive', handleActiveToInactive);
      socket.on('inactiveDressToActive', handleInactiveToActive);
      // socket.on('handleStockIncrease', increaseStock);
      socket.on('handleDressStockDecrease', decreaseDressStockHandler);

      return () => {
        socket.off("activeDressAdded", handleActiveDressAdded);
        socket.off("inactiveDressAdded", handleInactiveDressAdded);
        socket.off("activeDressRemoved", handleActiveDressRemoved);
        socket.off("inactiveDressRemoved", handleInactiveDressRemoved);
        socket.off("activeDressToInactive", handleActiveToInactive);
        socket.off("inactiveDressToActive", handleInactiveToActive);
        // socket.off('handleStockIncrease', increaseStock);
        socket.off('handleDressStockDecrease', decreaseDressStockHandler);
      };
    }
  }, [socket]);

  // Memoizing the getters
  const value = useMemo(() => ({
    activeDresses,
    setActiveDresses: setActiveDressesHandler,
    getActiveDresses: getActiveDressesHandler,
    inactiveDresses,
    setInactiveDresses: setInactiveDressesHandler,
    getInactiveDresses: getInactiveDressesHandler,
  }), [activeDresses, inactiveDresses]);

  return <DressesContext.Provider value={value}>{children}</DressesContext.Provider>;
}

export default DressesContextProvider;
