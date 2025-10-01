import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { PurseTypes } from '../types/allTsTypes';
import { fetchData } from '../util-methods/FetchMethods';
import { decreasePurseStock, increasePurseStock } from '../util-methods/StockMethods';
import { AuthContext } from './auth-context';
import { SocketContext } from './socket-context';

interface PurseContextType {
  activePurses: PurseTypes[];
  inactivePurses: PurseTypes[];
  setActivePurses: (purses: PurseTypes[]) => void;
  setInactivePurses: (purses: PurseTypes[]) => void;
  getActivePurses: () => PurseTypes[];
  getInactivePurses: () => PurseTypes[];
}
interface PurseContextProviderType {
  children: ReactNode;
}

export const PursesContext = createContext<PurseContextType>({
  activePurses: [],
  inactivePurses: [],
  setActivePurses: () => {},
  setInactivePurses: () => {},
  getActivePurses: () => [],
  getInactivePurses: () => [],
});

function PursesContextProvider({ children }: PurseContextProviderType) {
  const [activePurses, setActivePurses] = useState<PurseTypes[]>([]);
  const [inactivePurses, setInactivePurses] = useState<PurseTypes[]>([]);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;

  // Setters
  const setActivePursesHandler = (purses: PurseTypes[]) => {
    setActivePurses(purses);
  };
  const setInactivePursesHandler = (purses: PurseTypes[]) => {
    setInactivePurses(purses);
  };

  // Getters with memoization
  const getActivePursesHandler = () => activePurses;
  const getInactivePursesHandler = () => inactivePurses;

  // Fetched data
  useEffect(() => {
    if (token) {
      async function getPursesData(token: string) {
        try {
          const fetchActivePurses = await fetchData(token, 'products/active-purses');
          if (fetchActivePurses !== false) setActivePurses(fetchActivePurses);

          const fetchInactivePurses = await fetchData(token, 'products/inactive-purses');
          if (fetchInactivePurses !== false) setInactivePurses(fetchInactivePurses);
          console.log('%c[purses-context] Initial fetch: true', 'color: lightblue; font-weight: bold;');
        } catch (error) {
          console.log('%c[purses-context] Initial fetch: false', 'color: red; font-weight: bold;');
        }
      }
      getPursesData(token);
    }
  }, [token]);

  // Event handlers for socket updates
  function handleActivePurseAdded(newPurse: PurseTypes) {
    if (newPurse.active) {
      setActivePurses((prev) => [newPurse, ...prev]);
    } else {
      setInactivePurses((prev) => [newPurse, ...prev]);
    }
    // setActivePurses((prevPurses) => [...prevPurses, newPurse]);
  }

  function handleInactivePurseAdded(newPurse: PurseTypes) {
    if (newPurse.active) {
      setActivePurses((prev) => [newPurse, ...prev]);
    } else {
      setInactivePurses((prev) => [newPurse, ...prev]);
    }
    // setInactivePurses((prevPurses) => [...prevPurses, newPurse]);
  }

  function handleActivePurseRemoved(purseId: string) {
    setActivePurses((prevPurses) => prevPurses.filter((purse) => purse._id !== purseId));
  }

  function handleInactivePurseRemoved(purseId: string) {
    setInactivePurses((prevPurses) => prevPurses.filter((purse) => purse._id !== purseId));
  }

  function handleActiveToInactive(purseId: string) {
    setActivePurses((prevPurses) => {
      const removedPurse = prevPurses.find((purse) => purse._id === purseId);
      if (removedPurse) {
        setInactivePurses((prevInactive) => [...prevInactive, removedPurse]);
        return prevPurses.filter((purse) => purse._id !== purseId);
      }
      return prevPurses;
    });
  }

  function handleInactiveToActive(purseId: string) {
    setInactivePurses((prevPurses) => {
      const removedPurse = prevPurses.find((purse) => purse._id === purseId);
      if (removedPurse) {
        setActivePurses((prevActive) => [...prevActive, removedPurse]);
        return prevPurses.filter((purse) => purse._id !== purseId);
      }
      return prevPurses;
    });
  }

  function decreasePurseStockHandler(data: any) {
    if (data.stockType === 'Boja-Količina') {
      decreasePurseStock(data, setActivePurses as React.Dispatch<React.SetStateAction<PurseTypes[]>>);
    }
  }
  function increasePurseStockHandler(data: any) {
    if (data.stockType === 'Boja-Količina') {
      increasePurseStock(data, setActivePurses as React.Dispatch<React.SetStateAction<PurseTypes[]>>);
    }
  }

  // Set up socket listeners
  useEffect(() => {
    if (socket) {
      socket.on('activePurseAdded', handleActivePurseAdded);
      socket.on('inactivePurseAdded', handleInactivePurseAdded);
      socket.on('activePurseRemoved', handleActivePurseRemoved);
      socket.on('inactivePurseRemoved', handleInactivePurseRemoved);
      socket.on('activePurseToInactive', handleActiveToInactive);
      socket.on('inactivePurseToActive', handleInactiveToActive);
      socket.on('handlePurseStockDecrease', decreasePurseStockHandler);
      socket.on('handlePurseStockIncrease', increasePurseStockHandler);

      return () => {
        socket.off('activePurseAdded', handleActivePurseAdded);
        socket.off('inactivePurseAdded', handleInactivePurseAdded);
        socket.off('activePurseRemoved', handleActivePurseRemoved);
        socket.off('inactivePurseRemoved', handleInactivePurseRemoved);
        socket.off('activePurseToInactive', handleActiveToInactive);
        socket.off('inactivePurseToActive', handleInactiveToActive);
        socket.off('handlePurseStockDecrease', decreasePurseStockHandler);
        socket.off('handlePurseStockIncrease', increasePurseStockHandler);
      };
    }
  }, [socket]);

  // Memoizing the getters
  const value = useMemo(
    () => ({
      activePurses,
      setActivePurses: setActivePursesHandler,
      getActivePurses: getActivePursesHandler,
      inactivePurses,
      setInactivePurses: setInactivePursesHandler,
      getInactivePurses: getInactivePursesHandler,
    }),
    [activePurses, inactivePurses]
  );

  return <PursesContext.Provider value={value}>{children}</PursesContext.Provider>;
}

export default PursesContextProvider;
