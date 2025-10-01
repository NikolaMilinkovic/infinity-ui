import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Colors } from '../constants/colors';
import { popupMessage } from '../util-components/PopupMessage';
import { betterConsoleLog } from '../util-methods/LogMethods';

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
    console.log('> [PUSH] Starting registration...');
    console.log('> [PUSH] Is device?', Device.isDevice);

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
      console.log('> [PUSH] Existing permission status:', existingStatus);
      let finalStatus = existingStatus;

      // Request permission if not provided
      if (existingStatus !== 'granted') {
        console.log('> [PUSH] Requesting permissions...');
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log('> [PUSH] New permission status:', finalStatus);
      }

      if (finalStatus !== 'granted') {
        console.log('> [PUSH] Permission denied!');
        popupMessage('Notification permission denied :(', 'info');
        return null;
      }

      console.log('> [PUSH] Getting Expo push token...');
      console.log('> [PUSH] Project ID:', Constants.expoConfig?.extra?.eas?.projectId);
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

      try {
        const pushTokenString = await Notifications.getExpoPushTokenAsync({ projectId });
        console.log(`> [PUSH TOKEN BY OTHER WAY]: ${pushTokenString}`);
        setExpoPushToken(pushTokenString);
        return pushTokenString;
      } catch (error) {
        console.error('> [PUSH] Error getting token:', error);
        return null;
      }
    } else {
      console.error('> [PUSH] Not a physical device!');
      return null;
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? null))
      .catch((error: any) => betterConsoleLog('> Error while registering for push token', error));

    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(`> [PUSH] Response listener:`, response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  console.log('> [PUSH] Hook returning, current token:', expoPushToken);

  return {
    expoPushToken: expoPushToken || null,
    notification: notification || null,
  };
};
