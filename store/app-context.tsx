import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react"
import { AuthContext } from "./auth-context";
import { fetchData } from "../util-methods/FetchMethods";
import { betterConsoleLog } from "../util-methods/LogMethods";
import { SocketContext } from "./socket-context";

interface AppContextTypes {
  defaults: any
}
interface AppContextProviderTypes {
  children: ReactNode;
}
export const AppContext = createContext<AppContextTypes>({
  defaults: {}
})

function AppContextProvider({ children }: AppContextProviderTypes){
  const [defaults, setDefaults] = useState({});
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;

  useEffect(() => {
    if(token){
      async function getAppSettings(token: string){
        try{
          const appSettings = await fetchData(token, 'app/settings');
          setDefaults(appSettings.defaults || null);
        } catch(error){
          console.log(error)
        }
      }
      getAppSettings(token);
    }
  },[token]);

  function handleUpdateAppDefaults(){

  }

  useEffect(() => {
    if(socket) {
      socket.on('updateAppDefaults', handleUpdateAppDefaults);

      return () => {
        socket.off('updateAppDefaults', handleUpdateAppDefaults)
      }
    }
  },[socket]);

  const value = useMemo(() => ({
    defaults,
  }), [defaults]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContextProvider