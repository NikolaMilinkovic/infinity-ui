import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { User } from '../types/allTsTypes';
import { popupMessage } from '../util-components/PopupMessage';
import { updateUserExpoPushToken } from '../util-methods/auth/AuthMethods';
import { fetchData } from '../util-methods/FetchMethods';
import { betterErrorLog } from '../util-methods/LogMethods';
import { AuthContext } from './auth-context';
import { SocketContext } from './socket-context';
import { useTheme } from './theme-context';

interface UserContextTypes {
  user: User | null;
  setUser: (data: User | null) => void;
  updateUser: (field: string, value: any) => void;
  getUserValueForField: (keyName: string, fallback: any) => any;
  userHasPermission: (keyName: string, fallback: any) => any;
}
interface UserContextProviderTypes {
  children: ReactNode;
}
export const UserContext = createContext<UserContextTypes>({
  user: null,
  setUser: () => {},
  updateUser: () => {},
  getUserValueForField: () => {},
  userHasPermission: () => {},
});

function UserContextProvider({ children }: UserContextProviderTypes) {
  const theme = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;
  const { expoPushToken } = usePushNotifications();

  // HANDLE NOTIFICATION PUSH TOKEN
  useEffect(() => {
    if (token && expoPushToken?.data) {
      async function checkAndUpdateToken() {
        try {
          const userData = await fetchData(token, 'user/data');

          if (token && expoPushToken?.data) {
            if (expoPushToken?.data !== userData.pushToken) {
              await updateUserExpoPushToken(token, expoPushToken?.data);
            }
          }
        } catch (error) {
          betterErrorLog('> Error checking/updating push token', error);
        }
      }

      checkAndUpdateToken();
    }
  }, [token, expoPushToken?.data]);

  // FETCH USER DATA
  useEffect(() => {
    if (token) {
      const controller = new AbortController();
      const signal = controller.signal;

      async function fetchUserData(token: string) {
        try {
          const userData = await fetchData(token, 'user/data');
          setUser(userData.user);
          if (userData?.user?.settings.defaults?.theme) {
            theme.setTheme(userData?.user?.settings.defaults?.theme);
          } else {
            theme.setTheme('light');
          }
        } catch (error) {
          if (!signal.aborted) {
            betterErrorLog('> Došlo je do problema unutar UserContextProvider > fetchUserData metodi', error);
            popupMessage('Došlo je do problema unutar UserContextProvider > fetchUserData metodi', 'danger');
          }
        }
      }

      fetchUserData(token);
      return () => controller.abort();
    }
  }, [token, expoPushToken?.data]);

  const deepUpdate = (obj: any, key: string, value: any): boolean => {
    if (obj == null || typeof obj !== 'object') return false;
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      obj[key] = value;
      return true;
    }
    for (const prop in obj) {
      if (deepUpdate(obj[prop], key, value)) return true;
    }
    return false;
  };

  const updateUser = (field: string, value: any) => {
    setUser((prev: any) => {
      if (!prev) return prev;
      const copy = structuredClone(prev);
      deepUpdate(copy, field, value);
      return copy;
    });
  };

  function getUserValueForField(keyName: string, fallback: any = false) {
    if (!user || typeof user !== 'object') return fallback;

    function deepSearch(obj: any): any {
      for (const key in obj) {
        if (key === keyName) return obj[key];
        if (typeof obj[key] === 'object') {
          const value = deepSearch(obj[key]);
          if (value !== undefined) return value;
        }
      }
      return undefined;
    }

    return deepSearch(user) ?? fallback;
  }

  function handleUpdateUserPermissions() {}
  function handleUpdateUserSettings() {}

  useEffect(() => {
    if (socket) {
      socket.on('updateUserPermissions', handleUpdateUserPermissions);
      socket.on('updateUserSettings', handleUpdateUserSettings);

      return () => {
        socket.off('updateUserPermissions', handleUpdateUserPermissions);
        socket.off('updateUserSettings', handleUpdateUserSettings);
      };
    }
  }, [socket]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      updateUser,
      getUserValueForField,
      userHasPermission: getUserValueForField,
    }),
    [user, setUser]
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
