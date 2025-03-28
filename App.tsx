import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from './store/auth-context';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from 'react-native';
import ContextProvider from './store/ContextProvider';
import { PopupMessagesComponent } from './util-components/PopupMessage';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import AuthStack from './navigation/AuthStack';
import AuthenticatedStack from './navigation/AuthenticatedStack';
import { LogBox } from 'react-native';
import { betterConsoleLog } from './util-methods/LogMethods';
import { usePushNotifications } from './hooks/usePushNotifications';

// Suppresses the VirtualizedList nesting warning
LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews']);

/**
 * Handles different Navigation Stack based on isAuthenticated flag in the context
 * Itterates between AuthStack & AuthenticatedStack
 */
function Navigation() {
  const authCtx = useContext(AuthContext);
  betterConsoleLog('> Logging is Authenticated', authCtx.isAuthenticated);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}
function Root() {
  /**
   * Makes the native splash screen remain visible until hideAsync is called.
   */
  SplashScreen.preventAutoHideAsync();
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const authCtx = useContext(AuthContext);

  /**
   * Checks the token in the AsyncStorage upon app startup
   * Finds token => Adds it to the Auth Context
   * No token => Logout user
   */
  useEffect(() => {
    async function getToken() {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        authCtx.authenticate(token);
        // if(authCtx.verifyToken(token)){
        // } else {
        // authCtx.logout();
        // }
      } else {
        authCtx.logout();
      }

      setIsCheckingToken(false);
    }

    getToken();
  }, [authCtx]);

  /**
   * Hide spash screen on app load
   */
  const onLayoutRootView = useCallback(async () => {
    if (!isCheckingToken) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [isCheckingToken]);

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <PopupMessagesComponent />
      <Navigation />
    </View>
  );
}

export default function App() {
  const { expoPushToken, notification } = usePushNotifications();
  const networkStatus = useNetworkStatus();

  // const data = JSON.stringify(notification, undefined, 2);
  // useEffect(() => {
  //   console.log(`> PUSH TOKEN: ${expoPushToken?.data}`);
  //   console.log(`> DATA: ${data}`);
  // }, [expoPushToken?.data, data]);
  return (
    <>
      <StatusBar style="light" />
      <ContextProvider>
        <Root />
      </ContextProvider>
    </>
  );
}
