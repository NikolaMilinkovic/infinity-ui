import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react"
import { AuthContext } from "./auth-context";
import { fetchData } from "../util-methods/FetchMethods";
import { betterConsoleLog } from "../util-methods/LogMethods";
import { SocketContext } from "./socket-context";

interface UserContextTypes {
  permissions: any
  settings: any
}
interface UserContextProviderTypes {
  children: ReactNode;
}
export const UserContext = createContext<UserContextTypes>({
  permissions: [],
  settings: [],
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
    settings,
  }), [permissions, settings]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContextProvider