import { useContext } from 'react';
import { AuthContext } from '../store/auth-context';

const useAuthToken = () => {
  const authCtx = useContext(AuthContext);
  return authCtx.token;
};

export default useAuthToken;