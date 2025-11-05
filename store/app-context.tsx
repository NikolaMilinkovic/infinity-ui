import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { BoutiqueTypes, defaultBoutique, VersionDataTypes } from '../types/allTsTypes';
import { popupMessage } from '../util-components/PopupMessage';
import { fetchData } from '../util-methods/FetchMethods';
import { betterErrorLog } from '../util-methods/LogMethods';
import { AuthContext } from './auth-context';
import { SocketContext } from './socket-context';

interface AppContextTypes {
  data: BoutiqueTypes;
  versionData: VersionDataTypes;
}
interface AppContextProviderTypes {
  children: ReactNode;
}
export const AppContext = createContext<AppContextTypes>({
  data: defaultBoutique,
  versionData: {
    version: '',
    buildLinkAndroid: '',
    buildLinkIOS: '',
  },
});

function AppContextProvider({ children }: AppContextProviderTypes) {
  const [data, setData] = useState(defaultBoutique);
  const [versionData, setVersionData] = useState({
    version: '',
    buildLinkAndroid: '',
    buildLinkIOS: '',
  });
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;

  useEffect(() => {
    if (token) {
      async function getAppSettings(token: string) {
        try {
          const response = await fetchData(token, 'app/settings');
          setData(response.boutiqueData);
          const versionDataResponse = await fetchData(token, 'app/version');
          setVersionData(versionDataResponse.versionData);
        } catch (error) {
          betterErrorLog('> Error in method getAppSettings', error);
        }
      }
      getAppSettings(token);
    } else {
      setData(defaultBoutique);
    }
  }, [token]);

  function handleUpdateAppSettings(appData: any) {
    setData(appData);
    if (appData.settings.appIcon.appIconUri && appData.settings.appIcon.appIconName) {
      popupMessage('Podešavanje aplikacije uspešno ažurirano', 'success');
    } else {
      popupMessage('Došlo je do problema prilikom ažuriranja podešavanja aplikacije', 'danger');
    }
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
      data,
      versionData,
      setAppData: setData,
    }),
    [data, versionData]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useBoutique() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('BoutiqueContext must be used within a BoutiqueContextProvider');
  }

  return context;
}

export default AppContextProvider;
