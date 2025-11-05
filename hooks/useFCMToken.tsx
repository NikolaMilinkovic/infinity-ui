import messaging from '@react-native-firebase/messaging';
import { useEffect, useState } from 'react';

export const useFCMToken = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    async function registerToken() {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) return;

      const token = await messaging().getToken();
      setFcmToken(token);
    }

    registerToken();

    // Optional: listen for token refresh
    const unsubscribe = messaging().onTokenRefresh((token) => {
      setFcmToken(token);
    });

    return () => unsubscribe();
  }, []);

  return fcmToken;
};
