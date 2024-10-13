import { createContext, useEffect, useState, ReactNode, useContext, useMemo } from "react";
import { AuthContext } from "./auth-context";
import { SocketContext } from "./socket-context";
import { fetchData } from "../util-methods/FetchMethods";

interface ColorType {
  _id: string;
  color: string;
  colorCode: string;
  stock: number;
}
interface PurseType {
  _id: string;
  name: string;
  active: boolean;
  category: string;
  price: number;
  colors: ColorType[];
}
interface PurseContextType {
  activePurses: PurseType[];
  inactivePurses: PurseType[];
  setActivePurses: (purses: PurseType[]) => void;
  setInactivePurses: (purses: PurseType[]) => void;
  getActivePurses: () => PurseType[];
  getInactivePurses: () => PurseType[];
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
  const [activePurses, setActivePurses] = useState<PurseType[]>([]);
  const [inactivePurses, setInactivePurses] = useState<PurseType[]>([]);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;

  // Setters
  const setActivePursesHandler = (purses: PurseType[]) => {
    setActivePurses(purses);
  };
  const setInactivePursesHandler = (purses: PurseType[]) => {
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
  function handleActivePurseAdded(newPurse: PurseType) {
    setActivePurses((prevPurses) => [...prevPurses, newPurse]);
  }

  function handleInactivePurseAdded(newPurse: PurseType) {
    setInactivePurses((prevPurses) => [...prevPurses, newPurse]);
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

  // Set up socket listeners
  useEffect(() => {
    if (socket) {
      socket.on('activePurseAdded', handleActivePurseAdded);
      socket.on('inactivePurseAdded', handleInactivePurseAdded);
      socket.on('activePurseRemoved', handleActivePurseRemoved);
      socket.on('inactivePurseRemoved', handleInactivePurseRemoved);
      socket.on('activePurseToInactive', handleActiveToInactive);
      socket.on('inactivePurseToActive', handleInactiveToActive);

      return () => {
        socket.off("activePurseAdded", handleActivePurseAdded);
        socket.off("inactivePurseAdded", handleInactivePurseAdded);
        socket.off("activePurseRemoved", handleActivePurseRemoved);
        socket.off("inactivePurseRemoved", handleInactivePurseRemoved);
        socket.off("activePurseToInactive", handleActiveToInactive);
        socket.off("inactivePurseToActive", handleInactiveToActive);
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
