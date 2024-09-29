import { createContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  authenticate: (token:string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  token: '',
  isAuthenticated: false,
  authenticate: (token) => {},
  logout: () => {},
});


interface AuthContextProviderType {
  children: ReactNode
}
function AuthContextProvider({ children }:AuthContextProviderType){
  const [authToken, setAuthToken] = useState<string | null>(null);

  function authenticate(token:string){
    setAuthToken(token);
    AsyncStorage.setItem('token', token);
  }
  function logout(){
    setAuthToken(null);
    AsyncStorage.removeItem('token');
  }

  const value:AuthContextType = {
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  }

  return <AuthContext.Provider value={value}>{ children }</AuthContext.Provider>
}

export default AuthContextProvider