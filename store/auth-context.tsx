import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useState } from 'react';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  authenticate: (token: string) => void;
  logout: () => void;
  verifyToken: (token: string) => boolean;
}

export const AuthContext = createContext<AuthContextType>({
  token: '',
  isAuthenticated: false,
  authenticate: (token) => {},
  logout: () => {},
  verifyToken: (token) => false,
});

interface AuthContextProviderType {
  children: ReactNode;
}
function AuthContextProvider({ children }: AuthContextProviderType) {
  const [authToken, setAuthToken] = useState<string | null>(null);

  function authenticate(token: string) {
    setAuthToken(token);
    AsyncStorage.setItem('token', token);
  }
  function logout() {
    setAuthToken(null);
    AsyncStorage.removeItem('token');
  }
  function verifyToken(token: string) {
    // FETCH CLL HERE AND SOMETHING, WE RETURN TRUE OR FALSE!!!
    return false;
  }

  const value: AuthContextType = {
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
    verifyToken: verifyToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
