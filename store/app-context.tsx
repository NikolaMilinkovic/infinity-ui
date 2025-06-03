import Constants from 'expo-constants';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { fetchData } from '../util-methods/FetchMethods';
import { betterErrorLog } from '../util-methods/LogMethods';
import { AuthContext } from './auth-context';
import { SocketContext } from './socket-context';

interface AppContextTypes {
  defaults: any;
  version: string;
  buildLink: string;
}
interface AppContextProviderTypes {
  children: ReactNode;
}
export const AppContext = createContext<AppContextTypes>({
  defaults: {},
  version: '',
  buildLink: '',
});

function AppContextProvider({ children }: AppContextProviderTypes) {
  const [defaults, setDefaults] = useState({});
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
          setDefaults(response.settings);
          setVersion(response?.version || '');
          setBuildLink(response?.buildLink || '');
        } catch (error) {
          betterErrorLog('> Error in method getAppSettings', error);
        }
      }
      getAppSettings(token);
    }
  }, [token]);

  function handleUpdateAppDefaults() {}

  useEffect(() => {
    if (socket) {
      socket.on('updateAppDefaults', handleUpdateAppDefaults);

      return () => {
        socket.off('updateAppDefaults', handleUpdateAppDefaults);
      };
    }
  }, [socket]);

  const value = useMemo(
    () => ({
      defaults,
      version,
      buildLink,
    }),
    [defaults, version, buildLink]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContextProvider;
