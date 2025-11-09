import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { popupMessage } from '../util-components/PopupMessage';
import { fetchData } from '../util-methods/FetchMethods';
import { betterErrorLog } from '../util-methods/LogMethods';
import { AuthContext } from './auth-context';
import { SocketContext } from './socket-context';
import { useUser } from './user-context';

interface UsersManagerContextTypes {
  usersList: any[];
  setUsersList: (users: any[]) => void;
  addUser: (user: any) => void;
  updateUser: (user: any) => void;
  removeUser: (userId: string) => void;
}

interface UsersManagerProviderTypes {
  children: ReactNode;
}

export const UsersManagerContext = createContext<UsersManagerContextTypes>({
  usersList: [],
  setUsersList: () => {},
  addUser: () => {},
  updateUser: () => {},
  removeUser: () => {},
});

function UsersManagerProvider({ children }: UsersManagerProviderTypes) {
  const [usersList, setUsersList] = useState<any[]>([]);
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const { user } = useUser();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchBoutiqueUsers() {
      if (token && user?.role === 'admin') {
        try {
          const usersData = await fetchData(token, 'admin/get-boutique-users');
          if (usersData?.usersList) {
            setUsersList(usersData.usersList);
          }
        } catch (error) {
          if (!signal.aborted) {
            betterErrorLog('> Došlo je do problema prilikom preuzimanja podataka o korisnicima', error);
            popupMessage('Došlo je do problema prilikom preuzimanja podataka o korisnicima', 'danger');
          }
        }
      }
    }
    fetchBoutiqueUsers();
    return () => controller.abort();
  }, [user, token]);

  function addUser(user: any) {
    setUsersList((prev) => [...prev, user]);
  }

  function updateUser(updatedUser: any) {
    setUsersList((prev) => prev.map((user) => (user?._id === updatedUser?._id ? updatedUser : user)));
  }

  function removeUser(userId: string) {
    setUsersList((prev) => prev.filter((user) => user?._id !== userId));
  }

  // Socket listeners for real-time updates
  useEffect(() => {
    if (socket) {
      socket.on('addUser', addUser);
      socket.on('updateUser', updateUser);
      socket.on('removeUser', removeUser);

      return () => {
        socket.off('addUser', addUser);
        socket.off('updateUser', updateUser);
        socket.off('removeUser', removeUser);
      };
    }
  }, [socket]);

  const value = useMemo(
    () => ({
      usersList,
      setUsersList,
      addUser,
      updateUser,
      removeUser,
    }),
    [usersList]
  );

  return <UsersManagerContext.Provider value={value}>{children}</UsersManagerContext.Provider>;
}

export function useUsersManager() {
  const context = useContext(UsersManagerContext);

  if (!context) {
    throw new Error('useUsersManager must be used within a UsersManagerProvider');
  }

  return context;
}

export default UsersManagerProvider;
