import { useContext } from 'react';
import { AuthContext } from '../store/auth-context';

export function useAuthContext() {
  const authCtx = useContext(AuthContext);
  if (!authCtx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return authCtx;
}