import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Colors } from '../constants/colors';
import { popupMessage } from '../util-components/PopupMessage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldShowAlert: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
export interface PushNotificationState {
  notification?: Notifications.Notification | null;
  expoPushToken?: Notifications.ExpoPushToken | null;
}
export const usePushNotifications = (): PushNotificationState => {
  const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);

  /**
   * Registers for push notifications
   */
  async function registerForPushNotificationsAsync(): Promise<Notifications.ExpoPushToken | null> {
    // Settings for Android platform
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: Colors.secondaryDark,
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permission if not provided
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return null;
      }

      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

      try {
        const pushTokenString = await Notifications.getExpoPushTokenAsync({ projectId });
        setExpoPushToken(pushTokenString);
        return pushTokenString;
      } catch (error) {
        popupMessage('Došlo je do problema prilikom preuzimanja push tokena', 'danger');
        return null;
      }
    } else {
      return null;
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? null))
      .catch((error: any) => {
        popupMessage('Došlo je do problema prilikom registrovanja push tokena', 'danger');
      });

    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return {
    expoPushToken: expoPushToken || null,
    notification: notification || null,
  };
};
