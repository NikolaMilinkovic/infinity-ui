import { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export interface PushNotificationState {
  notification?: Notifications.Notification;
  expoPushToken?: Notifications.ExpoPushToken;
}

export const usePushNotifications = (): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldShowAlert: true,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  /**
   *  Handles registering for push notifications, request permission
   *  @returns
   */
  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Permission request
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      // Alert user | Stavi nasu notifikaciju
      if (finalStatus !== 'granted') {
        alert('> Failed to get push token');
      }

      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 255, 255, 255],
          lightColor: '#FF231F7C',
        });
      }

      return token;
    } else {
      console.log('> Error: Please use a physical device to register for push notifications.');
    }
  }

  useEffect(() => {
    async function register() {
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token);
      notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(`> Logging responseListener.current: ${response}`);
      });
    }

    register();
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current!);
      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
};
