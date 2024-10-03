import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { popupMessage } from '../util-components/PopupMessage';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);

      if (!state.isConnected) {
        popupMessage('Konekcija sa internetom izgubljena!', 'danger');
      } else {
        popupMessage('Konekcija sa internetom uspostavljena!', 'success');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return isConnected;
}
