import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { popupMessage } from '../util-components/PopupMessage';
import { updateUserExpoPushToken } from '../util-methods/auth/AuthMethods';
import { fetchData } from '../util-methods/FetchMethods';
import { betterErrorLog } from '../util-methods/LogMethods';
import { AuthContext } from './auth-context';
import { SocketContext } from './socket-context';

interface UserContextTypes {
  permissions: any;
  setPermissions: any;
  settings: any;
  setSettings: any;
  userRole: string | null;
  getUserRole: () => string | null;
  usersList: any[];
}
interface UserContextProviderTypes {
  children: ReactNode;
}
export const UserContext = createContext<UserContextTypes>({
  permissions: {},
  setPermissions: () => {},
  settings: {},
  setSettings: () => {},
  userRole: '',
  getUserRole: () => '',
  usersList: [],
});

function UserContextProvider({ children }: UserContextProviderTypes) {
  const [permissions, setPermissions] = useState(null);
  const [settings, setSettings] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [activeUserId, setActiveUserId] = useState(null);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;
  const { expoPushToken } = usePushNotifications();
  const [usersList, setUsersList] = useState<any[]>([]);

  function getUserRole() {
    return userRole;
  }

  async function getUserData(token: string, expoPushToken: string | undefined) {
    try {
      const userData = await fetchData(token, 'user/data');
      setPermissions(userData.permissions || null);
      setSettings(userData.settings || null);
      setUserRole(userData.role || null);
      setUsersList(userData.usersList || []);
      setActiveUserId(userData.id || null);

      if (expoPushToken && expoPushToken !== userData.pushToken) {
        await updateUserExpoPushToken(token, expoPushToken);
      }
    } catch (error) {
      betterErrorLog('> Došlo je do problema unutar UserContextProvider > getUserData metodi', error);
      popupMessage('Došlo je do problema unutar UserContextProvider > getUserData metodi', 'danger');
    }
  }

  useEffect(() => {
    if (token) {
      const controller = new AbortController();
      const signal = controller.signal;

      /**
       * Fetches user.permissions, user.settings, user.role and pushToken
       *
       * Sets the values of the contex & compares the remote pushToken with local
       *
       * If pushTokens differ updates the remote to match the local
       */
      async function getUserData(token: string, expoPushToken: string | undefined) {
        try {
          const userData = await fetchData(token, 'user/data');
          setPermissions(userData.permissions || null);
          setSettings(userData.settings || null);
          setUserRole(userData.role || null);
          setUsersList(userData.usersList || []);
          setActiveUserId(userData.id || null);

          if (expoPushToken && expoPushToken !== userData.pushToken) {
            await updateUserExpoPushToken(token, expoPushToken);
          }
        } catch (error) {
          if (!signal.aborted) {
            betterErrorLog('> Došlo je do problema unutar UserContextProvider > getUserData metodi', error);
            popupMessage('Došlo je do problema unutar UserContextProvider > getUserData metodi', 'danger');
          }
        }
      }
      getUserData(token, expoPushToken?.data);
      return () => controller.abort();
    }
  }, [token, expoPushToken]);

  function handleUpdateUserPermissions() {}
  function handleUpdateUserSettings() {}
  async function handleUpdateUser(updatedUser: any, receivedToken: string) {
    setUsersList((prev) => prev.map((user) => (user._id === updatedUser._id ? updatedUser : user)));
    if (token === receivedToken) {
      await getUserData(token, expoPushToken?.data);
    }
  }
  function handleRemoveUser(userId: string) {
    setUsersList((prev) => prev.filter((user) => user._id !== userId));
  }
  function addUserHandler(user: any) {
    setUsersList((prev) => [...prev, user]);
  }

  useEffect(() => {
    if (socket) {
      socket.on('updateUserPermissions', handleUpdateUserPermissions);
      socket.on('updateUserSettings', handleUpdateUserSettings);
      socket.on('updateUser', handleUpdateUser);
      socket.on('removeUser', handleRemoveUser);
      socket.on('addUser', addUserHandler);

      return () => {
        socket.off('updateUserPermissions', handleUpdateUserPermissions);
        socket.off('updateUserSettings', handleUpdateUserSettings);
        socket.off('updateUser', handleUpdateUser);
        socket.off('removeUser', handleRemoveUser);
        socket.off('addUser', addUserHandler);
      };
    }
  }, [socket]);

  const value = useMemo(
    () => ({
      permissions,
      setPermissions,
      settings,
      setSettings,
      userRole,
      getUserRole,
      usersList,
    }),
    [permissions, settings, userRole, usersList]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider');
  }

  return context;
}

export default UserContextProvider;
