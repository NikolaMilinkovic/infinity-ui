import { createContext, useEffect, useState, ReactNode, useContext, useMemo } from "react";
import { AuthContext } from "./auth-context";
import { SocketContext } from "./socket-context";
import { fetchData } from "../util-methods/FetchMethods";
import { PurseTypes } from "../types/allTsTypes";
import { betterConsoleLog } from "../util-methods/LogMethods";
import { decreasePurseStock } from "../util-methods/StockMethods";

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
        const fetchActivePurses = await fetchData(token, 'products/active-purses');
        if (fetchActivePurses !== false) setActivePurses(fetchActivePurses);

        const fetchInactivePurses = await fetchData(token, 'products/inactive-purses');
        if (fetchInactivePurses !== false) setInactivePurses(fetchInactivePurses);
      }
      getPursesData(token);
    }
  }, [token]);

  // Event handlers for socket updates
  function handleActivePurseAdded(newPurse: PurseTypes) {
    if(newPurse.active){
      setActivePurses(prev => [...prev, newPurse]);
    } else {
      setInactivePurses(prev => [...prev, newPurse]);
    }
    // setActivePurses((prevPurses) => [...prevPurses, newPurse]);
  }

  function handleInactivePurseAdded(newPurse: PurseTypes) {
    if(newPurse.active){
      setActivePurses(prev => [...prev, newPurse]);
    } else {
      setInactivePurses(prev => [...prev, newPurse]);
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

  function decreasePurseStockHandler(data: any){
    if(data.stockType === 'Boja-Veličina-Količina'){
      decreasePurseStock(data, setActivePurses as React.Dispatch<React.SetStateAction<PurseTypes[]>>)
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

      return () => {
        socket.off("activePurseAdded", handleActivePurseAdded);
        socket.off("inactivePurseAdded", handleInactivePurseAdded);
        socket.off("activePurseRemoved", handleActivePurseRemoved);
        socket.off("inactivePurseRemoved", handleInactivePurseRemoved);
        socket.off("activePurseToInactive", handleActiveToInactive);
        socket.off("inactivePurseToActive", handleInactiveToActive);
        socket.off('handlePurseStockDecrease', decreasePurseStockHandler);
      };
    }
  }, [socket]);

  // Memoizing the getters
  const value = useMemo(() => ({
    activePurses,
    setActivePurses: setActivePursesHandler,
    getActivePurses: getActivePursesHandler,
    inactivePurses,
    setInactivePurses: setInactivePursesHandler,
    getInactivePurses: getInactivePursesHandler,
  }), [activePurses, inactivePurses]);

  return <PursesContext.Provider value={value}>{children}</PursesContext.Provider>;
}

export default PursesContextProvider;
