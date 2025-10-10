import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { LogBox, View } from 'react-native';
import 'react-native-reanimated';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import StartupOverlay from './components/loading/StartupOverlay';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import AuthStack from './navigation/AuthStack';
import AuthenticatedStack from './navigation/AuthenticatedStack';
import ContextProvider from './store/ContextProvider';
import { AuthContext } from './store/auth-context';
import { PopupMessagesComponent } from './util-components/PopupMessage';

// Suppresses the VirtualizedList nesting warning
LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews']);
configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: false,
});

/**
 * Handles different Navigation Stack based on isAuthenticated flag in the context
 * Itterates between AuthStack & AuthenticatedStack
 */
function Navigation() {
  const authCtx = useContext(AuthContext);
  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}
function Root() {
  console.log('> Root rendering..');
  /**
   * Makes the native splash screen remain visible until hideAsync is called.
   */
  // useEffect(() => {
  //   SplashScreen.preventAutoHideAsync();
  // }, []);

  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const authCtx = useContext(AuthContext);

  /**
   * Checks the token in the AsyncStorage upon app startup
   * Finds token => Adds it to the Auth Context
   * No token => Logout user
   */
  useEffect(() => {
    async function getToken() {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          authCtx.authenticate(token);
        } else {
          authCtx.logout();
        }
      } catch (err) {
        console.error('Error while checking token:', err);
        authCtx.logout();
      } finally {
        setIsCheckingToken(false);
      }
    }

    getToken();
  }, [authCtx]);

  /**
   * Hide spash screen on app load
   */
  const onLayoutRootView = useCallback(async () => {
    if (!isCheckingToken) {
      try {
        // This tells the splash screen to hide immediately! If we call this after
        // `setAppIsReady`, then we may see a blank screen while the app is
        // loading its initial state and rendering its first pixels. So instead,
        // we hide the splash screen once we know the root view has already
        // performed layout.
        await SplashScreen.hideAsync();
      } catch (err) {
        console.error('Error hiding splash screen:', err);
      }
    }
  }, [isCheckingToken]);

  const [showFakeSplash, setShowFakeSplash] = useState(true);

  return (
    // <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {/* App content renders in the background */}
      {!isCheckingToken && (
        <>
          <PopupMessagesComponent />
          <Navigation />
        </>
      )}

      {/* Fake splash overlays the whole screen and fades out */}
      {showFakeSplash && <StartupOverlay onFinish={() => setShowFakeSplash(false)} />}
    </View>
  );
}

export default function App() {
  const networkStatus = useNetworkStatus();
  return (
    // <React.StrictMode>
    <>
      <StatusBar style="light" />
      <ContextProvider>
        <Root />
      </ContextProvider>
    </>
    // </React.StrictMode>
  );
}
