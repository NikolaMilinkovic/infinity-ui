import Constants from 'expo-constants';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { fetchData } from '../util-methods/FetchMethods';
import { betterConsoleLog, betterErrorLog } from '../util-methods/LogMethods';
import { AuthContext } from './auth-context';
import { LogContext } from './log-context';
import { SocketContext } from './socket-context';

interface AppContextTypes {
  version: string | undefined;
  buildLink: string;
  appSettings: any;
}
interface AppContextProviderTypes {
  children: ReactNode;
}
export const AppContext = createContext<AppContextTypes>({
  version: '',
  buildLink: '',
  appSettings: {},
});

export function useGetAppContexts() {
  return useContext(AppContext);
}

function AppContextProvider({ children }: AppContextProviderTypes) {
  const { add_new_startup_log, update_startup_log } = useContext(LogContext);
  const [appSettings, setAppSettings] = useState({});
  const [version, setVersion] = useState(Constants?.expoConfig?.version);
  const [buildLink, setBuildLink] = useState('');
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;

  useEffect(() => {
    if (token) {
      async function getAppSettings(token: string) {
        try {
          const response = await fetchData(token, 'app/settings');
          setAppSettings(response.settings);
          setVersion(response?.version || '');
          setBuildLink(response?.buildLink || '');
          update_startup_log('app_context', {
            text: '> App Context: SUCCESS',
            success: true,
          });
        } catch (error) {
          update_startup_log('app_context', {
            text: '> App Context: FAIL',
            success: false,
          });
          betterErrorLog('> Error in method getAppSettings', error);
        }
      }

      add_new_startup_log('app_context', {
        text: '> App Context: FETCHING...',
        success: false,
      });
      getAppSettings(token);
    }
  }, [token]);

  function handleUpdateAppSettings(updatedAppSettings: any) {
    betterConsoleLog('> updatedAppSettings', updatedAppSettings);
    setAppSettings(updatedAppSettings.settings);
  }

  useEffect(() => {
    if (socket) {
      socket.on('updateAppSettings', handleUpdateAppSettings);

      return () => {
        socket.off('updateAppSettings', handleUpdateAppSettings);
      };
    }
  }, [socket]);

  const value = useMemo(
    () => ({
      appSettings,
      version,
      buildLink,
    }),
    [appSettings, version, buildLink]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContextProvider;
