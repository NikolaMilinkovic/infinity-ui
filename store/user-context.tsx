import { createContext, ReactNode, useContext, useEffect, useMemo, useState, Dispatch, SetStateAction } from "react"
import { AuthContext } from "./auth-context";
import { fetchData } from "../util-methods/FetchMethods";
import { betterConsoleLog } from "../util-methods/LogMethods";
import { SocketContext } from "./socket-context";

interface UserContextTypes {
  permissions: any
  setPermissions: any
  settings: any
  setSettings: any
}
interface UserContextProviderTypes {
  children: ReactNode;
}
export const UserContext = createContext<UserContextTypes>({
  permissions: {},
  setPermissions: () => {},
  settings: {},
  setSettings: () => {},
})

function UserContextProvider({ children }: UserContextProviderTypes){
  const [permissions, setPermissions] = useState(null);
  const [settings, setSettings] = useState(null);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;

  useEffect(() => {
    if(token){
      async function getUserData(token: string){
        try{
          const userData = await fetchData(token, 'user/data');
          console.log(userData.settings);
          setPermissions(userData.permissions || null);
          setSettings(userData.settings || null);
        } catch(error){
          console.log(error)
        }
      }
      getUserData(token);
    }
  },[token]);

  function handleUpdateUserPermissions(){

  }

  useEffect(() => {
    betterConsoleLog('> Logging defaults from user context', settings?.defaults);
  }, [settings?.defaults?.listProductsBy]);

  // Saljemo celokupan user settings
  // Na backendu poredim svaki field i update
  // Save - Done
  function handleUpdateUserSettings(){

  }

  useEffect(() => {
    if(socket) {
      socket.on('updateUserPermissions', handleUpdateUserPermissions);
      socket.on('updateUserSettings', handleUpdateUserSettings);

      return () => {
        socket.off('updateUserPermissions', handleUpdateUserPermissions)
        socket.off('updateUserSettings', handleUpdateUserSettings)
      }
    }
  },[socket]);

  const value = useMemo(() => ({
    permissions,
    setPermissions,
    settings,
    setSettings,
  }), [permissions, settings]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContextProvider